'use client';
import React, {useEffect, useState} from 'react';
import styles from './programs.module.scss';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {fetchUserPrograms} from "../../../../lib/programData";
import {ProgramType} from "../../../../types/training";
import {useAppSelector} from "../../../hooks/redux";
import {getText, getUserId} from "../../../../store/selectors";
import {ProgramsListSkeleton} from "../../../../ui/skeleton/skeleton";
import ProgramItem from "./ProgramItem";

const Programs = () => {
    const [programs, setPrograms] = useState<ProgramType[]>([]);
    const [loading, setLoading] = useState(true);
    const {training, base} = useAppSelector(getText);
    const currentUserId = useAppSelector(getUserId);
    const { id } = useParams();

    const cleanId = typeof id === 'string' ? id : '';
    const isMyProfile = currentUserId === cleanId;


    useEffect(() => {
        const loadPrograms = async () => {
            if (!id || typeof id !== 'string') return;

            const result = await fetchUserPrograms(id);
            setPrograms(result);
            setLoading(false);
        };

        loadPrograms();
    }, [id]);

    if (loading) return <ProgramsListSkeleton />;

    return (
        <div className={styles.programs}>
            <h2 className="title">
                {isMyProfile ? training.myPrograms : base.programs}
            </h2>

            {isMyProfile && (
                <div className={`${styles.createLink} submit`}>
                    <Link href="/training/create" className={styles.createButton}>
                        <span>+  {training.createProgram}</span>
                    </Link>
                </div>
            )}

            {programs.length === 0 ? (
                <p>{isMyProfile ? training.notHavePrograms : training.notHaveProgramsUser}</p>
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
