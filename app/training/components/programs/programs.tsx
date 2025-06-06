'use client';
import React, { useEffect, useState } from 'react';
import styles from './programs.module.scss';
import Link from 'next/link';
import {fetchUserPrograms} from "../../../../lib/programData";
import {ProgramType} from "../../../../types/training";

const Programs = () => {
    const [programs, setPrograms] = useState<ProgramType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPrograms = async () => {
            const result = await fetchUserPrograms();
            setPrograms(result);
            setLoading(false);
        };

        loadPrograms();
    }, []);

    return (
        <div className={styles.programs}>
            <h2 className="title">Training programs</h2>

            <div className={`${styles.createLink} button`}>
                <Link href="/training/create" className={styles.createButton}>
                    <span>+ Create new program</span>
                </Link>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : programs.length === 0 ? (
                <p>No programs found</p>
            ) : (
                <ul className={styles.programList}>
                    {programs.map((p) => (
                        <li key={p.id} className={styles.programItem}>
                            <Link href={`/training/${p.id}`}>
                                <span>{p.title}</span>
                            </Link>
                            <p className={styles.meta}>
                                {p.type} • {p.level} • {p.days_count} day{p.days_count > 1 ? 's' : ''}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Programs;
