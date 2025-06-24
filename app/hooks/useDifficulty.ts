import {useAppSelector} from "./redux";
import {getText} from "../../store/selectors";


export const useLevelText = () => {
    const { training } = useAppSelector(getText);

    return (level: string): string => {
        switch (level) {
            case 'beginner':
                return training.beginner;
            case 'intermediate':
                return training.intermediate;
            case 'advanced':
                return training.advanced;
            case 'expert':
                return training.expert;
            case 'professional':
                return training.professional;
            default:
                return level;
        }
    };
};

export const useTypeText = () => {
    const { training } = useAppSelector(getText);

    return (type: string): string => {
        switch (type) {
            case 'aerobic':
                return training.aerobic;
            case 'anaerobic':
                return training.anaerobic;
            case 'crossfit':
                return training.crossfit;
            default:
                return type;
        }
    };
};