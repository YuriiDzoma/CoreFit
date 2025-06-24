import styles from './globalPopup.module.scss';
import React from "react";
import {useAppSelector} from "../../hooks/redux";
import {getText} from "../../../store/selectors";


interface GlobalPopupProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const GlobalPopup: React.FC<GlobalPopupProps> = ({ title, message, onConfirm, onCancel }) => {
    const { training } = useAppSelector(getText);

    return (
        <div className={styles.globalPopup}>
            <h3 className={'title'}>{title}</h3>
            <p>{message}</p>
            <div className={styles.actions}>
                <button onClick={onCancel} className={'button'}>{training.cancel}</button>
                <button onClick={onConfirm} className={'button'}>{training.confirm}</button>
            </div>
        </div>
    );
};


export default GlobalPopup;