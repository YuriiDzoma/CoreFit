export type AppLanguage = 'eng' | 'rus' | 'ukr' | 'pl';

const CIS_COUNTRY_CODES = [
    'AM',
    'AZ',
    'BY',
    'KZ',
    'KG',
    'MD',
    'RU',
    'TJ',
    'TM',
    'UZ',
];

const CIS_TIME_ZONES = [
    'Europe/Moscow',
    'Europe/Minsk',
    'Europe/Chisinau',
    'Asia/Yerevan',
    'Asia/Baku',
    'Asia/Almaty',
    'Asia/Aqtau',
    'Asia/Aqtobe',
    'Asia/Atyrau',
    'Asia/Oral',
    'Asia/Bishkek',
    'Asia/Dushanbe',
    'Asia/Ashgabat',
    'Asia/Samarkand',
    'Asia/Tashkent',
];

const getCountryCodeFromLocale = (locale?: string): string | null => {
    if (!locale) return null;

    const parts = locale.split('-');

    if (parts.length < 2) return null;

    return parts[1].toUpperCase();
};

export const getDefaultLanguageByRegion = (): AppLanguage => {
    if (typeof window === 'undefined') {
        return 'eng';
    }

    const browserLocales = navigator.languages?.length
        ? navigator.languages
        : [navigator.language];

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const countryCodes = browserLocales
        .map(getCountryCodeFromLocale)
        .filter(Boolean) as string[];

    const primaryLocale = browserLocales[0]?.toLowerCase() || '';

    if (timeZone === 'Europe/Kyiv' || timeZone === 'Europe/Kiev') {
        return 'ukr';
    }

    if (timeZone === 'Europe/Warsaw') {
        return 'pl';
    }

    if (CIS_TIME_ZONES.includes(timeZone)) {
        return 'rus';
    }

    if (countryCodes.includes('UA')) {
        return 'ukr';
    }

    if (countryCodes.includes('PL')) {
        return 'pl';
    }

    if (countryCodes.some((code) => CIS_COUNTRY_CODES.includes(code))) {
        return 'rus';
    }

    if (primaryLocale.startsWith('uk')) {
        return 'ukr';
    }

    if (primaryLocale.startsWith('pl')) {
        return 'pl';
    }

    if (primaryLocale.startsWith('ru')) {
        return 'rus';
    }

    return 'eng';
};