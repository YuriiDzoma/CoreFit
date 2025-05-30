import { createClient } from '@/utils/supabase/client';

export const getMuscleGroupIdByName = async (group: string): Promise<string | null> => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('muscle_groups')
        .select('id')
        .eq('name', group)
        .single(); // очікуємо один результат

    if (error || !data) {
        console.error('Error fetching muscle group id:', error?.message || 'Not found');
        return null;
    }

    return data.id;
};


export const fetchExercisesByGroup = async (
    group: string,
    lang: 'eng' | 'ukr' | 'rus'
): Promise<{ name: string; image: string }[]> => {
    const supabase = createClient();

    const fieldMap = {
        eng: 'name_en',
        ukr: 'name_uk',
        rus: 'name_ru',
    };

    const nameField = fieldMap[lang];

    let query = supabase
        .from('exercises')
        .select(`${nameField}, image_url`);

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
        name: exercise[nameField],
        image: exercise.image_url,
    }));

};




