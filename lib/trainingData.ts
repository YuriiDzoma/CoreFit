import { createClient } from '@/utils/supabase/client';

export const fetchExercisesByGroup = async (
    group: string,
    lang: 'en' | 'ua' | 'ru'
): Promise<string[]> => {
    const supabase = createClient();

    const fieldMap = {
        eng: 'name_en',
        ukr: 'name_uk',
        rus: 'name_ru',
    };

    const nameField = fieldMap[lang];

    let query = supabase
        .from('exercises')
        .select(`${nameField}, muscle_groups(name)`);

    if (group !== 'All') {
        query = query.eq('muscle_groups.name', group);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching exercises:', error.message);
        return [];
    }

    return data.map((exercise) => exercise[nameField]);
};
