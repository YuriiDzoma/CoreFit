'use client';

import React, {useEffect, useState} from "react";
import {useAppSelector} from "@/app/hooks/redux";
import {getLanguage} from "@/store/selectors";
import {fetchExerciseById} from "@/lib/trainingData";
import styles from './exerciseDetail.module.scss';
import {useParams} from "next/navigation";

const ExerciseDetail = () => {
    const {id} = useParams();
    const language = useAppSelector(getLanguage);
    const [data, setData] = useState<null | {
        name: string;
        description: string;
        secondary: string;
        video: string;
        image: string;
        type: string;
    }>(null);

    useEffect(() => {
        if (!id || !language) return;

        const load = async () => {
            const lang = language === 'ua' ? 'ukr' : language;
            const exercise = await fetchExerciseById(id as string, lang as 'eng' | 'ukr' | 'rus');

            setData(exercise);
        };

        load();
    }, [id, language]);

    if (!data) return <p className={styles.loading}>Loading exercise...</p>;

    return (
        <div className={styles.exerciseDetail}>
            <h2 className={`${styles.title} title`}>{data.name}</h2>
            <div className={styles.exerciseDetail__info}>
                <p><strong>Type:</strong> {data.type === 'compound' ? 'Compound' : 'Isolation'}</p>
                {data.secondary && (
                    <p><strong>Secondary muscles:</strong> {data.secondary}</p>
                )}
            </div>
            <div className={styles.imgWrapper}>
                <img
                    src={data.image}
                    alt={data.name}
                    className={styles.image}
                />
            </div>
            <p className={styles.description}>{data.description}</p>
            {data.video && (
                <div className={styles.videoWrapper}>
                    <iframe
                        src={data.video.replace("watch?v=", "embed/")}
                        title={data.name}
                        allowFullScreen
                        className={styles.video}
                    />
                </div>
            )}
        </div>
    );
};

export default ExerciseDetail;
