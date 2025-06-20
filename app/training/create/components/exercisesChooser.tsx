'use client';

import React, { useEffect, useState } from 'react';
import styles from './create.module.scss';
import { useAppSelector } from '@/app/hooks/redux';
import { getLanguage, getText } from '@/store/selectors';
import { fetchExercisesByGroup } from '@/lib/trainingData';
import { exerciseTypes } from '@/types/training';
import WikiNav from "../../wiki/components/wikiNav";
import ExercisesList from "./exercisesList";
import Preloader from "../../../../ui/preloader/Preloader";

interface ExercisesChooserProps {
    setIsShowPopup: (value: boolean) => void;
    onSelect: (selected: string[], map: Record<string, { name: string; image: string }>) => void;
    selectedDefault?: string[];
}


const ExercisesChooser: React.FC<ExercisesChooserProps> = ({ setIsShowPopup, onSelect, selectedDefault }) => {
    const language = useAppSelector(getLanguage);
    const { training } = useAppSelector(getText);

    const [isPreloader, setIsPreloader] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<string>('All');
    const [exercises, setExercises] = useState<exerciseTypes[]>([]);
    const [selected, setSelected] = useState<string[]>(selectedDefault || []);

    useEffect(() => {
        setSelected(selectedDefault || []);
    }, [selectedDefault]);


    const [exerciseMap, setExerciseMap] = useState<Record<string, { name: string; image: string }>>({});


    useEffect(() => {
        if (!language) return;

        setIsPreloader(true);

        fetchExercisesByGroup(activeTab, language as 'eng' | 'ukr' | 'rus')
            .then((data) => {
                setExercises(data);

                setExerciseMap((prevMap) => {
                    const updated = { ...prevMap };
                    data.forEach((ex) => {
                        updated[ex.id] = {
                            name: ex.name,
                            image: ex.image,
                        };

                    });
                    return updated;
                });
            })
            .finally(() => {
                setIsPreloader(false);
            });
    }, [activeTab, language]);

    const toggleSelect = (id: string) => {
        setSelected((prev) => {
            if (prev.includes(id)) {
                return prev.filter((ex) => ex !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const getExerciseIndex = (id: string): number => {
        return selected.indexOf(id) + 1;
    };


    return (
        <div className={styles.popupWrapper}>
            <button className={styles.popupCloser} onClick={() => setIsShowPopup(false)} />
            <div className={styles.popup}>
                {/*<h3 className={styles.popup__title}>{training.chooseExercises}</h3>*/}
                <div className={styles.popup__content}>
                    <WikiNav activeTab={activeTab} handleChangeTab={setActiveTab} isCreate/>
                    <ExercisesList getExerciseIndex={getExerciseIndex} exercises={exercises} toggleSelect={toggleSelect}/>
                </div>

                <div className={styles.popup__actions}>
                    <button className={'submit'} onClick={() => setIsShowPopup(false)}>
                        {training.cancel}
                    </button>
                    <button
                        className={'submit'}
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
