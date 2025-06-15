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
    days: {
        id: string;
        day_number: number;
        exercises: { id: string; programExerciseId: string }[];
    }[];
}
