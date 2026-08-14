import { useAppSelector } from "./redux";
import { getText, getLanguage } from "../../store/selectors";
import { AppLanguage } from "../../lib/defaultLanguage";

const BCP47_BY_LANGUAGE: Record<AppLanguage, string> = {
    eng: 'en',
    rus: 'ru',
    ukr: 'uk',
    pl: 'pl',
};

const toBcp47 = (language: string): string =>
    BCP47_BY_LANGUAGE[language as AppLanguage] ?? 'en';

export const useDayCountText = () => {
    const { training } = useAppSelector(getText);
    const language = useAppSelector(getLanguage);

    return (count: number): string => {
        const rule = new Intl.PluralRules(toBcp47(language)).select(count);
        const form = training.dayCount[rule as keyof typeof training.dayCount] ?? training.dayCount.other;
        return `${count} ${form}`;
    };
};
