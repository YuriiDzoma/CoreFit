'use client';
import styles from "./disciplineFilter.module.scss";
import { useAppSelector } from "@/app/hooks/redux";
import { getText } from "@/store/selectors";
import { DISCIPLINES, type Discipline } from "@/types/training";

// All / Strength / Cardio / CrossFit (Sprint 153) -- a segmented control
// above the muscle-group tabs in the Wiki and the program exercise chooser.
// Combines with the muscle group and the search; mirrors mobile's
// `DisciplineFilter`.
const DisciplineFilter = ({
    selected,
    onSelect,
}: {
    selected: Discipline | null;
    onSelect: (discipline: Discipline | null) => void;
}) => {
    const { training } = useAppSelector(getText);
    const labels: Record<Discipline, string> = {
        strength: training.disciplineStrength,
        cardio: training.disciplineCardio,
        crossfit: training.disciplineCrossfit,
    };
    const options: { key: Discipline | null; label: string }[] = [
        { key: null, label: training.all },
        ...DISCIPLINES.map((key) => ({ key, label: labels[key] })),
    ];

    return (
        <div className={styles.filter} role="group">
            {options.map(({ key, label }) => (
                <button
                    key={key ?? 'all'}
                    type="button"
                    aria-pressed={selected === key}
                    className={selected === key ? styles.segmentActive : styles.segment}
                    onClick={() => onSelect(key)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export default DisciplineFilter;
