import React, { useState } from 'react';
import { Recipe } from '../types';
import ClockIcon from './icons/ClockIcon';
import StarIcon from './icons/StarIcon';
import HeartIcon from './icons/HeartIcon';
import CommentIcon from './icons/CommentIcon';
import CommentSection from './CommentSection';

interface RecipeCardProps {
  recipe: Recipe;
  onRate: (rating: number) => void;
  onToggleFavorite: () => void;
  onAddComment: (comment: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onRate, onToggleFavorite, onAddComment }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [showComments, setShowComments] = useState(false);
  
  const placeholderUrl = `https://placehold.co/400x250/f97316/ffffff?text=${encodeURIComponent(recipe.recipeName)}`;
  const currentRating = recipe.rating || 0;

  const AuthorChip: React.FC<{ source: 'ai' | 'user' }> = ({ source }) => {
    const chipStyles = {
      ai: "bg-blue-100 text-blue-800",
      user: "bg-green-100 text-green-800",
    };
    const text = source === 'ai' ? "AI生成" : "用戶分享";
    return (
        <span className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide ${chipStyles[source]}`}>
            {text}
        </span>
    );
  };


  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl flex flex-col">
      <div className="relative">
        <img className="w-full h-48 object-cover" src={recipe.imageUrl || placeholderUrl} alt={recipe.recipeName} />
        <AuthorChip source={recipe.source} />
        <button
            onClick={onToggleFavorite}
            className="absolute top-3 right-3 bg-white/70 p-2 rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-200 backdrop-blur-sm"
            aria-label={recipe.isFavorited ? "從收藏中移除" : "加入收藏"}
        >
            <HeartIcon className={`w-6 h-6 ${recipe.isFavorited ? 'text-red-500 fill-current' : 'fill-transparent'}`} />
        </button>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between">
            <div className='flex-grow'>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{recipe.recipeName}</h3>
                <div className="flex items-center text-gray-500 text-sm">
                    <ClockIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                    <span>{recipe.cookingTime}</span>
                </div>
            </div>
            <span className="ml-4 mt-1 flex-shrink-0 inline-block bg-teal-200 text-teal-800 text-xs px-2 py-1 h-fit rounded-full uppercase font-semibold tracking-wide">
                {recipe.cuisineType}
            </span>
        </div>
        <p className="text-gray-600 my-4">{recipe.description}</p>
        
        <div className="space-y-6 flex-grow">
            <div>
                <h4 className="text-lg font-semibold text-gray-700 border-b-2 border-orange-200 pb-1 mb-2">食材</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 columns-2">
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h4 className="text-lg font-semibold text-gray-700 border-b-2 border-orange-200 pb-1 mb-2">作法</h4>
                <ol className="space-y-3 text-gray-600">
                    {recipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-3">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-600 font-bold rounded-full">{index + 1}</span>
                            <p className="flex-1">{instruction}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
         <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => onRate(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none"
                            aria-label={`評分為 ${star} 顆星`}
                        >
                            <StarIcon className={`w-7 h-7 cursor-pointer transition-colors duration-200 ${
                                (hoverRating || currentRating) >= star 
                                ? 'text-yellow-400' 
                                : 'text-gray-300'
                            }`} />
                        </button>
                    ))}
                </div>
                <button 
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors"
                >
                    <CommentIcon className="w-6 h-6" />
                    <span className="font-semibold">{recipe.comments.length}</span>
                </button>
            </div>
        </div>
      </div>
       {showComments && (
        <div className="px-6 pb-6 bg-gray-50">
            <CommentSection comments={recipe.comments} onAddComment={onAddComment} />
        </div>
       )}
    </div>
  );
};

export default RecipeCard;
