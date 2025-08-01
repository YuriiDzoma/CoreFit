'use client';
import React, { useEffect, useState } from "react";
import { fetchUserSettings } from "../../../../lib/userData";
import { useAppSelector } from "../../../hooks/redux";
import { getUserId, getLanguage } from "../../../../store/selectors";
import { fetchGlobalProgramsWithDetails } from "../../../../lib/complexesData";
import styles from "./complexes.module.scss";
import Link from "next/link";
import {GlobalDay, GlobalExercise, GlobalProgram} from "../../../../types/training";

const Complexes = () => {
    const userId = useAppSelector(getUserId);
    const language = useAppSelector(getLanguage);
    const [isTrainer, setIsTrainer] = useState(false);
    const [programs, setPrograms] = useState<GlobalProgram[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fetchUserSettings(userId).then((settings) => setIsTrainer(settings.is_trainer ?? false));
        }

        const loadPrograms = async () => {
            setLoading(true);
            const result = await fetchGlobalProgramsWithDetails();
            setPrograms(result);
            setLoading(false);
        };

        loadPrograms();
    }, [userId]);

    const getExerciseName = (exercise: any) => {
        switch (language) {
            case "ukr": return exercise?.details?.name_uk || exercise?.details?.name_en;
            case "rus": return exercise?.details?.name_ru || exercise?.details?.name_en;
            default: return exercise?.details?.name_en;
        }
    };

    return (
        <div>
            <h2 className={'pageTitle'}>Complexes</h2>

            {isTrainer && (
                <div className={`${styles.createLink} submit`}>
                    <Link href="/training/create?global=1" className={styles.createButton}>
                        <span>Create global program</span>
                    </Link>
                </div>
            )}

            {loading ? (
                <p>Loading programs...</p>
            ) : programs.length === 0 ? (
                <p>No global programs found.</p>
            ) : (
                <div className={styles.programList}>
                    {programs.map((program) => (
                        <div key={program.id} className={styles.programCard}>
                            <div className={styles.programCard__header}>
                                <p>Type: {program.type}</p>
                                <h3>{program.title}</h3>
                                <p>Level: {program.level}</p>
                            </div>
                            <div className={styles.programCard__content}>
                                {program.days.map((day: GlobalDay) => (
                                    <div key={day.id} className={styles.dayBlock}>
                                        <h4>Day {day.day_number}</h4>
                                        <ul>
                                            {day.exercises.map((ex: GlobalExercise) => (
                                                <li key={ex.id} className={styles.exerciseItem}>
                                                    <img
                                                        src={ex.details?.image_url}
                                                        alt={getExerciseName(ex)}
                                                        width="40"
                                                        height="40"
                                                    />
                                                    <span>{getExerciseName(ex)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Complexes;
