export interface OnboardingState {
  personalInfo: {
    fullName: string;
    age: string;
    gender: string;
    height: string;
    weight: string;
  };
  lifestyle: {
    activityLevel: string;
    dailyRoutine: string;
    sleepDuration: string;
  };
  diet: {
    preference: string;
    cuisines: string[];
    meals: string[];
  };
  allergies: string[];
  goals: {
    primary: string;
    secondary: string[];
  };
  nutritionTargets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
  };
}

export const initialOnboardingState: OnboardingState = {
  personalInfo: {
    fullName: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
  },
  lifestyle: {
    activityLevel: "",
    dailyRoutine: "",
    sleepDuration: "",
  },
  diet: {
    preference: "",
    cuisines: [],
    meals: [],
  },
  allergies: [],
  goals: {
    primary: "",
    secondary: [],
  },
  nutritionTargets: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0,
  },
};
