'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchProgramDetail } from '@/lib/programData';
import { ProgramFull } from '@/types/training';

const ProgramDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [program, setProgram] = useState<ProgramFull | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProgram = async () => {
            if (!id) return;
            const result = await fetchProgramDetail(id);
            setProgram(result);
            setLoading(false);
        };

        loadProgram();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!program) return <p>Program not found.</p>;

    return (
        <div>
            <h2>{program.title}</h2>
            <p>Type: {program.type}</p>
            <p>Level: {program.level}</p>

            {program.days.map((day) => (
                <div key={day.day_number}>
                    <h3>Day {day.day_number}</h3>
                    {day.exercises.length ? (
                        <ul>
                            {day.exercises.map((exId, idx) => (
                                <li key={idx}>{exId}</li> // тут потім замінимо на назву
                            ))}
                        </ul>
                    ) : (
                        <p>No exercises for this day.</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProgramDetail;
