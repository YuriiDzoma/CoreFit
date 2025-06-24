import {createClient} from '@/utils/supabase/client';
import {ProgramFull, ProgramType} from "../types/training";

export const fetchUserPrograms = async (): Promise<ProgramType[]> => {
    const supabase = createClient();

    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user) return [];

    const {data, error} = await supabase
        .from('programs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', {ascending: false});

    if (error) {
        console.error('Error fetching user programs:', error.message);
        return [];
    }

    return data as ProgramType[];
};

export const fetchProgramDetail = async (id: string): Promise<ProgramFull | null> => {
    const supabase = createClient();

    const {data, error} = await supabase
        .from('programs')
        .select(`
                id,
                title,
                type,
                level,
                days:program_days(
                    id,
                    day_number,
                    exercises:program_exercises(
                    id,
                    exercise_id,
                    order_index
                    )
                )
                `)
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error('Error fetching program:', error?.message);
        return null;
    }

    const normalizedDays = (data.days || []).map((day: any) => ({
        id: day.id,
        day_number: day.day_number,
        exercises: (day.exercises || [])
            .sort((a: any, b: any) => a.order_index - b.order_index)
            .map((ex: any) => ({
                id: ex.exercise_id,
                programExerciseId: ex.id,
            })),
    }));


    return {
        id: data.id,
        title: data.title,
        type: data.type,
        level: data.level,
        days: normalizedDays,
    };
};


export const deleteProgramWithRelations = async (programId: string): Promise<boolean> => {
    const supabase = createClient();

    const { data: days, error: daysError } = await supabase
        .from('program_days')
        .select('id')
        .eq('program_id', programId);

    if (daysError || !days) {
        console.error('Error fetching program days:', daysError?.message);
        return false;
    }

    const dayIds = days.map(d => d.id);

    const { error: historyError } = await supabase
        .from('training_history')
        .delete()
        .in('day_id', dayIds);

    if (historyError) {
        console.error('Error deleting training_history:', historyError.message);
        return false;
    }

    const { error: exercisesError } = await supabase
        .from('program_exercises')
        .delete()
        .in('day_id', dayIds);

    if (exercisesError) {
        console.error('Error deleting program_exercises:', exercisesError.message);
        return false;
    }

    const { error: daysDelError } = await supabase
        .from('program_days')
        .delete()
        .in('id', dayIds);

    if (daysDelError) {
        console.error('Error deleting program_days:', daysDelError.message);
        return false;
    }

    const { error: programError } = await supabase
        .from('programs')
        .delete()
        .eq('id', programId);

    if (programError) {
        console.error('Error deleting program:', programError.message);
        return false;
    }

    return true;
};
