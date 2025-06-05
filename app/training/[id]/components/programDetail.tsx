'use client';

import React, { useEffect, useState } from 'react';
import { fetchProgramDetail } from '@/lib/programData';
import styles from './programDetail.module.scss';
import {ProgramFull} from "../../../../types/training";
import {useParams} from "next/navigation";


const ProgramDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<null | ProgramFull>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const res = await fetchProgramDetail(id);
            setData(res);
            setLoading(false);
        };

        load();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>Error loading program</p>;

    return (
        <div className={styles.program}>
            <h2 className="title">{data.title}</h2>
            <p className={styles.meta}>
                <strong>Type:</strong> {data.type} • <strong>Level:</strong> {data.level}
            </p>

            {data.days.map((day) => (
                <div key={day.day_number} className={styles.day}>
                    <h3>Day {day.day_number}</h3>
                    <ul>
                        {day.exercises.map((ex, i) => (
                            <li key={i}>{ex}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default ProgramDetail;
