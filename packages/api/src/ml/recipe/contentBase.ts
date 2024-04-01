import { type Recipe } from '@solu/db';
import { TfIdf, type TfIdfTerm } from 'natural/lib/natural/tfidf/index';


type UserRecipePref = {
    foodDislike: string[]
    mealFrequency: string
    diet:   'Vegan' | 'Standard' | 'Paleo' | 'Pescetarian' | 'Vegetarian' | 'Others';
    dietPref: string[]
}


function calculateCosineSimilarity(vector1: TfIdfTerm[], vector2: TfIdfTerm[]): number {
    // Calculate dot product
    let dotProduct = 0;
    for (const term1 of vector1) {
      const term2 = vector2.find(t => t.term === term1.term);
      if (term2) {
        dotProduct += term1.tfidf * term2.tfidf;
      }
    }
  
    // Calculate magnitudes
    const magnitude1 = Math.sqrt(vector1.reduce((sum, term) => sum + term.tfidf ** 2, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, term) => sum + term.tfidf ** 2, 0));
  
    // Calculate cosine similarity
    const similarity = dotProduct / (magnitude1 * magnitude2);
    return similarity;
}

const preprocessData = (userPreferences: UserRecipePref, recipes: Recipe[]) => {
    // Convert user preferences into text format
    const userPreferenceText = [
      userPreferences.diet.toLowerCase(),
      userPreferences.dietPref.join(' ').toLowerCase(),
      userPreferences.mealFrequency.toLowerCase(),
    ].join(' ');
  
    // Create TF-IDF vectorizer
    const tfidfVectorizer = new TfIdf();
    const recipesTexts: string[] = [];

    recipesTexts.push(userPreferenceText);

    recipes.forEach(recipe => {
      const recipeText = [
        recipe.dietType.toLowerCase(),
        recipe.tags.join(' ').toLowerCase()
      ].join(' ');
      tfidfVectorizer.addDocument(recipeText);
      recipesTexts.push(recipeText);
    });

    return { userPreferenceText, tfidfVectorizer, recipesTexts };
};

export function recommendRecipes(userPreferences: UserRecipePref, recipes: Recipe[]): Recipe & {similarity: number}[] {
    const { userPreferenceText, tfidfVectorizer, recipesTexts } = preprocessData(userPreferences, recipes);

    console.log({ userPreferenceText, recipesTexts })

    // Calculate TF-IDF scores for user preferences
    tfidfVectorizer.addDocument(userPreferenceText);

    // Calculate cosine similarity between user preferences and recipe documents using TensorFlow
    const similarityScores: Recipe & {similarity: number} [] = [];
    const userIndex = recipesTexts.length - 1;
    const userTfidf = tfidfVectorizer.listTerms(userIndex);

    recipesTexts.forEach((recipeText, i) => {
        if (i === userIndex) return; // Skip user preferences document
        const recipeTfidf = tfidfVectorizer.listTerms(i);
        // calculate cosine similarity
        let similarity = calculateCosineSimilarity(userTfidf, recipeTfidf);
        console.log({ similarity })
        if (recipes[i].ingredients.some((ingredient) => userPreferences.foodDislike.includes(ingredient.name))) {
            // Reduce similarity score for recipes with disliked foods
            similarity *= 0.4;
        }
        similarityScores.push({ ...recipes[i], similarity });
    });

    // Sort recipes based on cosine similarity scores
    const sortedRecipes = similarityScores.sort((a, b) => b.similarity - a.similarity);
    return sortedRecipes.filter(recipe => recipe.similarity > 0.6);
}
