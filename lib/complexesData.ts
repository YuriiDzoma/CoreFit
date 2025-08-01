import { createClient } from '@/utils/supabase/client';
import {EditableProgramDay} from "../types/training";

// export const fetchGlobalPrograms = async () => {
//     const supabase = createClient();
//
//     const { data, error } = await supabase
//         .from("global_programs")
//         .select("*")
//         .order("created_at", { ascending: false });
//
//     if (error) {
//         console.error("Error fetching programs:", error);
//         return [];
//     }
//     return data;
// };




// Додати програму собі (зв'язок user_id + program_id)
export const addProgramToUser = async (programId: string, userId: string) => {
    const supabase = createClient();

    const { error } = await supabase
        .from("user_programs")
        .insert([{ user_id: userId, program_id: programId }]);

    if (error) console.error("Error adding program:", error);
};

export const createGlobalProgram = async (title: string, type: string, level: string, days: EditableProgramDay[]) => {
    const supabase = createClient();

    // 1️⃣ Створюємо глобальну програму
    const { data: program, error } = await supabase
        .from("global_programs")
        .insert([{ title, type, level, days_count: days.length }])
        .select()
        .single();

    if (error || !program) {
        console.error("Error creating global program:", error);
        return false;
    }

    // 2️⃣ Додаємо дні в global_program_days
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

        // 3️⃣ Додаємо вправи в global_program_exercises
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

    // 1️⃣ Отримуємо всі глобальні програми
    const { data: programs, error: programsError } = await supabase
        .from('global_programs')
        .select('*')
        .order('created_at', { ascending: false });

    if (programsError || !programs) {
        console.error('Error fetching global programs:', programsError);
        return [];
    }

    // 2️⃣ Отримуємо всі дні для цих програм
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

    // 3️⃣ Отримуємо всі вправи для цих днів
    const dayIds = days.map((d) => d.id);
    const { data: exercises, error: exError } = await supabase
        .from('global_program_exercises')
        .select('*')
        .in('day_id', dayIds);

    if (exError) {
        console.error('Error fetching global program exercises:', exError);
        return [];
    }

    // 4️⃣ Завантажуємо деталі вправ
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

    // 5️⃣ Формуємо структуру: програма → дні → вправи з деталями
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
