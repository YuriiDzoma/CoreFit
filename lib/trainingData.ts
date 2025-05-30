import { createClient } from '@/utils/supabase/client';

export const fetchExercisesByGroup = async (group: string): Promise<string[]> => {
    const supabase = createClient();

    if (group === 'All') {
        const { data, error } = await supabase
            .from('exercises')
            .select('name_en');

        if (error) {
            console.error('Error fetching all exercises:', error.message);
            return [];
        }

        return data.map((exercise) => exercise.name_en);
    }

    const { data: groupData, error: groupError } = await supabase
        .from('muscle_groups')
        .select('id')
        .eq('name', group)
        .single();

    if (groupError || !groupData) {
        console.error('Error fetching muscle group id:', groupError?.message);
        return [];
    }

    const { data, error } = await supabase
        .from('exercises')
        .select('name_en')
        .eq('muscle_group_id', groupData.id);

    if (error) {
        console.error('Error fetching exercises by group:', error.message);
        return [];
    }

    return data.map((exercise) => exercise.name_en);
};



