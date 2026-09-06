'use client';
import React, { useEffect, useState } from "react";
import styles from "./news.module.scss";
import elevatedStyles from "@/ui/elevatedCard/elevatedCard.module.scss";
import { useAppSelector } from "@/app/hooks/redux";
import { getText } from "@/store/selectors";
import { fetchAllNews, type NewsItem } from "@/lib/newsData";

// Local skeleton rather than reusing `NewsSkeleton` (`ui/skeleton/skeleton.tsx`)
// -- that component's shape (avatar + name + exercise-line list) is really
// the Trainings feed's own skeleton (confusingly named), not a fit for a
// real news card's anatomy (image + title/date + description).
function NewsCardSkeleton() {
    return (
        <div className={styles.skeletonCard}>
            <span className={styles.skeletonImage} />
            <span className={`${styles.skeletonBar} ${styles.skeletonTitle}`} />
            <span className={`${styles.skeletonBar} ${styles.skeletonDate}`} />
            <span className={`${styles.skeletonBar} ${styles.skeletonLine}`} />
        </div>
    );
}

const News = () => {
    const { base } = useAppSelector(getText);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchAllNews().then((items) => {
            setNews(items);
            setLoading(false);
        });
    }, []);

    return (
        <div className={styles.news}>
            <h2 className="pageTitle">{base.news}</h2>

            {loading ? (
                <div className={styles.list}>
                    <NewsCardSkeleton />
                    <NewsCardSkeleton />
                </div>
            ) : news.length === 0 ? (
                <p>{base.newsEmpty}</p>
            ) : (
                <div className={styles.list}>
                    {news.map((item) => (
                        <div className={`${styles.card} ${elevatedStyles.elevated}`} key={item.id}>
                            {item.image_url && (
                                <img src={item.image_url} alt={item.title} className={styles.image} />
                            )}
                            <p className={styles.title}>{item.title}</p>
                            <p className={styles.date}>
                                {new Date(item.published_at).toLocaleDateString(undefined, {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                                {' · '}
                                {new Date(item.published_at).toLocaleTimeString(undefined, {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                            <p className={styles.description}>{item.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default News;
