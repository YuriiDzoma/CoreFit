import React from "react";
import styles from "./create.module.scss";
import Image from "next/image";
import {exerciseTypes} from "../../../../types/training";

interface ExercisesListTypes {
    getExerciseIndex: (id: string) => number;
    exercises: exerciseTypes[];
    toggleSelect: (id: string) => void;
}



const ExercisesList = ({getExerciseIndex, exercises, toggleSelect}: ExercisesListTypes) => {
    return (
        <ul className={styles.exercisesList}>
            {exercises.map((exercise) => {
                const index = getExerciseIndex(exercise.id);
                const isActive = index > 0;
                return (
                    <li
                        key={exercise.id}
                        className={`${styles.exerciseItem} ${isActive ? styles.active : ''}`}
                        onClick={() => toggleSelect(exercise.id)}
                    >
                        <Image
                            src={exercise.image}
                            alt={exercise.name}
                            width={60}
                            height={60}
                            unoptimized
                        />
                        <span className={styles.exerciseText}>{exercise.name}</span>
                        {isActive && <p className={styles.exerciseIndex}><span>{index}</span></p>}
                    </li>
                );
            })}
        </ul>
    )
}

export default ExercisesList;