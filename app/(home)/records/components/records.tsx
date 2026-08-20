'use client';
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import styles from "./records.module.scss";
import elevatedStyles from "@/ui/elevatedCard/elevatedCard.module.scss";
import WikiNav from "../../../training/wiki/components/wikiNav";
import { RecordsSkeleton } from "@/ui/skeleton/skeleton";
import { useAppSelector } from "@/app/hooks/redux";
import { getLanguage, getText } from "@/store/selectors";
import {
    getExerciseLeaderboards,
    RECORDS_PAGE_SIZE,
    type ExerciseLeaderboard,
} from "@/lib/recordsData";
import { getMuscleGroupIdByName } from "@/lib/trainingData";
import { type AppLanguage } from "@/lib/defaultLanguage";

const RANK_MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

const Records = () => {
    const language = useAppSelector(getLanguage);
    const { base } = useAppSelector(getText);

    const [activeTab, setActiveTab] = useState('All');
    const [leaderboards, setLeaderboards] = useState<ExerciseLeaderboard[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchFirstPage = useCallback(
        async (tab: string) => {
            if (!language) return;
            setLoading(true);
            const muscleGroupId = tab === 'All' ? null : await getMuscleGroupIdByName(tab);
            const result = await getExerciseLeaderboards({
                muscleGroupId,
                lang: language as AppLanguage,
            });
            setLeaderboards(result);
            setHasMore(result.length === RECORDS_PAGE_SIZE);
            setLoading(false);
        },
        [language],
    );

    useEffect(() => {
        fetchFirstPage(activeTab);
        // Only re-runs on language change, not activeTab -- tab changes go
        // through handleChangeTab below instead, same split Wiki's own
        // fetchExercises/handleChangeTab already uses.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    const handleChangeTab = (tab: string) => {
        setActiveTab(tab);
        fetchFirstPage(tab);
    };

    const handleShowMore = async () => {
        if (!language) return;
        setLoadingMore(true);
        const muscleGroupId = activeTab === 'All' ? null : await getMuscleGroupIdByName(activeTab);
        const more = await getExerciseLeaderboards({
            muscleGroupId,
            lang: language as AppLanguage,
            offset: leaderboards.length,
        });
        setLeaderboards((prev) => [...prev, ...more]);
        setHasMore(more.length === RECORDS_PAGE_SIZE);
        setLoadingMore(false);
    };

    if (loading) return <RecordsSkeleton/>;

    return (
        <div className={styles.records}>
            <h2 className={'pageTitle'}>{base.records}</h2>

            <WikiNav activeTab={activeTab} handleChangeTab={handleChangeTab} />

            {leaderboards.length === 0 ? (
                <p>{base.noRecordsYet}</p>
            ) : (
                <div className={styles.list}>
                    {leaderboards.map((leaderboard) => (
                        <div className={`${styles.card} ${elevatedStyles.elevated}`} key={leaderboard.exerciseId}>
                            <div className={styles.exerciseHeader}>
                                {leaderboard.exerciseImageUrl && (
                                    <img src={leaderboard.exerciseImageUrl} alt={leaderboard.exerciseName} />
                                )}
                                <span className={styles.exerciseName}>{leaderboard.exerciseName}</span>
                            </div>

                            <ul>
                                {leaderboard.entries.map((entry) => (
                                    <li key={entry.userId}>
                                        <Link href={`/profile/${entry.userId}`} className={styles.row}>
                                            <span className={styles.rank}>
                                                {RANK_MEDALS[entry.rank] ?? `${entry.rank}.`}
                                            </span>
                                            <img
                                                src={entry.avatarUrl ?? undefined}
                                                alt={entry.username ?? ''}
                                                className={styles.avatar}
                                            />
                                            <span className={styles.name}>{entry.username}</span>
                                            <span className={styles.weight}>{entry.weight} {base.kg}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {hasMore && (
                        <button className="button" onClick={handleShowMore} disabled={loadingMore}>
                            {loadingMore ? '…' : base.showMore}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Records;
