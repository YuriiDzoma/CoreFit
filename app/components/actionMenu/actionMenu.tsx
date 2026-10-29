import React from 'react';
import styles from './actionMenu.module.scss';

export interface ActionMenuItem {
    key: string;
    label: string;
    onClick: () => void;
    destructive?: boolean;
}

// The long-press menu (message actions) -- a centered card over a dimmed
// backdrop, same placement as GlobalPopup, item-driven so the caller decides
// which actions apply (own vs. other's message). Mirrors mobile's ActionSheet.
export default function ActionMenu({
    items,
    error,
    onClose,
}: {
    items: ActionMenuItem[];
    error?: string | null;
    onClose: () => void;
}) {
    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
                {items.map((item) => (
                    <button
                        key={item.key}
                        className={`${styles.item} ${item.destructive ? styles.destructive : ''}`}
                        onClick={item.onClick}
                    >
                        {item.label}
                    </button>
                ))}
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    );
}
