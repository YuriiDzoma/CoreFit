import React from "react";
import styles from "./create.module.scss";
import Image from "next/image";
import { exerciseTypes } from "../../../../types/training";

interface ExercisesListTypes {
    getExerciseIndex: (id: string) => number;
    exercises: exerciseTypes[];
    toggleSelect: (id: string) => void;
    selected: string[];
}

const ExercisesList = ({ getExerciseIndex, exercises, toggleSelect, selected }: ExercisesListTypes) => {

    return (
        <ul className={styles.exercisesList}>
            {exercises.map((exercise) => {
                const isActive = selected.includes(exercise.id);
                const index = isActive ? getExerciseIndex(exercise.id) : null;

                return (
                    <li
                        key={`${exercise.id}-${selected.includes(exercise.id) ? 'active' : 'inactive'}`}
                        className={`${styles.exerciseItem} ${isActive ? styles.active : ''}`}
                        onClick={() => toggleSelect(exercise.id)}
                    >
                        <Image
                            src={exercise.image || '/placeholder.svg'}
                            alt={exercise.name}
                            width={60}
                            height={60}
                            unoptimized
                        />
                        <span className={styles.exerciseText}>{exercise.name}</span>

                        {index !== null && (
                            <p className={styles.exerciseIndex}>
                                <span>{index}</span>
                            </p>
                        )}
                    </li>
                );
            })}

        </ul>
    );
};

export default ExercisesList;
