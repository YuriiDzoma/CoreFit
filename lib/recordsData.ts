import { createClient } from '@/utils/supabase/client';

/**
 * `get_exercise_leaderboards` (Postgres function, SECURITY DEFINER -- see
 * the mobile repo's supabase/migrations/20260816080011_replace_leaderboard_with_paginated_exercise_leaderboards.sql,
 * the single source of truth for this RPC, shared by both apps against the
 * same Supabase project) returns a page of exercises (default 10,
 * optionally filtered to one muscle group) that have at least one valid
 * logged weight, each with up to its top 3 users by max weight -- flat
 * rows, ordered by exercise name then rank, grouped into
 * `ExerciseLeaderboard[]` below. An empty array means no exercise
 * (matching the filter) has a parseable logged weight yet -- not an error.
 */
type LeaderboardRow = {
    exercise_id: string;
    name_en: string | null;
    name_uk: string | null;
    name_ru: string | null;
    image_url: string | null;
    rank: number;
    user_id: string;
    username: string | null;
    avatar_url: string | null;
    weight: number;
};

export type LeaderboardEntry = {
    userId: string;
    username: string | null;
    avatarUrl: string | null;
    weight: number;
    rank: number;
};

export type ExerciseLeaderboard = {
    exerciseId: string;
    exerciseName: string;
    exerciseImageUrl: string | null;
    entries: LeaderboardEntry[];
};

export const RECORDS_PAGE_SIZE = 10;

// Same field-map/fallback convention as trainingData.ts's fetchExercisesByGroup:
// only en/uk/ru have DB columns, 'pl' falls back to English.
const NAME_FIELD_BY_LANG: Record<'eng' | 'ukr' | 'rus', keyof LeaderboardRow> = {
    eng: 'name_en',
    ukr: 'name_uk',
    rus: 'name_ru',
};

function localizeName(row: LeaderboardRow, lang: 'eng' | 'ukr' | 'rus' | 'pl'): string {
    const field = NAME_FIELD_BY_LANG[lang as 'eng' | 'ukr' | 'rus'] ?? 'name_en';
    return (row[field] as string | null) ?? row.name_en ?? '';
}

export type GetExerciseLeaderboardsParams = {
    muscleGroupId: string | null;
    lang: 'eng' | 'ukr' | 'rus' | 'pl';
    offset?: number;
    limit?: number;
};

export async function getExerciseLeaderboards({
    muscleGroupId,
    lang,
    offset = 0,
    limit = RECORDS_PAGE_SIZE,
}: GetExerciseLeaderboardsParams): Promise<ExerciseLeaderboard[]> {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_exercise_leaderboards', {
        p_muscle_group_id: muscleGroupId,
        p_limit: limit,
        p_offset: offset,
    });

    if (error) {
        console.error('Error fetching exercise leaderboards:', error.message);
        return [];
    }

    const rows = (data ?? []) as LeaderboardRow[];

    // Rows arrive already grouped by exercise (the RPC's own ORDER BY), so
    // a single linear pass folds flat rows into one leaderboard per exercise.
    const leaderboards: ExerciseLeaderboard[] = [];
    for (const row of rows) {
        const current = leaderboards.at(-1);
        if (current?.exerciseId === row.exercise_id) {
            current.entries.push({
                userId: row.user_id,
                username: row.username,
                avatarUrl: row.avatar_url,
                weight: row.weight,
                rank: row.rank,
            });
            continue;
        }
        leaderboards.push({
            exerciseId: row.exercise_id,
            exerciseName: localizeName(row, lang),
            exerciseImageUrl: row.image_url,
            entries: [
                {
                    userId: row.user_id,
                    username: row.username,
                    avatarUrl: row.avatar_url,
                    weight: row.weight,
                    rank: row.rank,
                },
            ],
        });
    }

    return leaderboards;
}
