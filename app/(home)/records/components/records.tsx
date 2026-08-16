'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./records.module.scss";
import { useAppSelector } from "@/app/hooks/redux";
import { getLanguage, getText } from "@/store/selectors";
import { getRandomExerciseLeaderboard, type ExerciseLeaderboard } from "@/lib/recordsData";
import { type AppLanguage } from "@/lib/defaultLanguage";

const Records = () => {
    const language = useAppSelector(getLanguage);
    const { base } = useAppSelector(getText);

    const [leaderboard, setLeaderboard] = useState<ExerciseLeaderboard | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!language) return;
        setLoading(true);
        getRandomExerciseLeaderboard(language as AppLanguage).then((result) => {
            setLeaderboard(result);
            setLoading(false);
        });
    }, [language]);

    if (loading) return <p>{base.loading}</p>;

    return (
        <div className={styles.records}>
            <h2 className={'pageTitle'}>{base.records}</h2>

            {!leaderboard ? (
                <p>{base.noRecordsYet}</p>
            ) : (
                <>
                    <div className={styles.exerciseHeader}>
                        {leaderboard.exerciseImageUrl && (
                            <img src={leaderboard.exerciseImageUrl} alt={leaderboard.exerciseName} />
                        )}
                        <span className={styles.exerciseName}>{leaderboard.exerciseName}</span>
                    </div>

                    <ul className={styles.list}>
                        {leaderboard.entries.map((entry, index) => (
                            <li key={entry.userId}>
                                <Link href={`/profile/${entry.userId}`} className={styles.row}>
                                    <span className={styles.rank}>{index + 1}.</span>
                                    <img
                                        src={entry.avatarUrl ?? undefined}
                                        alt={entry.username ?? ''}
                                        className={styles.avatar}
                                    />
                                    <span className={styles.name}>{entry.username}</span>
                                    <span className={styles.weight}>{entry.weight}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Records;
