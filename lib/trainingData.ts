import {createClient} from '@/utils/supabase/client';

export const getMuscleGroupIdByName = async (group: string): Promise<string | null> => {
    const supabase = createClient();

    const {data, error} = await supabase
        .from('muscle_groups')
        .select('id')
        .eq('name', group)
        .single();

    if (error || !data) {
        console.error('Error fetching muscle group id:', error?.message || 'Not found');
        return null;
    }

    return data.id;
};


export const fetchExercisesByGroup = async (
    group: string,
    lang: 'eng' | 'ukr' | 'rus'
): Promise<{ id: string; name: string; image: string }[]> => {
    const supabase = createClient();

    const fieldMap = {
        eng: 'name_en',
        ukr: 'name_uk',
        rus: 'name_ru',
    };

    const nameField = fieldMap[lang];

    let query = supabase
        .from('exercises')
        .select(`id, ${nameField}, image_url`);

    if (group !== 'All') {
        const groupId = await getMuscleGroupIdByName(group);
        if (!groupId) return [];

        query = query.eq('muscle_group_id', groupId);
    }

    const {data, error} = await query;

    if (error || !data) {
        console.error('Error fetching exercises:', error?.message);
        return [];
    }

    return data.map((exercise: Record<string, any>) => ({
        id: exercise.id,
        name: exercise[nameField],
        image: exercise.image_url,
    }));
};

export const fetchExerciseById = async (
    id: string,
    lang: 'eng' | 'ukr' | 'rus'
): Promise<{
    name: string;
    description: string;
    secondary: string;
    video: string;
    image: string;
    type: string;
} | null> => {
    const supabase = createClient();

    const fieldMap = {
        eng: 'name_en',
        ukr: 'name_uk',
        rus: 'name_ru',
    };

    const descMap = {
        eng: 'description_en',
        ukr: 'description_uk',
        rus: 'description_ru',
    };

    const secondaryMap = {
        eng: 'secondary_en',
        ukr: 'secondary_uk',
        rus: 'secondary_ru',
    };

    const nameField = fieldMap[lang];
    const descField = descMap[lang];
    const secondaryField = secondaryMap[lang];

    const selectFields = [
        'id',
        nameField,
        descField,
        secondaryField,
        'video_url',
        'image_url',
        'type',
    ].join(',');

    const {data, error} = await supabase
        .from('exercises')
        .select(selectFields)
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error('Error fetching exercise by ID:', error?.message);
        return null;
    }

    const record = data as Record<string, any>;

    return {
        name: record[nameField],
        description: record[descField],
        secondary: record[secondaryField],
        video: record.video_url,
        image: record.image_url,
        type: record.type,
    };
};

export const fetchExercisesByIds = async (
    ids: string[],
    lang: 'eng' | 'ukr' | 'rus'
): Promise<Record<string, { name: string; image: string }>> => {
    const supabase = createClient();

    if (!ids.length) return {};

    const fieldMap = {
        eng: 'name_en',
        ukr: 'name_uk',
        rus: 'name_ru',
    };

    const nameField = fieldMap[lang];

    const {data, error} = await supabase
        .from('exercises')
        .select(`id, ${nameField}, image_url`)
        .in('id', ids);

    if (error || !data) {
        console.error('Error fetching exercises by IDs:', error?.message);
        return {};
    }

    const map: Record<string, { name: string; image: string }> = {};

    data.forEach((ex: Record<string, any>) => {
        map[ex.id] = {
            name: ex[nameField],
            image: ex.image_url,
        };
    });
    return map;
};

export const createTrainingProgram = async (
    userId: string,
    title: string,
    type: string,
    level: string,
    days: { dayNumber: number; exercises: string[] }[]
): Promise<string | null> => {
    const supabase = createClient();

    const {data: program, error: programError} = await supabase
        .from('programs')
        .insert([{user_id: userId, title, type, level, days_count: days.length}])
        .select()
        .single();

    if (programError || !program) {
        console.error('Program insert error:', programError?.message);
        return null;
    }

    const daysToInsert = days.map((d) => ({
        program_id: program.id,
        day_number: d.dayNumber,
        title: `Day ${d.dayNumber}`,
    }));

    const {data: insertedDays, error: daysError} = await supabase
        .from('program_days')
        .insert(daysToInsert)
        .select();

    if (daysError || !insertedDays) {
        console.error('Program days insert error:', daysError?.message);
        return null;
    }

    const dayIdMap = new Map(insertedDays.map((d) => [d.day_number, d.id]));

    const exercisesToInsert = days.flatMap((day) =>
        day.exercises.map((exerciseId, index) => ({
            day_id: dayIdMap.get(day.dayNumber),
            exercise_id: exerciseId,
            order_index: index + 1,
        }))
    );

    const {error: exercisesError} = await supabase
        .from('program_exercises')
        .insert(exercisesToInsert);

    if (exercisesError) {
        console.error('Program exercises insert error:', exercisesError.message);
        return null;
    }

    return program.id;
};


