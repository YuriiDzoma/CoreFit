import { createClient } from '@/utils/supabase/client';

export const fetchAllExercises = async (): Promise<string[]> => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('exercises')
        .select('name_en');

    if (error) {
        console.error('Error fetching exercises:', error.message);
        return [];
    }

    return data.map((exercise) => exercise.name_en);
};
