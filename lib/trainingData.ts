import { createClient } from '@/utils/supabase/client';

export const getMuscleGroupIdByName = async (group: string): Promise<string | null> => {
    const supabase = createClient();

    const { data, error } = await supabase
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

    const { data, error } = await query;

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

    const { data, error } = await supabase
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

    const { data, error } = await supabase
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

    const { data: program, error: programError } = await supabase
        .from('programs')
        .insert([{ user_id: userId, title, type, level, days_count: days.length }])
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

    const { data: insertedDays, error: daysError } = await supabase
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

    const { error: exercisesError } = await supabase
        .from('program_exercises')
        .insert(exercisesToInsert);

    if (exercisesError) {
        console.error('Program exercises insert error:', exercisesError.message);
        return null;
    }

    return program.id;
};

export const saveTrainingResult = async (
    userId: string,
    dayId: string,
    date: string,
    values: Record<string, string>
): Promise<boolean> => {
    const supabase = createClient();

    const { error } = await supabase.from('training_history').insert([
        {
            user_id: userId,
            day_id: dayId,
            date,
            values,
        },
    ]);

    if (error) {
        console.error('Error saving training result:', error.message);
        return false;
    }

    return true;
};

export const fetchTrainingHistory = async (
    dayId: string
): Promise<{ date: string; values: Record<string, string> }[]> => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('training_history')
        .select('date, values')
        .eq('day_id', dayId)
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching training history:', error.message);
        return [];
    }

    return data as { date: string; values: Record<string, string> }[];
};

export const fetchAllTrainingHistories = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
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
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching training histories:', error.message);
        return [];
    }

    return data;
};
