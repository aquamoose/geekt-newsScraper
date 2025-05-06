'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { NewsItem } from '../types';

const NewsScraper: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchNews();
  }, [retryCount]);

  const fetchNews = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch from the API
      const response = await fetch('/api/news-scraper', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if we got successful data with news items
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        console.log('Successfully fetched news from API');
        
        // Map over news items and ensure summaries are meaningful
        const processedNews = data.data.map((item: NewsItem) => {
          // If summary is too short or just repeats the title, use a placeholder
          if (!item.summary || item.summary.length < 20 || item.summary === item.title) {
            return {
              ...item,
              summary: `${item.title}. 正在獲取文章摘要，請稍後再試。`
            };
          }
          return item;
        });
        
        setNews(processedNews);
      } else {
        console.warn('No news items returned from API');
        setError('目前無法獲取新聞資料。請稍後重試。');
        setNews([]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('無法獲取新聞資料。請稍後重試。');
      setNews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setFilterCategory(e.target.value);
  };

  const handleRetry = (): void => {
    setRetryCount(prev => prev + 1);
  };

  const filteredNews = filterCategory === 'all'
    ? news
    : news.filter(item => item.category === filterCategory);

  const categories = ['all', ...Array.from(new Set(news.map(item => item.category)))];

  const getPublishedDate = (item: NewsItem): string => {
    return item.publishedAt || item.date || 'Unknown date';
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">最新新聞</h2>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <label htmlFor="category" className="mr-2 text-gray-700">類別:</label>
              <select
                id="category"
                value={filterCategory}
                onChange={handleCategoryChange}
                className="border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? '全部' : category}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              重新整理
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <p className="font-medium">{error}</p>
            </div>
            <button
              onClick={handleRetry}
              className="mt-3 sm:mt-0 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm"
            >
              重試
            </button>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
            <p className="font-medium">沒有找到任何新聞項目。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item, index) => (
              <div key={index} className="p-5 border border-gray-200 rounded-md hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                      item.category === '行銷' || item.category === 'marketing' 
                        ? 'bg-blue-100 text-blue-800' 
                        : item.category === '科技' || item.category === 'technology'
                        ? 'bg-purple-100 text-purple-800'
                        : item.category === '商業' || item.category === 'business'
                        ? 'bg-green-100 text-green-800'
                        : item.category === '財經' || item.category === 'finance'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {getPublishedDate(item)} · {item.source}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                      {item.title}
                      <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </a>
                  </h3>
                  <p className="text-gray-600">{item.summary}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsScraper; 
