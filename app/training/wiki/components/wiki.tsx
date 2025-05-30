'use client';

import styles from './wiki.module.scss'
import { useEffect, useState } from 'react';
import WikiNav from "./wikiNav";
import {useAppSelector} from "../../../hooks/redux";
import {getLanguage} from "../../../../store/selectors";
import {fetchExercisesByGroup} from "../../../../lib/trainingData";

export default function Wiki() {
    const language = useAppSelector(getLanguage);

    console.log(language)

    const [activeTab, setActiveTab] = useState<string>('All')
    const [exercises, setExercises] = useState<string[]>([]);

    const fetchExercises = (value: string) => {
        console.log(value)
        const loadExercises = async () => {
            const names = await fetchExercisesByGroup(value);
            console.log(names)
            setExercises(names);
        };

        loadExercises();
    }

    useEffect(() => {
        fetchExercises('All');
    }, []);

    const handleChangeTab = (value: string) => {
        setActiveTab(value);
        fetchExercises(value);
    }

    return (
        <div>
            <h2 className={'pageTitle'}>Wiki Page</h2>
            <div className={styles.content}>
                <ul>
                    {exercises.map((name) => (
                        <li key={name}>{name}</li>
                    ))}
                </ul>
                <WikiNav activeTab={activeTab} handleChangeTab={handleChangeTab} />
            </div>
        </div>
    );
}