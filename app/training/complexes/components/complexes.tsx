'use client';
import React, { useEffect, useState } from "react";
import { fetchUserSettings } from "../../../../lib/userData";
import { useAppSelector } from "../../../hooks/redux";
import {getUserId, getLanguage, getIsDarkTheme} from "../../../../store/selectors";
import { fetchGlobalProgramsWithDetails } from "../../../../lib/complexesData";
import styles from "./complexes.module.scss";
import Link from "next/link";
import { GlobalDay, GlobalExercise, GlobalProgram } from "../../../../types/training";

// ✅ MUI Accordion
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

    useEffect(() => {
        if (userId) {
            fetchUserSettings(userId).then((settings) => setIsTrainer(settings.is_trainer ?? false));
        }

        const loadPrograms = async () => {
            setLoading(true);
            const result = await fetchGlobalProgramsWithDetails();
            setPrograms(result);
            setLoading(false);
        };

        loadPrograms();
    }, [userId]);

    const getExerciseName = (exercise: any) => {
        switch (language) {
            case "ukr": return exercise?.details?.name_uk || exercise?.details?.name_en;
            case "rus": return exercise?.details?.name_ru || exercise?.details?.name_en;
            default: return exercise?.details?.name_en;
        }
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
                    <p>Loading programs...</p>
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
                                       border: "1px solid #204879", // тонка рамка
                                       borderRadius: "8px",
                                       marginBottom: "10px",
                                       boxShadow: "none",
                                       margin: '0',
                                       "&:before": { display: "none" }, // прибираємо лінію перед акордеоном
                                   }}>
                            <AccordionSummary
                                expandIcon={
                                    <ExpandMoreIcon sx={{ color: isDark ? "#fff" : "#19355A" }} />
                                }
                                sx={{
                                    minHeight: "40px !important",
                                    padding: "0",
                                    "& .MuiAccordionSummary-content": {
                                        margin: 0,
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
                            <AccordionDetails className={styles.programCard__content}>
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
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Complexes;
