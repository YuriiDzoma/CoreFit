'use client';

import styles from './programDetail.module.scss'
import React, {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import {fetchProgramDetail} from '@/lib/programData';
import {ProgramFull} from '@/types/training';
import ProgramDaysList from "./programDaysList";
import ProgramTabs from "./programTabs";
import TrainingHistory from "./trainingHistory/trainingHistory";
import TrainingProcessing from "./trainingProcessing/trainingProcessing";
import {fetchTrainingHistory} from "../../../../../lib/trainingData";
import Link from "next/link";
import {useLevelText, useTypeText} from "../../../../hooks/useDifficulty";
import {useAppSelector} from "../../../../hooks/redux";
import {getIsDarkTheme, getText, getUserId} from "../../../../../store/selectors";
import Image from "next/image";
import {ProgramDetailSkeleton} from "../../../../../ui/skeleton/skeleton";
import {useRouter} from 'next/navigation';
import {deleteProgramWithRelations} from '@/lib/programData';
import Preloader from "../../../../../ui/preloader/Preloader";
import GlobalPopup from "../../../../components/globalPopup/globalPopup";

type HistoryMap = Record<string, { date: string; values: Record<string, string> }[]>;


const ProgramDetail = () => {
    const currentUserId = useAppSelector(getUserId);
    const {training} = useAppSelector(getText);
    const {id} = useParams<{ id: string }>();
    const router = useRouter();
    const isDark = useAppSelector(getIsDarkTheme);
    const [program, setProgram] = useState<ProgramFull | null>(null);
    const [isPreloader, setIsPreloader] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<number>(2);
    const [history, setHistory] = useState<HistoryMap>({});
    const [isShowRemove, setIsShowRemove] = useState<boolean>(false)

    const isMyProgram = program?.user_id === currentUserId;

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

    const onRemove = async () => {
        if (!program) return;
        setIsPreloader(true);

        const success = await deleteProgramWithRelations(program.id);

        if (success) {
            router.push('/training/');
            setIsPreloader(false);
        } else {
            alert('Error deleting program. Please try again.');
            setIsPreloader(false);
        }
    };

    const closePopup = () => {
        setIsShowRemove(false);
    }

    if (!program) return <ProgramDetailSkeleton/>;

    return (
        <div className={styles.detail}>
            <h2 className={'title'}>{program.title}</h2>

            {isMyProgram && (
                <button className={styles.detail__removeProgram} onClick={() => setIsShowRemove(true)}>
                    <Image
                        src={'/icons/remove.svg'}
                        width={28}
                        height={28}
                        alt="remove"
                        unoptimized
                    />
                </button>
            )}

            <div className={styles.detail__info}>
                <p><span>{training.type}: </span>{getTypeText(program.type)}</p>
                <p><span>{training.difficulty}: </span>{getLevelText(program.level)}</p>
            </div>

            {isMyProgram && (
                <Link className={styles.edit} href={`/training/${program.id}/edit`}>
                    <Image
                        src={isDark ? '/icons/editMilk.svg' : '/icons/edit.svg'}
                        width={28}
                        height={28}
                        alt="back"
                        unoptimized
                    />
                </Link>
            )}

            <ProgramTabs activeTab={activeTab} setActiveTab={setActiveTab}/>

            <div className={styles.detail__content}>
                <ProgramDaysList program={program} activeTab={activeTab}/>
                <TrainingHistory program={program} activeTab={activeTab} history={history}/>
                <TrainingProcessing program={program} activeTab={activeTab} isMyProgram={isMyProgram} onComplete={loadAllHistory}/>
            </div>

            {isPreloader && <Preloader/>}
            {isShowRemove &&
            <GlobalPopup title={training.removeProgramTitle} message={training.removeProgramText} onConfirm={onRemove}
                         onCancel={closePopup}/>}
            {isShowRemove && <button className={styles.closer} onClick={() => closePopup()}/>}
        </div>
    );
};

export default ProgramDetail;
