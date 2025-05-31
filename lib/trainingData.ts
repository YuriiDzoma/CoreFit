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
