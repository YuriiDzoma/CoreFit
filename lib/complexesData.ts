import { createClient } from '@/utils/supabase/client';
import {EditableProgramDay} from "../types/training";

export const createGlobalProgram = async (title: string, type: string, level: string, days: EditableProgramDay[]) => {
    const supabase = createClient();

    const { data: program, error } = await supabase
        .from("global_programs")
        .insert([{ title, type, level, days_count: days.length }])
        .select()
        .single();

    if (error || !program) {
        console.error("Error creating global program:", error);
        return false;
    }

    for (const day of days) {
        const { data: newDay, error: dayError } = await supabase
            .from("global_program_days")
            .insert([{ program_id: program.id, day_number: day.dayNumber }])
            .select()
            .single();

        if (dayError || !newDay) {
            console.error("Error creating global day:", dayError);
            continue;
        }

        if (day.exercises.length > 0) {
            const exercisesInsert = day.exercises.map((exId) => ({
                day_id: newDay.id,
                exercise_id: exId,
            }));
            const { error: exError } = await supabase.from("global_program_exercises").insert(exercisesInsert);

            if (exError) console.error("Error inserting global exercises:", exError);
        }
    }

    return true;
};

export const fetchGlobalProgramsWithDetails = async () => {
    const supabase = createClient();

    const { data: programs, error: programsError } = await supabase
        .from('global_programs')
        .select('*')
        .order('created_at', { ascending: false });

    if (programsError || !programs) {
        console.error('Error fetching global programs:', programsError);
        return [];
    }

    const programIds = programs.map((p) => p.id);
    const { data: days, error: daysError } = await supabase
        .from('global_program_days')
        .select('*')
        .in('program_id', programIds)
        .order('day_number', { ascending: true });

    if (daysError) {
        console.error('Error fetching global program days:', daysError);
        return [];
    }

    const dayIds = days.map((d) => d.id);
    const { data: exercises, error: exError } = await supabase
        .from('global_program_exercises')
        .select('*')
        .in('day_id', dayIds);

    if (exError) {
        console.error('Error fetching global program exercises:', exError);
        return [];
    }

    const exerciseIds = Array.from(new Set(exercises.map((e) => e.exercise_id)));
    const { data: exerciseDetails, error: detailsError } = await supabase
        .from('exercises')
        .select('id, image_url, name_en, name_uk, name_ru')
        .in('id', exerciseIds);

    if (detailsError) {
        console.error('Error fetching exercise details:', detailsError);
        return [];
    }

    const exerciseMap = exerciseDetails.reduce((map, ex) => {
        map[ex.id] = ex;
        return map;
    }, {} as Record<string, any>);

    return programs.map((program) => ({
        ...program,
        days: days
            .filter((d) => d.program_id === program.id)
            .map((day) => ({
                ...day,
                exercises: exercises
                    .filter((ex) => ex.day_id === day.id)
                    .map((ex) => ({
                        ...ex,
                        details: exerciseMap[ex.exercise_id] || null,
                    })),
            })),
    }));
};

export const fetchUserGlobalProgramMap = async (
    userId: string
): Promise<Record<string, string>> => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("programs")
        .select("id, source_global_program_id")
        .eq("user_id", userId)
        .not("source_global_program_id", "is", null);

    if (error) {
        console.error("Error fetching user global programs:", error.message);
        return {};
    }

    return (data || []).reduce((map, item) => {
        if (item.source_global_program_id) {
            map[item.source_global_program_id] = item.id;
        }

        return map;
    }, {} as Record<string, string>);
};

