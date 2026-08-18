import { createClient } from '@/utils/supabase/client';
import type { AppLanguage } from '@/lib/defaultLanguage';

export type City = {
    id: string;
    name: string;
    name_uk: string | null;
    name_ru: string | null;
    country: string;
    country_code: string;
};

// `cities` also carries `name_uk`/`name_ru`, populated for Ukraine/Russia
// plus a shortlist of other major world cities -- used both to match a
// Cyrillic-script search query (English-only `name` would never match
// one) and to display/persist the city in whichever of the 4 app
// languages is currently active. Country names aren't stored per-city
// (every row of the same country would otherwise repeat, and risk
// drifting out of sync) -- this small lookup covers exactly the country
// codes that have at least one translated city, so a translated city
// name is never paired with an untranslated country name.
const COUNTRY_NAMES_UK: Record<string, string> = {
    UA: 'Україна', RU: 'Росія', PL: 'Польща', DE: 'Німеччина', FR: 'Франція',
    ES: 'Іспанія', IT: 'Італія', NL: 'Нідерланди', AT: 'Австрія', CH: 'Швейцарія',
    CZ: 'Чехія', HU: 'Угорщина', RO: 'Румунія', GR: 'Греція', PT: 'Португалія',
    DK: 'Данія', SE: 'Швеція', NO: 'Норвегія', FI: 'Фінляндія', GB: 'Велика Британія',
    IE: 'Ірландія', BE: 'Бельгія', BY: 'Білорусь', MD: 'Молдова', LT: 'Литва',
    LV: 'Латвія', EE: 'Естонія', TR: 'Туреччина', CN: 'Китай', JP: 'Японія',
    KR: 'Південна Корея', TH: 'Таїланд', SG: 'Сінгапур', AE: 'ОАЕ', EG: 'Єгипет',
    US: 'США', CA: 'Канада', AU: 'Австралія', MX: 'Мексика', AR: 'Аргентина',
    BR: 'Бразилія', IL: 'Ізраїль',
};

const COUNTRY_NAMES_RU: Record<string, string> = {
    UA: 'Украина', RU: 'Россия', PL: 'Польша', DE: 'Германия', FR: 'Франция',
    ES: 'Испания', IT: 'Италия', NL: 'Нидерланды', AT: 'Австрия', CH: 'Швейцария',
    CZ: 'Чехия', HU: 'Венгрия', RO: 'Румыния', GR: 'Греция', PT: 'Португалия',
    DK: 'Дания', SE: 'Швеция', NO: 'Норвегия', FI: 'Финляндия', GB: 'Великобритания',
    IE: 'Ирландия', BE: 'Бельгия', BY: 'Беларусь', MD: 'Молдова', LT: 'Литва',
    LV: 'Латвия', EE: 'Эстония', TR: 'Турция', CN: 'Китай', JP: 'Япония',
    KR: 'Южная Корея', TH: 'Таиланд', SG: 'Сингапур', AE: 'ОАЭ', EG: 'Египет',
    US: 'США', CA: 'Канада', AU: 'Австралия', MX: 'Мексика', AR: 'Аргентина',
    BR: 'Бразилия', IL: 'Израиль',
};

// Mirrors `getExerciseName`'s own per-language fallback shape
// (`complexes.tsx`/`wiki.tsx`): Ukrainian/Russian use their own column
// when populated, everything else (English, Polish -- Polish has no
// dedicated column here, same as exercises) falls back to the canonical
// `name`/`country`.
export const resolveCityLabel = (
    city: City,
    lang: AppLanguage,
): { name: string; country: string } => {
    if (lang === 'ukr' && city.name_uk) {
        return { name: city.name_uk, country: COUNTRY_NAMES_UK[city.country_code] ?? city.country };
    }
    if (lang === 'rus' && city.name_ru) {
        return { name: city.name_ru, country: COUNTRY_NAMES_RU[city.country_code] ?? city.country };
    }
    return { name: city.name, country: city.country };
};

// Short-circuit before hitting the network at all -- an empty/near-empty
// query would just return the highest-population cities globally, not a
// useful "still typing" state.
const MIN_QUERY_LENGTH = 2;

export const searchCities = async (query: string): Promise<City[]> => {
    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) return [];

    const supabase = createClient();
    const { data, error } = await supabase.rpc('search_cities', { query: trimmed });

    if (error) {
        console.error('Error searching cities:', error);
        return [];
    }

    return (data ?? []) as City[];
};

export const getNearestCity = async (lat: number, lng: number): Promise<City | null> => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('nearest_city', { target_lat: lat, target_lng: lng });

    if (error) {
        console.error('Error resolving nearest city:', error);
        return null;
    }

    const rows = (data ?? []) as City[];
    return rows[0] ?? null;
};
