import React, { useState, useCallback } from 'react';
import { Recipe } from '../types';
import CloseIcon from './icons/CloseIcon';

interface RecipeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecipe: (recipe: Omit<Recipe, 'id' | 'source' | 'isFavorited' | 'comments' | 'rating'>) => void;
}

const RecipeUploadModal: React.FC<RecipeUploadModalProps> = ({ isOpen, onClose, onAddRecipe }) => {
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRecipe({
      recipeName,
      description,
      cuisineType,
      cookingTime,
      ingredients: ingredients.split('\n').filter(i => i.trim()),
      instructions: instructions.split('\n').filter(i => i.trim()),
      imageUrl,
    });
    // The onAddRecipe callback in the parent component closes the modal,
    // which unmounts this component. State is reset automatically on re-mount.
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 relative">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">上傳您的私房食譜</h2>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <CloseIcon className="w-6 h-6"/>
          </button>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label htmlFor="recipe-image" className="block text-sm font-medium text-gray-700">封面圖片</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        {imageUrl ? (
                            <img src={imageUrl} alt="預覽" className="mx-auto h-40 w-auto rounded-md object-cover" />
                        ) : (
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 4v.01M28 8l-6-6-6 6M28 8v12a4 4 0 01-4 4H12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        )}
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                                <span>上傳檔案</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                            </label>
                            <p className="pl-1">或拖曳至此</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
            </div>
            <div>
              <label htmlFor="recipeName" className="block text-sm font-medium text-gray-700">食譜名稱</label>
              <input type="text" id="recipeName" value={recipeName} onChange={e => setRecipeName(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" required/>
            </div>
             <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">描述</label>
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" required></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-700">菜式類型</label>
                    <input type="text" id="cuisineType" value={cuisineType} onChange={e => setCuisineType(e.target.value)} placeholder="例如：中式、家常菜" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" required/>
                 </div>
                 <div>
                    <label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700">烹飪時間</label>
                    <input type="text" id="cookingTime" value={cookingTime} onChange={e => setCookingTime(e.target.value)} placeholder="例如：約 45 分鐘" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" required/>
                 </div>
            </div>
            <div>
              <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">食材 (一行一項)</label>
              <textarea id="ingredients" value={ingredients} onChange={e => setIngredients(e.target.value)} rows={5} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" required placeholder="雞蛋 2顆
醬油 1湯匙"></textarea>
            </div>
            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">作法 (一行一步)</label>
              <textarea id="instructions" value={instructions} onChange={e => setInstructions(e.target.value)} rows={7} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" required placeholder="1. 將雞蛋打散。
2. 加入醬油攪拌均勻。"></textarea>
            </div>
            <div className="pt-2 flex justify-end">
                <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">取消</button>
                <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">發佈食譜</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecipeUploadModal;