import React from 'react';
import Link from 'next/link';
import Button from '../ui/Button';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          即時新聞監測與分析
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          GeeKtooL 新聞爬蟲為您自動收集並分類最新消息，助您掌握行業脈動與市場趨勢
        </p>
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <Link href="https://geekt.tool/submit">
            <Button variant="light" size="lg">
              分享你的想法，我們來實現
            </Button>
          </Link>
          <Link href="https://geekt.tool/apps">
            <Button variant="highlight" size="lg">
              探索更多小工具
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header; 
