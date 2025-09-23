import React, { useState, useCallback, useEffect } from 'react';
import { Recipe, Comment } from './types';
import { generateRecipes } from './services/geminiService';
import IngredientInput from './components/IngredientInput';
import RecipeCard from './components/RecipeCard';
import Loader from './components/Loader';
import ChefHatIcon from './components/icons/ChefHatIcon';
import SearchIcon from './components/icons/SearchIcon';
import BookmarkIcon from './components/icons/BookmarkIcon';

type View = 'generator' | 'favorites';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cookingTime, setCookingTime] = useState<string>('不限');
  const [flavorPreference, setFlavorPreference] = useState<string>('');
  const [cookingEquipment, setCookingEquipment] = useState<string>('');
  const [servingSize, setServingSize] = useState<string>('');
  const [view, setView] = useState<View>('generator');

  useEffect(() => {
    try {
      const storedRecipes = localStorage.getItem('recipes');
      if (storedRecipes) {
        setRecipes(JSON.parse(storedRecipes));
      }
    } catch (e) { {
      console.error("Failed to parse recipes from localStorage", e);
      setRecipes([]);
    }
    }
  }, []);

  const updateAndStoreRecipes = (newRecipes: Recipe[] | ((prevRecipes: Recipe[]) => Recipe[])) => {
    const updatedRecipes = typeof newRecipes === 'function' ? newRecipes(recipes) : newRecipes;
    setRecipes(updatedRecipes);
    localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
  };

  const handleGenerateRecipes = useCallback(async () => {
    if (ingredients.length === 0) {
      setError("請至少加入一種食材。");
      return;
    }
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await generateRecipes(ingredients, cookingTime, flavorPreference, cookingEquipment, servingSize);
      const newAiRecipes = result.map(r => ({
        ...r,
        id: crypto.randomUUID(),
        source: 'ai' as const,
        isFavorited: false,
        comments: [],
        rating: 0,
      }));

      updateAndStoreRecipes(prev => [...newAiRecipes, ...prev]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("發生未知錯誤。");
      }
    } finally {
      setIsLoading(false);
    }
  }, [ingredients, cookingTime, flavorPreference, cookingEquipment, servingSize, recipes]);
  
  const handleRateRecipe = (recipeId: string, newRating: number) => {
    updateAndStoreRecipes(currentRecipes =>
      currentRecipes.map(recipe =>
        recipe.id === recipeId ? { ...recipe, rating: newRating } : recipe
      )
    );
  };

  const handleToggleFavorite = (recipeId: string) => {
    updateAndStoreRecipes(currentRecipes =>
      currentRecipes.map(recipe =>
        recipe.id === recipeId ? { ...recipe, isFavorited: !recipe.isFavorited } : recipe
      )
    );
  };

  const handleAddComment = (recipeId: string, commentText: string) => {
     const newComment: Comment = {
      id: crypto.randomUUID(),
      author: '您',
      text: commentText,
      timestamp: new Date().toISOString(),
    };
    updateAndStoreRecipes(currentRecipes =>
      currentRecipes.map(recipe =>
        recipe.id === recipeId ? { ...recipe, comments: [...recipe.comments, newComment] } : recipe
      )
    );
  };
  
  const favoritedRecipes = recipes.filter(r => r.isFavorited);

  const WelcomeMessage: React.FC<{ message: string; subMessage: string }> = ({ message, subMessage }) => (
      <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md">
          <ChefHatIcon className="mx-auto h-16 w-16 text-orange-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-700">{message}</h2>
          <p className="mt-2 text-gray-500">{subMessage}</p>
      </div>
  );

  const RecipeGridView: React.FC<{ recipesToShow: Recipe[] }> = ({ recipesToShow }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {recipesToShow.map((recipe) => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            onRate={(newRating) => handleRateRecipe(recipe.id, newRating)}
            onToggleFavorite={() => handleToggleFavorite(recipe.id)}
            onAddComment={(comment) => handleAddComment(recipe.id, comment)}
          />
        ))}
      </div>
  );

  const FavoritesView = () => (
    <div className="animate-fade-in">
      {!isLoading && favoritedRecipes.length === 0 ? (
        <WelcomeMessage
          message="您的收藏夾是空的"
          subMessage="在食譜牆上點擊 ❤️ 來收藏您喜歡的食譜！"
        />
      ) : (
        <RecipeGridView recipesToShow={favoritedRecipes} />
      )}
    </div>
  );
  
  const renderView = () => {
    switch(view) {
        case 'generator':
            return (
              <>
                <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-4 animate-fade-in">
                  <IngredientInput ingredients={ingredients} setIngredients={setIngredients} />
                  
                  <div>
                    <label htmlFor="cooking-time" className="block text-sm font-medium text-gray-700 mb-1">
                      希望製作的時間
                    </label>
                    <select
                      id="cooking-time"
                      value={cookingTime}
                      onChange={(e) => setCookingTime(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white"
                      aria-label="選擇希望的製作時間"
                    >
                      <option value="不限">不限</option>
                      <option value="15 分鐘">15 分鐘內</option>
                      <option value="30 分鐘">30 分鐘內</option>
                      <option value="1 小時">1 小時內</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="flavor-preference" className="block text-sm font-medium text-gray-700 mb-1">
                      偏好調味 (輸入或空白)
                    </label>
                    <input
                      id="flavor-preference"
                      type="text"
                      value={flavorPreference}
                      onChange={(e) => setFlavorPreference(e.target.value)}
                      placeholder="例如：麻辣、清淡、酸甜"
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="cooking-equipment" className="block text-sm font-medium text-gray-700 mb-1">
                      偏好烹飪器材 (輸入或空白)
                    </label>
                    <input
                      id="cooking-equipment"
                      type="text"
                      value={cookingEquipment}
                      onChange={(e) => setCookingEquipment(e.target.value)}
                      placeholder="例如：烤箱、氣炸鍋、電鍋"
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="serving-size" className="block text-sm font-medium text-gray-700 mb-1">
                      份量（輸入人數或菜量）
                    </label>
                    <input
                      id="serving-size"
                      type="text"
                      value={servingSize}
                      onChange={(e) => setServingSize(e.target.value)}
                      placeholder="例如：2人份、一盤"
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                  </div>

                  <button
                    onClick={handleGenerateRecipes}
                    disabled={isLoading || ingredients.length === 0}
                    className="mt-2 w-full flex items-center justify-center gap-2 bg-orange-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        <span>正在生成中...</span>
                      </>
                    ) : (
                      <>
                        <SearchIcon className="h-5 w-5" />
                        <span>尋找食譜</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-12">
                  {isLoading && <Loader />}
                  {!isLoading && !error && recipes.length === 0 && (
                    <WelcomeMessage 
                      message="您的食譜牆空空如也"
                      subMessage="試著生成一些 AI 食譜來填滿您的食譜牆吧！"
                    />
                  )}
                  {!isLoading && recipes.length > 0 && <RecipeGridView recipesToShow={recipes} />}
                </div>
              </>
            );
        case 'favorites':
            return <FavoritesView />;
        default:
            return null;
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-3">
              <ChefHatIcon className="h-10 w-10 text-orange-500" />
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
                小廚神清冰箱
              </h1>
            </div>
            <p className="text-2xl text-gray-500 font-light tracking-widest">Fridgician</p>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            冰箱打開，擺滿食材卻不知道可以煮什麼？我們都懂。請放心交給我們，為您的家客製化美味晚餐
          </p>
        </header>
        
        <div className="max-w-xl mx-auto mb-8">
            <div className="grid grid-cols-2 border border-gray-200 rounded-lg p-1 bg-gray-100">
                <button 
                    onClick={() => setView('generator')}
                    className={`py-2.5 text-center font-semibold rounded-md transition-all duration-300 flex items-center justify-center gap-2 ${view === 'generator' ? 'bg-white shadow text-orange-600' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                    <SearchIcon className="w-5 h-5" />
                    AI 食譜生成
                </button>
                 <button 
                    onClick={() => setView('favorites')}
                    className={`py-2.5 text-center font-semibold rounded-md transition-all duration-300 flex items-center justify-center gap-2 ${view === 'favorites' ? 'bg-white shadow text-orange-600' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                    <BookmarkIcon className="w-5 h-5" />
                    我的收藏 ({favoritedRecipes.length})
                </button>
            </div>
        </div>


        <div className="mt-12 max-w-5xl mx-auto">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow mb-6" role="alert">
              <p className="font-bold">哎呀！出了點問題。</p>
              <p>{error}</p>
            </div>
          )}

          {renderView()}
        </div>
      </main>
      <footer className="text-center py-4 mt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500">由 Gemini AI 強力驅動</p>
      </footer>
    </div>
  );
};

export default App;