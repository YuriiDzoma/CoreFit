'use client';

import { useEffect, useState } from 'react';
import { fetchAllExercises } from '@/lib/trainingData';

export default function Wiki() {
    const [exercises, setExercises] = useState<string[]>([]);

    useEffect(() => {
        const loadExercises = async () => {
            const names = await fetchAllExercises();
            setExercises(names);
        };

        loadExercises();
    }, []);

    return (
        <div>
            <h1>Wiki Page</h1>
            <ul>
                {exercises.map((name) => (
                    <li key={name}>{name}</li>
                ))}
            </ul>
        </div>
    );
}