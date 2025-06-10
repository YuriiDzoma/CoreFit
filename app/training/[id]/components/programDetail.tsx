'use client';

import styles from './programDetail.module.scss'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchProgramDetail } from '@/lib/programData';
import { ProgramFull } from '@/types/training';
import ProgramDaysList from "./programDaysList";
import {useAppSelector} from "../../../hooks/redux";
import {getText} from "../../../../store/selectors";
import ProgramTabs from "./programTabs";

const ProgramDetail = () => {
    const { training } = useAppSelector(getText);
    const { id } = useParams<{ id: string }>();
    const [program, setProgram] = useState<ProgramFull | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<number>(2);

    useEffect(() => {
        const loadProgram = async () => {
            if (!id) return;
            const result = await fetchProgramDetail(id);
            setProgram(result);
            setLoading(false);
        };

        loadProgram();
    }, [id]);

    const handleLevel = (value: string) => {
        switch (value) {
            case 'beginner':
                return training.beginner
            case 'intermediate':
                return training.intermediate
            case 'advanced':
                return training.advanced
            case 'expert':
                return training.expert
            case 'professional':
                return training.professional
        }
    }

    if (loading) return <p>Loading...</p>;
    if (!program) return <p>Program not found.</p>;

    return (
        <div className={styles.detail}>
            <h2 className={'title'}>{program.title}</h2>
            <div className={styles.detail__info}>
                <p><span>{training.type}: </span>{program.type}</p>
                <p><span>{training.difficulty}: </span>{handleLevel(program.level)}</p>
            </div>

            <ProgramTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className={styles.detail__content}>
                <ProgramDaysList program={program} activeTab={activeTab} />
            </div>


        </div>
    );
};

export default ProgramDetail;
