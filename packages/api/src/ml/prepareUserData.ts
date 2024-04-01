

export enum fitnessLevel  {
    Beginner = 'Beginner',
    Intermediate = 'Intermediate',
    Advanced = 'Advanced'
}

type FitnessGoals = 'Weight loss' | 'Muscle tone' | 'Endurance improvement' | 'Stress relief'
type StressManagement = 'Exercise' | 'Meditation' | 'Breathing exercises' | 'Running' | 'Walks' | 'Others' | 'All'
type DietType = 'Paleo' | 'Vegan' | 'Vegetarian' | 'Standard'
type RecipePrefrence = 'Quick' | 'Simple' |  'Affordable' | 'Family-friendly' | 'Meal prep'
type FoodIntake = '1 with a snack' | '3 with a snack' | '2 with a snack' | 'more than 3'


export type UserData = {
    age: number,
    fitnessLevel: fitnessLevel,
    fitnessGoals: FitnessGoals [],
    healthConditions: string[]
    stressLevel: 'Low' | 'Moderate' | 'High',
    stressManagement: StressManagement []
    holisticInterest: boolean
    dietType: DietType,
    dislikedFoods: string[],
    recipePreferences: RecipePrefrence,
    mealsPerDay: FoodIntake
}

export function prepareUserData (userData: UserData){

    const fitnessLevelMapping = { 'Beginner': 0, 'Intermediate': 1, 'Advanced': 2 };
    const stressLevelMapping = { 'Low': 0, 'Moderate': 1, 'High': 2 };
    const dietTypeMapping = { 'Paleo': 0, 'Vegan': 1, 'Vegetarian': 2, 'Standard': 3 };
    const mealFrequencyMapping = { '1 with a snack': 1, '3 with a snack': 3, '2 with a snack': 2, 'more than 3': 4 };

    const processedData = {
        age: userData.age, 
        fitnessLevel: fitnessLevelMapping[userData.fitnessLevel],
        fitnessGoals: userData.fitnessGoals, 
        healthConditions: userData.healthConditions,
        stressLevel: stressLevelMapping[userData.stressLevel],
        stressManagement: userData.stressManagement, 
        holisticInterest: userData.holisticInterest ? 1 : 0, 
        dietType: dietTypeMapping[userData.dietType],
        dislikedFoods: userData.dislikedFoods, 
        recipePreferences: userData.recipePreferences, 
        mealsPerDay: mealFrequencyMapping[userData.mealsPerDay],
    };

    return processedData;
}