export const fetchTrainingHistory = async (
    dayId: string
): Promise<{ date: string; values: Record<string, string> }[]> => {
    const supabase = createClient();

    const {data, error} = await supabase
        .from('training_history')
        .select('date, values')
        .eq('day_id', dayId)
        .order('date', {ascending: false});

    if (error) {
        console.error('Error fetching training history:', error.message);
        return [];
    }

    return data as { date: string; values: Record<string, string> }[];
};

export const fetchAllTrainingHistories = async () => {
    const supabase = createClient();

    const {data, error} = await supabase
        .from('training_history')
        .select(`
            id,
            date,
            values,
            created_at,
            profiles (
                username,
                avatar_url
            ),
            program_days (
                day_number,
                programs (
                    title
                )
            )
        `)
        .order('created_at', {ascending: false});

    if (error) {
        console.error('Error fetching training histories:', error.message);
        return [];
    }

    return data;
};


export const fetchDrafts = async (
    userId: string,
    programExerciseIds: string[]
): Promise<Record<string, string>> => {
    const supabase = createClient();

    const {data, error} = await supabase
        .from('exercise_drafts')
        .select('program_exercise_id, value')
        .eq('user_id', userId)
        .in('program_exercise_id', programExerciseIds);

    if (error) {
        console.error('Error fetching drafts:', error.message);
        return {};
    }

    const map: Record<string, string> = {};
    data.forEach((draft) => {
        map[draft.program_exercise_id] = draft.value;
    });

    return map;
};

export const saveDraft = async (
    userId: string,
    programExerciseId: string,
    dayId: string,
    value: string
): Promise<boolean> => {
    const supabase = createClient();

    const { error } = await supabase
        .from('exercise_drafts')
        .upsert(
            [
                {
                    user_id: userId,
                    program_exercise_id: programExerciseId,
                    day_id: dayId,
                    value,
                },
            ],
            {
                onConflict: 'user_id,program_exercise_id',
            }
        );

    if (error) {
        console.error('Error saving draft:', error.message);
        return false;
    }

    return true;
};



export const completeDay = async (
    userId: string,
    dayId: string,
    date: string
): Promise<boolean> => {
    const supabase = createClient();

    const {data: drafts, error: fetchError} = await supabase
        .from('exercise_drafts')
        .select('program_exercise_id, value')
        .eq('user_id', userId)
        .eq('day_id', dayId);

    if (fetchError || !drafts) {
        console.error('Error fetching drafts for completion:', fetchError?.message);
        return false;
    }

    const valuesMap = Object.fromEntries(
        drafts
            .filter((d) => d.value?.trim())
            .map((d) => [d.program_exercise_id, d.value])
    );

    // 1. insert into exercise_logs
    const logs = Object.entries(valuesMap).map(([programExerciseId, value]) => ({
        program_exercise_id: programExerciseId,
        user_id: userId,
        date,
        weight: value,
    }));

    const {error: insertLogsError} = await supabase
        .from('exercise_logs')
        .insert(logs);

    if (insertLogsError) {
        console.error('Error inserting logs:', insertLogsError.message);
        return false;
    }

    // 2. insert into training_history
    const {error: insertHistoryError} = await supabase
        .from('training_history')
        .insert([
            {
                user_id: userId,
                day_id: dayId,
                date,
                values: valuesMap,
            },
        ]);

    if (insertHistoryError) {
        console.error('Error inserting into training_history:', insertHistoryError.message);
        return false;
    }

    // 3. delete from exercise_drafts
    const idsToDelete = Object.keys(valuesMap);

    const {error: deleteError} = await supabase
        .from('exercise_drafts')
        .delete()
        .eq('user_id', userId)
        .eq('day_id', dayId)
        .in('program_exercise_id', idsToDelete);

    if (deleteError) {
        console.error('Error deleting drafts:', deleteError.message);
        return false;
    }

    return true;
};
