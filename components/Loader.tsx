import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-16">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-orange-500"></div>
      <p className="text-lg text-gray-600 font-medium">正在尋找美味食譜並生成餐點圖片...</p>
    </div>
  );
};

export default Loader;
