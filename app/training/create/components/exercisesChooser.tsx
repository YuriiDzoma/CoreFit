'use client';

import React, { useEffect, useState } from 'react';
import styles from './create.module.scss';
import { useAppSelector } from '@/app/hooks/redux';
import { getLanguage, getText } from '@/store/selectors';
import { fetchExercisesByGroup, fetchExercisesByIds } from '@/lib/trainingData';
import { exerciseTypes } from '@/types/training';
import WikiNav from "../../wiki/components/wikiNav";
import ExercisesList from "./exercisesList";
import Preloader from "../../../../ui/preloader/Preloader";

interface ExercisesChooserProps {
    setIsShowPopup: (value: boolean) => void;
    onSelect: (
        selected: string[],
        map: Record<string, { name: string; image: string }>
    ) => void;
    selectedDefault?: string[];
}

const ExercisesChooser: React.FC<ExercisesChooserProps> = ({
                                                               setIsShowPopup,
                                                               onSelect,
                                                               selectedDefault = [],
                                                           }) => {
    const language = useAppSelector(getLanguage);
    const { training } = useAppSelector(getText);

    const [isPreloader, setIsPreloader] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [exercises, setExercises] = useState<exerciseTypes[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [exerciseMap, setExerciseMap] = useState<Record<string, { name: string; image: string }>>({});

    // 🔄 Завантажити дані для вибраних вправ при ініціалізації
    useEffect(() => {
        const shouldLoad = selectedDefault.length > 0 && selected.length === 0 && language;

        if (shouldLoad) {
            const lang = language === 'ua' ? 'ukr' : language;
            setSelected([...selectedDefault]);

            fetchExercisesByIds(selectedDefault, lang as 'eng' | 'ukr' | 'rus')
                .then((map) => {
                    setExerciseMap((prev) => ({ ...prev, ...map }));
                })
                .catch(console.error);
        }
    }, [selectedDefault.join(','), selected.length, language]);

    // 📦 Завантажити список вправ по групі
    useEffect(() => {
        if (!language) return;

        setIsPreloader(true);
        const lang = language === 'ua' ? 'ukr' : language;

        fetchExercisesByGroup(activeTab, lang as 'eng' | 'ukr' | 'rus')
            .then((data) => {
                setExercises(data);

                // 🔃 Доповнити карту вправ
                setExerciseMap((prevMap) => {
                    const updated = { ...prevMap };
                    data.forEach((ex) => {
                        if (!updated[ex.id]) {
                            updated[ex.id] = {
                                name: ex.name,
                                image: ex.image,
                            };
                        }
                    });
                    return updated;
                });
            })
            .finally(() => setIsPreloader(false));
    }, [activeTab, language]);

    // ✅ Вибір вправи
    const toggleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((ex) => ex !== id)
                : [...prev, id]
        );
    };

    // 🆔 Нумерація вправ
    const getExerciseIndex = (id: string): number => {
        const idx = selected.findIndex((item) => item === id);
        return idx >= 0 ? idx + 1 : 0;
    };

    return (
        <div className={styles.popupWrapper}>
            <button className={styles.popupCloser} onClick={() => setIsShowPopup(false)} />

            <div className={styles.popup}>
                <div className={styles.popup__content}>
                    <WikiNav activeTab={activeTab} handleChangeTab={setActiveTab} isCreate />
                    <ExercisesList
                        getExerciseIndex={getExerciseIndex}
                        exercises={exercises}
                        toggleSelect={toggleSelect}
                        selected={selected}
                    />
                </div>

                <div className={styles.popup__actions}>
                    <button
                        className="submit"
                        onClick={() => setIsShowPopup(false)}
                    >
                        {training.cancel}
                    </button>
                    <button
                        className="submit"
                        onClick={() => onSelect(selected, exerciseMap)}
                    >
                        {training.confirm}
                    </button>
                </div>
            </div>

            {isPreloader && <Preloader />}
        </div>
    );
};

export default ExercisesChooser;
