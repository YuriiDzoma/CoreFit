import { createClient } from '@/utils/supabase/client';

/**
 * `get_random_exercise_leaderboard` (Postgres function, SECURITY DEFINER --
 * see the mobile repo's supabase/migrations/20260816062432_add_get_random_exercise_leaderboard_function.sql,
 * the single source of truth for this RPC, shared by both apps against the
 * same Supabase project) picks one random exercise among those with at
 * least one valid logged weight and returns up to the top 3 users by max
 * weight for it, one row per user (all rows share the same exercise
 * fields). An empty array means nobody has logged a parseable weight for
 * any exercise yet -- not an error.
 */
type LeaderboardRow = {
    exercise_id: string;
    name_en: string | null;
    name_uk: string | null;
    name_ru: string | null;
    image_url: string | null;
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
};

export type ExerciseLeaderboard = {
    exerciseId: string;
    exerciseName: string;
    exerciseImageUrl: string | null;
    entries: LeaderboardEntry[];
};

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

export async function getRandomExerciseLeaderboard(
    lang: 'eng' | 'ukr' | 'rus' | 'pl',
): Promise<ExerciseLeaderboard | null> {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_random_exercise_leaderboard');

    if (error) {
        console.error('Error fetching exercise leaderboard:', error.message);
        return null;
    }

    const rows = (data ?? []) as LeaderboardRow[];
    if (rows.length === 0) return null;

    const [first] = rows;
    return {
        exerciseId: first.exercise_id,
        exerciseName: localizeName(first, lang),
        exerciseImageUrl: first.image_url,
        entries: rows.map((row) => ({
            userId: row.user_id,
            username: row.username,
            avatarUrl: row.avatar_url,
            weight: row.weight,
        })),
    };
}
