import React from "react";
import { MessageCircle } from "lucide-react";
import styles from "./messages.module.scss";

// Placeholder for the not-yet-built Messages feature — the nav item exists
// now so the primary bar's shape doesn't change again once messaging ships.
export default function Page() {
    return (
        <div className={styles.placeholder}>
            <MessageCircle size={40} strokeWidth={1.5} />
            <h1>Messages</h1>
            <p>Coming soon — you&apos;ll be able to message friends directly from here.</p>
        </div>
    );
}
