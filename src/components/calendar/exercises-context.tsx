import { createContext, ReactNode, useContext, useState } from "react";

const ExercisesContext = createContext<ExerciseContextType | undefined>(undefined)

interface Exercise {
    exerciseType: string;
    sets: { kg: string; count: string }[];
    areaDb: string;
  }

interface ExerciseContextType {
    exercise: Exercise[];
    setExercise: React.Dispatch<React.SetStateAction<Exercise[]>>;
}

export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
    const [exercise, setExercise] = useState<Exercise[]>([])

    return (
        <ExercisesContext.Provider value={{ exercise, setExercise }}>
            {children}
        </ExercisesContext.Provider>
    )
}

export const useExerciseContext = () => {
    const context = useContext(ExercisesContext);
    if (!context) {
      throw new Error("useExerciseContext must be used within an ExerciseProvider");
    }
    return context;
  };