import styles from "./programs.module.scss";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {ProgramType} from "../../../../types/training";
import {useAppSelector} from "../../../hooks/redux";
import {getIsDarkTheme} from "../../../../store/selectors";


const ProgramItem = ({program}: { program: ProgramType }) => {
    const isDark = useAppSelector(getIsDarkTheme);

    return (
        <Link href={`/training/program/${program.id}`} className={styles.programItem}>
            <li>
                <span>{program.title}</span>
                <p>{program.type} • {program.level} • {program.days_count} day{program.days_count > 1 ? 's' : ''}</p>
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