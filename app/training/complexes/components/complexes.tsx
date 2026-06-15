'use client';
import React, { useEffect, useState } from "react";
import { fetchUserSettings } from "../../../../lib/userData";
import { useAppSelector } from "../../../hooks/redux";
import {getUserId, getLanguage, getIsDarkTheme} from "../../../../store/selectors";
import {
    addGlobalProgramToUser,
    fetchGlobalProgramsWithDetails,
    fetchUserGlobalProgramMap,
    removeGlobalProgramFromUser
} from "../../../../lib/complexesData";
import styles from "./complexes.module.scss";
import Link from "next/link";
import { GlobalDay, GlobalExercise, GlobalProgram } from "../../../../types/training";

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    CircularProgress
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Complexes = () => {
    const isDark = useAppSelector(getIsDarkTheme);
    const userId = useAppSelector(getUserId);
    const language = useAppSelector(getLanguage);
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
            alert("Please login first");
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
            <h2 className={'pageTitle'}>Complexes</h2>

            {isTrainer && (
                <div className={`${styles.createLink} submit`}>
                    <Link href="/training/create?global=1" className={styles.createButton}>
                        <span>Create global program</span>
                    </Link>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <CircularProgress />
                    <p>Loading programs... preloader!</p>
                </div>
            ) : programs.length === 0 ? (
                <p>No global programs found.</p>
            ) : (
                <div className={styles.programList}>
                    {programs.map((program) => (
                        <Accordion key={program.id} className={styles.programCard}
                                   sx={{
                                       backgroundColor: "transparent",
                                       color: isDark ? "#fff" : "#19355A",
                                       border: "1px solid #204879",
                                       borderRadius: "8px",
                                       boxShadow: "none",
                                       margin: "0 0 10px 0 !important",

                                       "&.Mui-expanded": {
                                           margin: "0 0 10px 0 !important",
                                       },

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
                                        <span>Type: {program.type} | Level: {program.level}</span>
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
                                            Day {day.day_number}
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
                                            ? "Loading..."
                                            : userGlobalProgramMap[program.id]
                                                ? "Remove from my programs"
                                                : "Add to my programs"}
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
