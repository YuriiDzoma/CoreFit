import styles from "./programs.module.scss";
import elevatedStyles from "../../../../ui/elevatedCard/elevatedCard.module.scss";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {ProgramType} from "../../../../types/training";
import {useAppSelector} from "../../../hooks/redux";
import {getIsDarkTheme} from "../../../../store/selectors";
import {useTypeText, useLevelText} from "../../../hooks/useDifficulty";
import {useDayCountText} from "../../../hooks/useDayCountText";

// 'outlined' (default) is the existing bordered look, still used when
// viewing another user's programs. 'elevated' swaps the surface for the
// shared elevated-card style — currently only the My Programs list (own
// profile) opts into it.
type ProgramItemProps = { program: ProgramType; variant?: 'outlined' | 'elevated' };

const ProgramItem = ({program, variant = 'outlined'}: ProgramItemProps) => {
    const isDark = useAppSelector(getIsDarkTheme);
    const typeText = useTypeText();
    const levelText = useLevelText();
    const dayCountText = useDayCountText();

    const className = variant === 'elevated'
        ? `${styles.programItem} ${styles.programItemElevated} ${elevatedStyles.elevated}`
        : styles.programItem;

    return (
        <Link href={`/training/program/${program.id}`} className={className}>
            <li>
                <span>{program.title}</span>
                <p>{typeText(program.type)} • {levelText(program.level)} • {dayCountText(program.days_count)}</p>
            </li>
            <Image
                src={isDark ? '/icons/linkToWhite.svg' : '/icons/linkToDark.svg'}
                width={32}
                height={32}
                alt="to"
                unoptimized
            />
        </Link>
    )
}

export default ProgramItem;