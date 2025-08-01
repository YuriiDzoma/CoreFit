export type exerciseTypes = {
    id: string;
    name: string;
    image: string;
};


export type ProgramType = {
    id: string;
    title: string;
    type: 'aerobic' | 'anaerobic' | 'crossfit';
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'professional';
    days_count: number;
    created_at: string;
};

export interface ProgramFull {
    id: string;
    title: string;
    type: string;
    level: string;
    user_id: string;
    days: {
        id: string;
        day_number: number;
        exercises: { id: string; programExerciseId: string }[];
    }[];
    author?: {
        id: string;
        username: string;
        avatar_url?: string;
    };
}

export interface ExerciseDetails {
    id: string;
    image_url: string;
    name_en: string;
    name_uk: string;
    name_ru: string;
}

export interface GlobalExercise {
    id: string;
    exercise_id: string;
    details: ExerciseDetails | null;
}

export interface GlobalDay {
    id: string;
    program_id: string;
    day_number: number;
    exercises: GlobalExercise[];
}

export interface GlobalProgram {
    id: string;
    title: string;
    type: string;
    level: string;
    days_count: number;
    created_at: string;
    days: GlobalDay[];
}

export type EditableProgramDay = {
    dayNumber: number;
    exercises: string[];
};


