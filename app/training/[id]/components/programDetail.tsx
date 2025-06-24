'use client';

import styles from './programDetail.module.scss'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchProgramDetail } from '@/lib/programData';
import { ProgramFull } from '@/types/training';
import ProgramDaysList from "./programDaysList";
import ProgramTabs from "./programTabs";
import TrainingHistory from "./trainingHistory/trainingHistory";
import TrainingProcessing from "./trainingProcessing/trainingProcessing";
import {fetchTrainingHistory} from "../../../../lib/trainingData";
import Link from "next/link";
import {useLevelText, useTypeText} from "../../../hooks/useDifficulty";
import {useAppSelector} from "../../../hooks/redux";
import {getIsDarkTheme, getText} from "../../../../store/selectors";
import Image from "next/image";
import {ProgramDetailSkeleton} from "../../../../ui/skeleton/skeleton";

type HistoryMap = Record<string, { date: string; values: Record<string, string> }[]>;


const ProgramDetail = () => {
    const { training } = useAppSelector(getText);
    const { id } = useParams<{ id: string }>();
    const isDark = useAppSelector(getIsDarkTheme);
    const [program, setProgram] = useState<ProgramFull | null>(null);

    const [activeTab, setActiveTab] = useState<number>(2);
    const [history, setHistory] = useState<HistoryMap>({});

    const getLevelText = useLevelText();
    const getTypeText = useTypeText();

    const loadAllHistory = async () => {
        if (!program?.days) return; // запобіжник
        const map: HistoryMap = {};
        for (const day of program.days) {
            const data = await fetchTrainingHistory(day.id);
            map[day.id] = data;
        }
        setHistory(map);
    };


    useEffect(() => {
        loadAllHistory();
    }, [program]);


    useEffect(() => {
        const loadProgram = async () => {
            if (!id) return;
            const result = await fetchProgramDetail(id);
            setProgram(result);
        };

        loadProgram();
    }, [id]);


    if (!program) return <ProgramDetailSkeleton />;

    return (
        <div className={styles.detail}>
            <h2 className={'title'}>{program.title}</h2>

            <Link className={styles.edit} href={`/training/${program.id}/edit`}>
                <Image
                    src={isDark ? '/icons/editMilk.svg' : '/icons/edit.svg'}
                    width={28}
                    height={28}
                    alt="back"
                    unoptimized
                />
            </Link>
            <div className={styles.detail__info}>
                <p><span>{training.type}: </span>{getTypeText(program.type)}</p>
                <p><span>{training.difficulty}: </span>{getLevelText(program.level)}</p>
            </div>

            <button className={styles.detail__removeProgram}>
                <Image
                    src={'/icons/remove.svg'}
                    width={28}
                    height={28}
                    alt="remove"
                    unoptimized
                />
            </button>

            <ProgramTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className={styles.detail__content}>
                <ProgramDaysList program={program} activeTab={activeTab}/>
                <TrainingHistory program={program} activeTab={activeTab} history={history} />
                <TrainingProcessing program={program}  activeTab={activeTab} onComplete={loadAllHistory}/>
            </div>

        </div>
    );
};

export default ProgramDetail;
