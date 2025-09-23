export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface Recipe {
  id: string;
  recipeName: string;
  description: string;
  cuisineType: string;
  cookingTime: string;
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
  rating?: number;
  source: 'ai' | 'user';
  isFavorited: boolean;
  comments: Comment[];
}
