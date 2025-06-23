'use client';
import React, {useEffect, useState} from 'react';
import styles from './programs.module.scss';
import Link from 'next/link';
import {fetchUserPrograms} from "../../../../lib/programData";
import {ProgramType} from "../../../../types/training";
import {useAppSelector} from "../../../hooks/redux";
import {getText} from "../../../../store/selectors";
import {ProgramsListSkeleton} from "../../../../ui/skeleton/skeleton";
import ProgramItem from "./ProgramItem";

const Programs = () => {
    const [programs, setPrograms] = useState<ProgramType[]>([]);
    const [loading, setLoading] = useState(true);
    const {training} = useAppSelector(getText);

    useEffect(() => {
        const loadPrograms = async () => {
            const result = await fetchUserPrograms();
            setPrograms(result);
            setLoading(false);
        };

        loadPrograms();
    }, []);

    if (loading) return <ProgramsListSkeleton />;

    return (
        <div className={styles.programs}>
            <h2 className="title">{training.myPrograms}</h2>

            <div className={`${styles.createLink} submit`}>
                <Link href="/training/create" className={styles.createButton}>
                    <span>+  {training.createProgram}</span>
                </Link>
            </div>

            {programs.length === 0 ? (
                <p>No programs found</p>
            ) : (
                <ul className={styles.programList}>
                    {programs.map((program) => (
                        <ProgramItem program={program} key={program.id} />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Programs;
