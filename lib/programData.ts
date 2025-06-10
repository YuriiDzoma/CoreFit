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
        .select(`id, title, type, level, days:program_days(day_number, exercises:program_exercises(exercise_id))`)
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error('Error fetching program:', error?.message);
        return null;
    }

    const normalizedDays = (data.days || []).map((day: any) => ({
        day_number: day.day_number,
        exercises: (day.exercises || []).map((ex: any) => ex.exercise_id),
    }));

    return {
        id: data.id,
        title: data.title,
        type: data.type,
        level: data.level,
        days: normalizedDays,
    };
};

