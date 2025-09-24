
import React, { useState } from 'react';
import CloseIcon from './icons/CloseIcon';

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, setIngredients }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addIngredient();
    }
  };

  const addIngredient = () => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput && !ingredients.includes(trimmedInput)) {
      setIngredients([...ingredients, trimmedInput]);
    }
    setInputValue('');
  };

  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient !== ingredientToRemove));
  };

  return (
    <div className="w-full">
      <label htmlFor="ingredient-input" className="block text-sm font-medium text-gray-700 mb-1">
        輸入您的食材（按 Enter 或逗號新增）
      </label>
      <div className="relative">
        <input
          id="ingredient-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="例如：雞肉、番茄、米飯"
          className="w-full p-3 pr-20 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
        />
        <button 
          onClick={addIngredient}
          className="absolute inset-y-0 right-0 flex items-center px-4 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition"
        >
          新增
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full animate-fade-in">
            <span>{ingredient}</span>
            <button onClick={() => removeIngredient(ingredient)} className="ml-2 text-orange-600 hover:text-orange-800">
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientInput;