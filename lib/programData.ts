import { createClient } from '@/utils/supabase/client';
import {ProgramFull, ProgramType} from "../types/training";

export const fetchUserPrograms = async (): Promise<ProgramType[]> => {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching user programs:', error.message);
        return [];
    }

    return data as ProgramType[];
};

export const fetchProgramDetail = async (id: string): Promise<ProgramFull | null> => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('programs')
        .select(`id, title, type, level, days`)
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error('Error fetching program detail:', error?.message);
        return null;
    }

    const { data: daysData } = await supabase
        .from('program_days')
        .select('id, day_number, exercises')
        .eq('program_id', id)
        .order('day_number');

    return {
        id: data.id,
        title: data.title,
        type: data.type,
        level: data.level,
        days: daysData?.map((d) => ({
            day_number: d.day_number,
            exercises: d.exercises || [],
        })) || [],
    };
};
