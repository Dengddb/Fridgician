import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      recipeName: {
        type: Type.STRING,
        description: "食譜的名稱。",
      },
      description: {
        type: Type.STRING,
        description: "對菜餚的簡短誘人描述，約2-3句話。",
      },
      cuisineType: {
        type: Type.STRING,
        description: "菜式類型，例如：義大利菜、墨西哥菜、中式菜。",
      },
      cookingTime: {
        type: Type.STRING,
        description: "完成這道菜所需的預計總時間，例如：'約30分鐘'。",
      },
      ingredients: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: "食譜所需的所有食材清單，包含份量。",
      },
      instructions: {
        type: Type.ARRAY,
        items: {
            type: Type.STRING,
        },
        description: "逐步的烹飪說明。",
      },
    },
    required: ["recipeName", "description", "cuisineType", "cookingTime", "ingredients", "instructions"],
  },
};

export const generateRecipes = async (ingredients: string[], cookingTime: string, flavorPreference: string, cookingEquipment: string, servingSize: string): Promise<Recipe[]> => {
  if (ingredients.length === 0) {
    return [];
  }

  let prompt = `請根據以下食材清單中的部分或全部食材自由發想3個多樣化的食譜：${ingredients.join(', ')}。`;

  if (cookingTime !== '不限') {
    prompt += ` 請確保每個食譜的烹飪時間都在 ${cookingTime} 內。`;
  }
  
  if (flavorPreference.trim()) {
    prompt += ` 食譜的風味請偏向 "${flavorPreference}"。`;
  }

  if (cookingEquipment.trim()) {
    prompt += ` 請優先考慮使用以下烹飪器材：${cookingEquipment}。`;
  }

  if (servingSize.trim()) {
    prompt += ` 食譜的份量請為 ${servingSize}，並請務必根據此份量調整所有食材的具體用量。`;
  }

  prompt += `每個食譜請提供名稱、簡短描述、菜式類型、預計烹飪時間、所有必需食材的清單（含份量）以及逐步的烹飪說明。請確保輸出為符合所提供結構的JSON格式。`;

  try {
    // Step 1: Generate the text-based recipe data
    const textResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const jsonText = textResponse.text.trim();
    const parsedRecipes: Recipe[] = JSON.parse(jsonText);

    if (!Array.isArray(parsedRecipes)) {
      return [];
    }
    
    // Step 2: Generate a main image for each recipe in parallel
    const imageEnhancedRecipes = await Promise.all(
      parsedRecipes.map(async (recipe) => {
        try {
          const imageResponse = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `一張關於 "${recipe.recipeName}" 的高品質、看起來美味可口的專業美食照片。`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '4:3',
            },
          });
          
          let imageUrl: string | undefined = undefined;
          if (imageResponse.generatedImages?.length > 0) {
            imageUrl = `data:image/jpeg;base64,${imageResponse.generatedImages[0].image.imageBytes}`;
          }

          return { ...recipe, imageUrl };

        } catch (imageError) {
          console.error(`Error generating image for recipe "${recipe.recipeName}":`, imageError);
          return recipe; // Return original recipe if image generation fails
        }
      })
    );

    return imageEnhancedRecipes;

  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("無法生成食譜。AI 可能正忙，請稍後再試。");
  }
};