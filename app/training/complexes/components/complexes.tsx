'use client';
import React, { useEffect, useState } from "react";
import { fetchUserSettings } from "../../../../lib/userData";
import { useAppSelector } from "../../../hooks/redux";
import {getUserId, getLanguage, getIsDarkTheme, getText} from "../../../../store/selectors";
import {
    addGlobalProgramToUser,
    fetchGlobalProgramsWithDetails,
    fetchUserGlobalProgramMap,
    removeGlobalProgramFromUser
} from "../../../../lib/complexesData";
import styles from "./complexes.module.scss";
import Link from "next/link";
import { GlobalDay, GlobalExercise, GlobalProgram } from "../../../../types/training";
import { useTypeText, useLevelText } from "../../../hooks/useDifficulty";

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ComplexesListSkeleton } from "../../../../ui/skeleton/skeleton";

const Complexes = () => {
    const isDark = useAppSelector(getIsDarkTheme);
    const userId = useAppSelector(getUserId);
    const language = useAppSelector(getLanguage);
    const { base, training } = useAppSelector(getText);
    const typeText = useTypeText();
    const levelText = useLevelText();
    const [isTrainer, setIsTrainer] = useState(false);
    const [programs, setPrograms] = useState<GlobalProgram[]>([]);
    const [loading, setLoading] = useState(true);
    const [userGlobalProgramMap, setUserGlobalProgramMap] = useState<Record<string, string>>({});
    const [actionLoadingProgramId, setActionLoadingProgramId] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            if (userId) {
                const settings = await fetchUserSettings(userId);
                setIsTrainer(settings.is_trainer ?? false);

                const addedProgramsMap = await fetchUserGlobalProgramMap(userId);
                setUserGlobalProgramMap(addedProgramsMap);
            } else {
                setIsTrainer(false);
                setUserGlobalProgramMap({});
            }

            const result = await fetchGlobalProgramsWithDetails();
            setPrograms(result);

            setLoading(false);
        };

        loadData();
    }, [userId]);

    const getExerciseName = (exercise: any) => {
        switch (language) {
            case "ukr": return exercise?.details?.name_uk || exercise?.details?.name_en;
            case "rus": return exercise?.details?.name_ru || exercise?.details?.name_en;
            default: return exercise?.details?.name_en;
        }
    };

    const handleToggleProgram = async (programId: string) => {
        if (!userId) {
            alert(training.pleaseLoginFirst);
            return;
        }

        setActionLoadingProgramId(programId);

        const isAdded = Boolean(userGlobalProgramMap[programId]);

        if (isAdded) {
            const success = await removeGlobalProgramFromUser(programId, userId);

            if (success) {
                setUserGlobalProgramMap((prev) => {
                    const next = { ...prev };
                    delete next[programId];
                    return next;
                });
            }
        } else {
            const copiedProgramId = await addGlobalProgramToUser(programId, userId);

            if (copiedProgramId) {
                setUserGlobalProgramMap((prev) => ({
                    ...prev,
                    [programId]: copiedProgramId,
                }));
            }
        }

        setActionLoadingProgramId(null);
    };

    return (
        <div>
            <h2 className={'pageTitle'}>{base.complexes}</h2>

            {isTrainer && (
                <div className={`${styles.createLink} submit`}>
                    <Link href="/training/create?global=1" className={styles.createButton}>
                        <span>{training.createGlobalProgram}</span>
                    </Link>
                </div>
            )}

            {loading ? (
                <ComplexesListSkeleton />
            ) : programs.length === 0 ? (
                <p>{training.noGlobalProgramsFound}</p>
            ) : (
                <div className={styles.programList}>
                    {programs.map((program) => (
                        <Accordion key={program.id} className={styles.programCard}
                                   sx={{
                                       // Same "elevated" recipe as ProgramItem/AllFriends
                                       // (`ui/elevatedCard/elevatedCard.module.scss`) — set
                                       // here via `sx` rather than composing that shared
                                       // class, since MUI's own `sx`-generated styles would
                                       // otherwise fight it for the same properties at
                                       // matching specificity. `border-radius` stays in
                                       // `complexes.module.scss` (not fought over).
                                       backgroundColor: isDark ? "#1B2A47" : "#F0F0F3",
                                       color: isDark ? "#fff" : "#19355A",
                                       border: "none",
                                       // MUI's own `.MuiAccordion-rounded` only rounds the
                                       // top corners of the first item and the bottom
                                       // corners of the last (built for a flush, gap-free
                                       // stack) -- wrong now that `.programList`'s `row-gap`
                                       // gives every card real space around it, same as
                                       // ProgramItem/AllFriends. `!important` needed since
                                       // that built-in rule is more specific than this `sx`.
                                       borderRadius: "4px !important",
                                       boxShadow: isDark
                                           ? "0 0 0 1px rgba(70, 120, 190, 0.2), 0 4px 8px rgba(32, 72, 121, 0.45)"
                                           : "0 2px 5px rgba(0, 0, 0, 0.12)",
                                       // No extra margin -- `.programList`'s own `row-gap:
                                       // 8px` (`complexes.module.scss`) already provides the
                                       // same list spacing ProgramItem/AllFriends use; a
                                       // margin here on top of that gap would make this list
                                       // visibly looser than the other two.
                                       margin: "0 !important",

                                       "&:before": {
                                           display: "none",
                                       },
                                   }}>
                            <AccordionSummary
                                expandIcon={
                                    <ExpandMoreIcon sx={{ color: isDark ? "#fff" : "#19355A" }} />
                                }
                                sx={{
                                    minHeight: "40px !important",
                                    padding: "0",

                                    "&.Mui-expanded": {
                                        minHeight: "40px !important",
                                    },

                                    "& .MuiAccordionSummary-content": {
                                        margin: "0 !important",
                                    },

                                    "& .MuiAccordionSummary-content.Mui-expanded": {
                                        margin: "0 !important",
                                    },
                                }}
                                className={styles.programCard__header}
                            >
                                <div>
                                    <Typography variant="h6">{program.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <span>{training.type}: {typeText(program.type)} | {training.difficulty}: {levelText(program.level)}</span>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {/*<span>Author: {program.author.fullname}</span>*/}
                                    </Typography>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails
                                className={styles.programCard__content}
                                sx={{
                                    padding: "0 !important",
                                }}
                            >
                                {program.days.map((day: GlobalDay) => (
                                    <div key={day.id} className={styles.dayBlock}>
                                        <Typography variant="subtitle1">
                                            {training.dayNumber.replace('{value}', String(day.day_number))}
                                        </Typography>
                                        <ul>
                                            {day.exercises.map((ex: GlobalExercise) => (
                                                <li key={ex.id} className={styles.exerciseItem}>
                                                    <img
                                                        src={ex.details?.image_url}
                                                        alt={getExerciseName(ex)}
                                                        width="40"
                                                        height="40"
                                                    />
                                                    <span>{getExerciseName(ex)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}

                                <div className={styles.programActions}>
                                    <button
                                        type="button"
                                        className={`${styles.programActionButton} ${
                                            userGlobalProgramMap[program.id] ? styles.programActionButtonRemove : ""
                                        }`}
                                        disabled={actionLoadingProgramId === program.id}
                                        onClick={() => handleToggleProgram(program.id)}
                                    >
                                        {actionLoadingProgramId === program.id
                                            ? base.loading
                                            : userGlobalProgramMap[program.id]
                                                ? training.removeFromMyPrograms
                                                : training.addToMyPrograms}
                                    </button>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Complexes;
