import { useState } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import { getIsDarkTheme, getUserId } from "@/store/selectors";
import { setIsDarkTheme } from "@/store/account-slice";
import { updateUserProfile } from "@/lib/userData";

// Dark/light switch, saved on the profile (`dark`) so it follows the user
// across devices. Shared by Header's Menu (<=768px) and the Sidebar.
export default function useThemeToggle() {
    const isDark = useAppSelector(getIsDarkTheme);
    const userId = useAppSelector(getUserId);
    const dispatch = useAppDispatch();
    const [isSaving, setIsSaving] = useState(false);

    const toggleTheme = async () => {
        if (!userId || isSaving) return;
        setIsSaving(true);
        const updated = await updateUserProfile(userId, { dark: !isDark });
        dispatch(setIsDarkTheme(updated?.dark));
        document.documentElement.setAttribute('data-theme', updated?.dark ? 'dark' : 'light');
        setIsSaving(false);
    };

    return { isDark, toggleTheme, isSaving };
}
