import styles from './globalPopup.module.scss';
import React, { useEffect } from "react";
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

    // Drop any selection the long press that opened this already made.
    useEffect(() => {
        window.getSelection()?.removeAllRanges();
    }, []);

    return (
        // Dimmed backdrop over the whole page (floating header/nav included);
        // tapping it cancels, same as ActionMenu and the mobile ConfirmDialog.
        <div className={styles.backdrop} onClick={onCancel}>
            <div className={styles.globalPopup} onClick={(event) => event.stopPropagation()}>
                <h3 className={'title'}>{title}</h3>
                <p>{message}</p>
                {children}
                <div className={styles.actions}>
                    <button onClick={onCancel} className={'button'}>{training.cancel}</button>
                    <button onClick={onConfirm} className={'button'}>{training.confirm}</button>
                </div>
            </div>
        </div>
    );
};


export default GlobalPopup;