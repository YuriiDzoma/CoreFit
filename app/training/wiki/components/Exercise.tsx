import React from "react";
import {exerciseTypes} from "../../../../types/training";
import styles from './wiki.module.scss';
import useWindowSize from "../../../hooks/useWindowSize";
import Image from "next/image";
import Link from 'next/link';


interface Props {
    item: exerciseTypes;
}

const Exercise = ({ item }: Props) => {
    const { width } = useWindowSize();

    return (
        <Link href={`/training/wiki/${item.id}`} className={styles.exercise}>
            <Image
                src={item.image}
                width={width < 768 ? 64 : 112}
                height={width < 768 ? 64 : 112}
                alt={item.name}
                unoptimized
            />
            <span>{item.name}</span>
        </Link>
    );
};

export default Exercise;
