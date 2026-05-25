'use client';

import styles from './programDetail.module.scss';
import React, {useCallback, useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import {fetchProgramDetail, deleteProgramWithRelations} from '@/lib/programData';
import {ProgramFull} from '@/types/training';

import ProgramDaysList from './programDaysList';
import ProgramTabs from './programTabs';
import TrainingHistory from './trainingHistory/trainingHistory';
import TrainingProcessing from './trainingProcessing/trainingProcessing';

import {fetchTrainingHistory} from '../../../../../lib/trainingData';
import {useLevelText, useTypeText} from '../../../../hooks/useDifficulty';
import {useAppSelector} from '../../../../hooks/redux';
import {getIsDarkTheme, getText, getUserId} from '../../../../../store/selectors';

import Preloader from '../../../../../ui/preloader/Preloader';
import GlobalPopup from '../../../../components/globalPopup/globalPopup';

type HistoryRecord = {
    id?: string;
    date: string;
    created_at?: string | null;
    values: Record<string, string>;
};

type HistoryMap = Record<string, HistoryRecord[]>;

const getDateTime = (value?: string | null) => {
    return value ? new Date(value).getTime() : 0;
};

const sortHistoryRecords = (records: HistoryRecord[]) => {
    return [...records].sort((a, b) => {
        const dateDiff = getDateTime(b.date) - getDateTime(a.date);

        if (dateDiff !== 0) {
            return dateDiff;
        }

        return getDateTime(b.created_at) - getDateTime(a.created_at);
    });
};

const buildHistoryMap = async (program: ProgramFull): Promise<HistoryMap> => {
    const entries = await Promise.all(
        program.days.map(async (day) => {
            const data = await fetchTrainingHistory(day.id);

            return [
                day.id,
                sortHistoryRecords(Array.isArray(data) ? data : []),
            ] as const;
        })
    );

    return Object.fromEntries(entries) as HistoryMap;
};

const ProgramDetail = () => {
    const currentUserId = useAppSelector(getUserId);
    const {training} = useAppSelector(getText);
    const isDark = useAppSelector(getIsDarkTheme);

    const {id} = useParams<{ id: string }>();
    const router = useRouter();

    const [program, setProgram] = useState<ProgramFull | null>(null);
    const [history, setHistory] = useState<HistoryMap>({});

    const [isPreloader, setIsPreloader] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<number>(2);
    const [isShowRemove, setIsShowRemove] = useState<boolean>(false);

    const isMyProgram = program?.user_id === currentUserId;

    const getLevelText = useLevelText();
    const getTypeText = useTypeText();

    const loadAllHistory = useCallback(async () => {
        if (!program) return;

        setIsPreloader(true);

        try {
            const historyMap = await buildHistoryMap(program);
            setHistory(historyMap);
        } catch (error) {
            console.log('Error loading training history:', error);
            setHistory({});
        } finally {
            setIsPreloader(false);
        }
    }, [program]);

    useEffect(() => {
        let isMounted = true;

        const loadPage = async () => {
            if (!id) {
                setIsPreloader(false);
                return;
            }

            setIsPreloader(true);

            try {
                const result = await fetchProgramDetail(id);

                if (!isMounted) return;

                if (!result) {
                    setProgram(null);
                    setHistory({});
                    return;
                }

                const historyMap = await buildHistoryMap(result);

                if (!isMounted) return;

                setProgram(result);
                setHistory(historyMap);
            } catch (error) {
                console.log('Error loading program detail:', error);

                if (!isMounted) return;

                setProgram(null);
                setHistory({});
            } finally {
                if (isMounted) {
                    setIsPreloader(false);
                }
            }
        };

        loadPage();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const onRemove = async () => {
        if (!program) return;

        setIsPreloader(true);

        const success = await deleteProgramWithRelations(program.id);

        if (success) {
            router.push('/training/');
        } else {
            console.log('Error deleting program. Please try again.');
            setIsPreloader(false);
        }
    };

    const closePopup = () => {
        setIsShowRemove(false);
    };

    if (!program && isPreloader) {
        return <Preloader/>;
    }

    if (!program) {
        return (
            <div className={styles.detail}>
                <p>Program not found</p>
            </div>
        );
    }

    return (
        <div className={styles.detail}>
            <h2 className="title">{program.title}</h2>

            {isMyProgram && (
                <button
                    className={styles.detail__removeProgram}
                    onClick={() => setIsShowRemove(true)}
                >
                    <Image
                        src="/icons/remove.svg"
                        width={28}
                        height={28}
                        alt="remove"
                        unoptimized
                    />
                </button>
            )}

            <div className={styles.detail__info}>
                <p>
                    <span>{training.type}: </span>
                    {getTypeText(program.type)}
                </p>

                <p>
                    <span>{training.difficulty}: </span>
                    {getLevelText(program.level)}
                </p>

                {program.author && (
                    <p>
                        <span>{training.author}: </span>
                        <Link
                            href={`/profile/${program.author.id}`}
                            className={styles.detail__authorLink}
                        >
                            {program.author.username}
                        </Link>
                    </p>
                )}
            </div>

            {isMyProgram && (
                <Link
                    className={styles.edit}
                    href={`/training/program/${program.id}/edit`}
                >
                    <Image
                        src={isDark ? '/icons/editMilk.svg' : '/icons/edit.svg'}
                        width={28}
                        height={28}
                        alt="edit"
                        unoptimized
                    />
                </Link>
            )}

            <ProgramTabs activeTab={activeTab} setActiveTab={setActiveTab}/>

            <div className={styles.detail__content}>
                <ProgramDaysList program={program} activeTab={activeTab}/>

                <TrainingHistory
                    program={program}
                    activeTab={activeTab}
                    history={history}
                />

                <TrainingProcessing
                    program={program}
                    activeTab={activeTab}
                    isMyProgram={isMyProgram}
                    onComplete={loadAllHistory}
                />
            </div>

            {isPreloader && <Preloader/>}

            {isShowRemove && (
                <GlobalPopup
                    title={training.removeProgramTitle}
                    message={training.removeProgramText}
                    onConfirm={onRemove}
                    onCancel={closePopup}
                />
            )}

            {isShowRemove && (
                <button
                    className={styles.closer}
                    onClick={closePopup}
                />
            )}
        </div>
    );
};

export default ProgramDetail;