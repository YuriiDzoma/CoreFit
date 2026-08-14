'use client';
import React from "react";
import { MessageCircle } from "lucide-react";
import styles from "./messages.module.scss";
import { useAppSelector } from "../hooks/redux";
import { getText } from "../../store/selectors";

// Placeholder for the not-yet-built Messages feature — the nav item exists
// now so the primary bar's shape doesn't change again once messaging ships.
export default function Page() {
    const { base } = useAppSelector(getText);

    return (
        <div className={styles.placeholder}>
            <MessageCircle size={40} strokeWidth={1.5} />
            <h1>{base.messages}</h1>
            <p>{base.messagesComingSoon}</p>
        </div>
    );
}
