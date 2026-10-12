'use client';

import React, { useCallback, useEffect, useState } from 'react';
import styles from '../../components/news/trainingHistories.module.scss';
import elevatedStyles from '../../../ui/elevatedCard/elevatedCard.module.scss';
import { useAppSelector } from '../../hooks/redux';
import { getLanguage, getText } from '../../../store/selectors';
import {
    fetchTrainingHistoriesForUser,
    mapProgramExerciseToExerciseMeta,
    WALL_PAGE_SIZE,
} from '@/lib/trainingData';
import { NewsSkeleton } from '../../../ui/skeleton/skeleton';
import { avatarFallbackUrl } from '@/lib/avatarFallback';
import Image from 'next/image';

// `any[]`, matching TrainingHistories.tsx's own identical choice for this
// exact table/select shape -- Supabase's client infers an embedded
// single-row relation (`profiles`) as an array type here regardless of the
// actual one-to-one FK, so a precise type just fights the client rather
// than describing the real data.
//
// Same completed-workout feed cards as the Home tab's TrainingHistories
// (`app/components/news/trainingHistories.tsx`), scoped to just this one
// profile's own history via `fetchTrainingHistoriesForUser` instead of
// Home's all-users `fetchAllTrainingHistories` -- reuses that component's
// own module.scss classes rather than duplicating them, since the cards
// are meant to read as visually identical. Rendered below the trainer/
// client block on both the own-profile and other-user-profile pages.
//
// Unlike Home's cards, there's no avatar/username link here -- every
// entry already belongs to the profile this block is rendered on, so a
// link back to that same profile would be redundant.
//
// Paginated, WALL_PAGE_SIZE (10) at a time, matching Records' own
// "Show more" button (`app/(home)/records/components/records.tsx`)
// exactly: a page shorter than WALL_PAGE_SIZE means there's nothing left
// to load, and the button disappears.
//
// Renders nothing at all once loaded empty -- matches Friends'/
// TrainerClients' own "don't show an empty-state prompt" convention for
// this page specifically.
export default function UserWall({ userId }: { userId: string }) {
    const language = useAppSelector(getLanguage);
    const { base, training } = useAppSelector(getText);

    const [entries, setEntries] = useState<any[]>([]);
    const [exerciseNames, setExerciseNames] = useState<Record<string, string>>({});
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const resolveExerciseNames = useCallback(
        async (pageEntries: any[]) => {
            const programExerciseIds = Array.from(
                new Set(pageEntries.flatMap((entry) => Object.keys(entry.values))),
            );
            if (!language || programExerciseIds.length === 0) return {};

            const lang = language === 'ua' ? 'ukr' : language;
            const meta = await mapProgramExerciseToExerciseMeta(
                programExerciseIds,
                lang as 'eng' | 'ukr' | 'rus',
            );
            const names: Record<string, string> = {};
            for (const [programExerciseId, exerciseMeta] of Object.entries(meta)) {
                names[programExerciseId] = exerciseMeta.name;
            }
            return names;
        },
        [language],
    );

    useEffect(() => {
        if (!language) return;
        setLoading(true);
        (async () => {
            const results = await fetchTrainingHistoriesForUser(userId);
            setEntries(results);
            setHasMore(results.length === WALL_PAGE_SIZE);
            const names = await resolveExerciseNames(results);
            setExerciseNames(names);
            setLoading(false);
        })();
    }, [userId, language, resolveExerciseNames]);

    const handleShowMore = async () => {
        setLoadingMore(true);
        const more = await fetchTrainingHistoriesForUser(userId, entries.length);
        const moreNames = await resolveExerciseNames(more);
        setEntries((prev) => [...prev, ...more]);
        setExerciseNames((prev) => ({ ...prev, ...moreNames }));
        setHasMore(more.length === WALL_PAGE_SIZE);
        setLoadingMore(false);
    };

    if (loading) {
        return (
            <div>
                <h2 className="pageTitle">{base.wall}</h2>
                <NewsSkeleton />
            </div>
        );
    }

    if (entries.length === 0) return null;

    return (
        <div>
            <h2 className="pageTitle">{base.wall}</h2>
            <div className={`${styles.histories} container`}>
                {entries.map((entry) => (
                    <div key={entry.id} className={`${styles.historyCard} ${elevatedStyles.elevated}`}>
                        <div className={styles.historyCard__header}>
                            <div className={styles.userInfo}>
                                <Image
                                    src={entry.profiles?.avatar_url || avatarFallbackUrl(entry.profiles?.username)}
                                    width={32}
                                    height={32}
                                    alt="avatar"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = avatarFallbackUrl(entry.profiles?.username);
                                    }}
                                />
                                <p>{entry.profiles?.username}</p>
                            </div>

                            <div className={styles.datBox}>
                                <span>{training.finished}</span>
                                <p className={styles.date}>
                                    {new Date(entry.date).toLocaleString('uk-UA', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>

                        <ul className={styles.exerciseList}>
                            {Object.entries(entry.values as Record<string, string>).map(([exId, value]) => (
                                <li key={exId}>
                                    <p>
                                        {exerciseNames[exId] || exId}:{' '}
                                        <span className={styles.exerciseList__weight}>{value}</span>
                                    </p>
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
        </div>
    );
}
