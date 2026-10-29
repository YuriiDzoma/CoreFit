import { useRef } from 'react';
import type React from 'react';

const LONG_PRESS_MS = 450;
// A finger drifting further than this is a scroll, not a press.
const MOVE_TOLERANCE_PX = 10;

// Long press on touch (Telegram/Viber-style message and chat menus), right
// click on desktop. Also swallows the click that a touch long press would
// otherwise fire on release, so a long press on a <Link> row opens the menu
// without navigating. Spread the result onto the target element.
export function useLongPress(onLongPress: (() => void) | undefined) {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const start = useRef<{ x: number; y: number } | null>(null);
    const fired = useRef(false);

    const clear = () => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = null;
        start.current = null;
    };

    if (!onLongPress) return {};

    return {
        onTouchStart: (e: React.TouchEvent) => {
            fired.current = false;
            const touch = e.touches[0];
            start.current = { x: touch.clientX, y: touch.clientY };
            timer.current = setTimeout(() => {
                fired.current = true;
                clear();
                onLongPress();
            }, LONG_PRESS_MS);
        },
        onTouchMove: (e: React.TouchEvent) => {
            const touch = e.touches[0];
            if (
                start.current &&
                (Math.abs(touch.clientX - start.current.x) > MOVE_TOLERANCE_PX ||
                    Math.abs(touch.clientY - start.current.y) > MOVE_TOLERANCE_PX)
            ) {
                clear();
            }
        },
        onTouchEnd: clear,
        onTouchCancel: clear,
        onContextMenu: (e: React.MouseEvent) => {
            e.preventDefault();
            // On touch devices the timer above already opened the menu.
            if (fired.current) return;
            onLongPress();
        },
        onClickCapture: (e: React.MouseEvent) => {
            if (fired.current) {
                e.preventDefault();
                e.stopPropagation();
                fired.current = false;
            }
        },
    };
}
