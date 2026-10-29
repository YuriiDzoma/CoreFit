import styles from './globalPopup.module.scss';
import React from "react";
import {useAppSelector} from "../../hooks/redux";
import {getText} from "../../../store/selectors";


interface GlobalPopupProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    // Optional extra content between the message and the buttons -- e.g. the
    // "Also delete for <name>" checkbox when deleting a chat.
    children?: React.ReactNode;
}

const GlobalPopup: React.FC<GlobalPopupProps> = ({ title, message, onConfirm, onCancel, children }) => {
    const { training } = useAppSelector(getText);

    return (
        <div className={styles.globalPopup}>
            <h3 className={'title'}>{title}</h3>
            <p>{message}</p>
            {children}
            <div className={styles.actions}>
                <button onClick={onCancel} className={'button'}>{training.cancel}</button>
                <button onClick={onConfirm} className={'button'}>{training.confirm}</button>
            </div>
        </div>
    );
};


export default GlobalPopup;