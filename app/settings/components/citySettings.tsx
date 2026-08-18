'use client';
import React, { useEffect, useRef, useState } from "react";
import styles from './settings.module.scss';
import { useAppSelector } from "../../hooks/redux";
import { getIsDarkTheme, getLanguage, getText, getUserId } from "../../../store/selectors";
import { fetchUserSettings, updateUserProfile } from "../../../lib/userData";
import { searchCities, getNearestCity, resolveCityLabel, type City } from "../../../lib/citiesData";
import type { AppLanguage } from "../../../lib/defaultLanguage";
import Preloader from "../../../ui/preloader/Preloader";

const DEBOUNCE_MS = 250;
const MIN_QUERY_LENGTH = 2;
const APP_LANGUAGES: AppLanguage[] = ['eng', 'rus', 'ukr', 'pl'];

function formatCity(city: { name: string; country: string }): string {
    return `${city.name}, ${city.country}`;
}

// Hand-rolled text input + inline suggestion list (no MUI Autocomplete —
// MUI is used only in Complexes' Accordion elsewhere in this app, and a
// visually-mismatched widget here would break with every other
// hand-styled settings input) plus a "detect automatically" action, both
// backed entirely by the self-hosted `cities`/`nearest_city` lookup in
// citiesData.ts, never an external geocoding API. Same instant-apply,
// own-section shape as TrainerSettings above it, reusing its
// `.languages/.profile/.trainer` shared block via the new `.location`
// selector rather than inventing a second layout.
const CitySettings = () => {
    const { settings } = useAppSelector(getText);
    const isDark = useAppSelector(getIsDarkTheme);
    const userId = useAppSelector(getUserId);
    const rawLanguage = useAppSelector(getLanguage);
    const language: AppLanguage = APP_LANGUAGES.includes(rawLanguage as AppLanguage)
        ? (rawLanguage as AppLanguage)
        : 'eng';

    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [dirty, setDirty] = useState(false);
    const [suggestions, setSuggestions] = useState<City[]>([]);
    const [searching, setSearching] = useState(false);
    const [isPreloader, setIsPreloader] = useState(false);
    const [detecting, setDetecting] = useState(false);
    const [detectError, setDetectError] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }
        fetchUserSettings(userId).then((s) => {
            setQuery(s.city ? (s.country ? formatCity({ name: s.city, country: s.country }) : s.city) : '');
            setLoading(false);
        });
    }, [userId]);

    useEffect(() => {
        if (!dirty || query.trim().length < MIN_QUERY_LENGTH) {
            setSuggestions([]);
            setSearching(false);
            return;
        }
        setSearching(true);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            searchCities(query)
                .then(setSuggestions)
                .finally(() => setSearching(false));
        }, DEBOUNCE_MS);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, dirty]);

    const persist = async (label: { name: string; country: string }) => {
        if (!userId) return;
        setIsPreloader(true);
        await updateUserProfile(userId, { city: label.name, country: label.country });
        setIsPreloader(false);
    };

    // Resolves to whichever of the 4 app languages is currently active
    // (native Ukrainian/Russian name where the city has one, canonical
    // English otherwise) before displaying or persisting -- never the raw
    // English `city.name`/`city.country` directly.
    const handleSelect = (city: City) => {
        const label = resolveCityLabel(city, language);
        setQuery(formatCity(label));
        setDirty(false);
        setSuggestions([]);
        void persist(label);
    };

    const handleDetect = () => {
        if (!navigator.geolocation) {
            setDetectError(true);
            return;
        }
        setDetecting(true);
        setDetectError(false);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                getNearestCity(position.coords.latitude, position.coords.longitude).then((nearest) => {
                    setDetecting(false);
                    if (!nearest) {
                        setDetectError(true);
                        return;
                    }
                    handleSelect(nearest);
                });
            },
            () => {
                setDetecting(false);
                setDetectError(true);
            },
        );
    };

    if (loading) return null;

    const showSuggestions = dirty && suggestions.length > 0;
    const showNoMatches =
        dirty && !searching && suggestions.length === 0 && query.trim().length >= MIN_QUERY_LENGTH;

    return (
        <div className={styles.location}>
            <p className={styles.languages__title}>{settings.locationSection}</p>
            <input
                className={styles.location__input}
                type="text"
                value={query}
                placeholder={settings.cityPlaceholder}
                style={{ color: isDark ? '#fff' : '#19355A' }}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setDirty(true);
                }}
            />
            {showSuggestions && (
                <ul className={styles.location__dropdown}>
                    {suggestions.map((item) => (
                        <li key={item.id}>
                            <button
                                type="button"
                                className={styles.location__suggestion}
                                onClick={() => handleSelect(item)}
                            >
                                {formatCity(resolveCityLabel(item, language))}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {showNoMatches && <p className={styles.trainer__hint}>{settings.noMatches}</p>}
            <button
                type="button"
                className={styles.location__detect}
                onClick={handleDetect}
                disabled={detecting}
            >
                {settings.detectLocation}
            </button>
            {detectError && <p className="errorMsg">{settings.locationError}</p>}
            {isPreloader && <Preloader />}
        </div>
    );
};

export default CitySettings;