export const addGlobalProgramToUser = async (
    globalProgramId: string,
    userId: string
): Promise<string | null> => {
    const supabase = createClient();

    const { data: existingProgram, error: existingError } = await supabase
        .from("programs")
        .select("id")
        .eq("user_id", userId)
        .eq("source_global_program_id", globalProgramId)
        .maybeSingle();

    if (existingError) {
        console.error("Error checking existing copied program:", existingError.message);
        return null;
    }

    if (existingProgram?.id) {
        return existingProgram.id;
    }

    const { data: globalProgram, error: globalProgramError } = await supabase
        .from("global_programs")
        .select("id, title, type, level, days_count")
        .eq("id", globalProgramId)
        .single();

    if (globalProgramError || !globalProgram) {
        console.error("Error fetching global program:", globalProgramError?.message);
        return null;
    }

    const { data: globalDays, error: globalDaysError } = await supabase
        .from("global_program_days")
        .select("id, day_number")
        .eq("program_id", globalProgramId)
        .order("day_number", { ascending: true });

    if (globalDaysError || !globalDays) {
        console.error("Error fetching global program days:", globalDaysError?.message);
        return null;
    }

    const globalDayIds = globalDays.map((day) => day.id);

    const { data: globalExercises, error: globalExercisesError } = globalDayIds.length
        ? await supabase
            .from("global_program_exercises")
            .select("id, day_id, exercise_id")
            .in("day_id", globalDayIds)
        : { data: [], error: null };

    if (globalExercisesError || !globalExercises) {
        console.error("Error fetching global program exercises:", globalExercisesError?.message);
        return null;
    }

    const { data: newProgram, error: newProgramError } = await supabase
        .from("programs")
        .insert([{
            user_id: userId,
            author_id: userId,
            title: globalProgram.title,
            type: globalProgram.type,
            level: globalProgram.level,
            days_count: globalDays.length,
            source_global_program_id: globalProgramId,
        }])
        .select("id")
        .single();

    if (newProgramError || !newProgram) {
        console.error("Error creating copied program:", newProgramError?.message);
        return null;
    }

    const daysToInsert = globalDays.map((day) => ({
        program_id: newProgram.id,
        day_number: day.day_number,
        title: `Day ${day.day_number}`,
    }));

    const { data: insertedDays, error: insertedDaysError } = await supabase
        .from("program_days")
        .insert(daysToInsert)
        .select("id, day_number");

    if (insertedDaysError || !insertedDays) {
        console.error("Error creating copied program days:", insertedDaysError?.message);
        return null;
    }

    const insertedDayByNumber = new Map(
        insertedDays.map((day) => [day.day_number, day.id])
    );

    const exercisesToInsert = globalDays.flatMap((globalDay) => {
        const newDayId = insertedDayByNumber.get(globalDay.day_number);

        if (!newDayId) {
            return [];
        }

        return globalExercises
            .filter((exercise) => exercise.day_id === globalDay.id)
            .map((exercise, index) => ({
                day_id: newDayId,
                exercise_id: exercise.exercise_id,
                order_index: index + 1,
            }));
    });

    if (exercisesToInsert.length > 0) {
        const { error: insertExercisesError } = await supabase
            .from("program_exercises")
            .insert(exercisesToInsert);

        if (insertExercisesError) {
            console.error("Error creating copied program exercises:", insertExercisesError.message);
            return null;
        }
    }

    return newProgram.id;
};

export const removeGlobalProgramFromUser = async (
    globalProgramId: string,
    userId: string
): Promise<boolean> => {
    const supabase = createClient();

    const { data: program, error: programError } = await supabase
        .from("programs")
        .select("id")
        .eq("user_id", userId)
        .eq("source_global_program_id", globalProgramId)
        .maybeSingle();

    if (programError) {
        console.error("Error finding copied program:", programError.message);
        return false;
    }

    if (!program?.id) {
        return true;
    }

    const { data: days, error: daysError } = await supabase
        .from("program_days")
        .select("id")
        .eq("program_id", program.id);

    if (daysError || !days) {
        console.error("Error fetching copied program days:", daysError?.message);
        return false;
    }

    const dayIds = days.map((day) => day.id);

    const { data: programExercises, error: programExercisesError } = dayIds.length
        ? await supabase
            .from("program_exercises")
            .select("id")
            .in("day_id", dayIds)
        : { data: [], error: null };

    if (programExercisesError || !programExercises) {
        console.error("Error fetching copied program exercises:", programExercisesError?.message);
        return false;
    }

    const programExerciseIds = programExercises.map((exercise) => exercise.id);

    if (programExerciseIds.length > 0) {
        const { error: logsError } = await supabase
            .from("exercise_logs")
            .delete()
            .in("program_exercise_id", programExerciseIds);

        if (logsError) {
            console.error("Error deleting copied program logs:", logsError.message);
            return false;
        }
    }

    if (dayIds.length > 0) {
        const { error: draftsError } = await supabase
            .from("exercise_drafts")
            .delete()
            .in("day_id", dayIds);

        if (draftsError) {
            console.error("Error deleting copied program drafts:", draftsError.message);
            return false;
        }

        const { error: historyError } = await supabase
            .from("training_history")
            .delete()
            .in("day_id", dayIds);

        if (historyError) {
            console.error("Error deleting copied program history:", historyError.message);
            return false;
        }

        const { error: exercisesError } = await supabase
            .from("program_exercises")
            .delete()
            .in("day_id", dayIds);

        if (exercisesError) {
            console.error("Error deleting copied program exercises:", exercisesError.message);
            return false;
        }

        const { error: daysDeleteError } = await supabase
            .from("program_days")
            .delete()
            .in("id", dayIds);

        if (daysDeleteError) {
            console.error("Error deleting copied program days:", daysDeleteError.message);
            return false;
        }
    }

    const { error: deleteProgramError } = await supabase
        .from("programs")
        .delete()
        .eq("id", program.id);

    if (deleteProgramError) {
        console.error("Error deleting copied program:", deleteProgramError.message);
        return false;
    }

    return true;
};