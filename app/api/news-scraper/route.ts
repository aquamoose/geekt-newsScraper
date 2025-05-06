import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { Browser } from 'puppeteer';
import fs from 'fs';

interface NewsItem {
  title: string;
  source: string;
  url: string;
  summary: string;
  publishedAt: string;
  category: string;
  fullContent?: string;
}

async function scrapeUDN(): Promise<NewsItem[]> {
  console.log('Scraping UDN...');
  
  try {
    // Launch Puppeteer browser
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      // Create a new page
      const page = await browser.newPage();
      
      // Set a more realistic user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36');
      
      // Navigate to UDN news site
      await page.goto('https://udn.com/news/breaknews/1', {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });
      
      console.log('Extracting news items...');
      
      // Extract news items
      const newsItems = await page.evaluate(() => {
        const articleNodes = document.querySelectorAll('.article-list__item');
        console.log(`Found ${articleNodes.length} article nodes in page evaluation`);
        
        if (articleNodes.length === 0) {
          console.log('No article nodes found, might be blocked or page structure changed');
        }
        
        return Array.from(articleNodes).map(article => {
          const titleElement = article.querySelector('.article-list__text h2 a');
          const title = titleElement ? titleElement.textContent?.trim() : '';
          const url = titleElement ? titleElement.href : '';
          
          const timeElement = article.querySelector('.article-list__time');
          const date = timeElement ? timeElement.textContent?.trim() : '';
          
          return { 
            title, 
            url, 
            publishedAt: date || new Date().toISOString().split('T')[0]
          };
        }).filter(item => item.title && item.url);
      });

      console.log(`Found ${newsItems.length} news items from UDN`);
      
      if (newsItems.length === 0) {
        // Take screenshot for debugging if no articles found
        console.log('No news items found, taking screenshot for debugging...');
        await page.screenshot({ path: './public/udn-debug.png' });
        return [];
      }

      // Get summaries for the top articles
      const articlesWithSummaries = [];
      for (let i = 0; i < Math.min(newsItems.length, 10); i++) {
        const article = newsItems[i];
        const enrichedArticle = await fetchContentAndSummarize(article, browser);
        
        // Only add articles that have meaningful summaries
        if (enrichedArticle.summary && 
            enrichedArticle.summary.length > 20 && 
            enrichedArticle.summary !== `${article.title}. 點擊查看原文了解更多。`) {
          articlesWithSummaries.push(enrichedArticle);
        }
      }

      return articlesWithSummaries;
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Error scraping UDN:', error);
    return [];
  }
}

async function fetchContentAndSummarize(newsItem: { title: string, url: string, publishedAt: string }, browser: Browser): Promise<NewsItem> {
  console.log(`Getting content for: ${newsItem.title}`);

  try {
    // Open a new page for each article
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36');
    
    // Navigate to the article URL
    await page.goto(newsItem.url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });
    
    // Extract article content with a flexible approach
    const content = await page.evaluate(() => {
      // Try different selectors to find the main content
      const contentSelectors = [
        '#article-body',
        '.article-content__paragraph',
        '.article-content',
        '.story-content',
        'article',
        '.article-body',
        '.news-content',
        '#story-body'
      ];
      
      for (const selector of contentSelectors) {
        const contentElement = document.querySelector(selector);
        if (contentElement) {
          // Get all paragraph text
          const paragraphs = Array.from(contentElement.querySelectorAll('p'))
            .map(p => p.textContent?.trim())
            .filter(text => text && text.length > 0);
          
          if (paragraphs.length > 0) {
            return paragraphs.join('\n');
          }
          
          // If no paragraphs found, return the element's text
          return contentElement.textContent?.trim() || '';
        }
      }
      
      // Last resort: Get all paragraphs from the page
      const allParagraphs = Array.from(document.querySelectorAll('p'))
        .map(p => p.textContent?.trim())
        .filter(text => text && text.length > 20); // Filter out very short paragraphs
      
      return allParagraphs.join('\n');
    });
    
    await page.close();
    
    if (!content || content.length < 50) {
      console.log(`Couldn't extract meaningful content for: ${newsItem.title}`);
      return {
        title: newsItem.title,
        url: newsItem.url,
        publishedAt: newsItem.publishedAt,
        source: '聯合新聞網',
        category: categorizeArticle(newsItem.title),
        summary: `${newsItem.title}. 點擊查看原文了解更多。`,
      };
    }
    
    // Generate summary using a simple extractive approach
    const summary = generateSimpleSummary(content, newsItem.title);
    
    // Categorize the article
    const category = categorizeArticle(newsItem.title + ' ' + summary);
    
    return {
      title: newsItem.title,
      url: newsItem.url,
      publishedAt: newsItem.publishedAt,
      source: '聯合新聞網',
      category,
      summary,
      fullContent: content.substring(0, 1000) // Store more content for debugging
    };
  } catch (error) {
    console.error(`Error fetching content for ${newsItem.title}:`, error);
    return {
      title: newsItem.title,
      url: newsItem.url,
      publishedAt: newsItem.publishedAt,
      source: '聯合新聞網',
      category: categorizeArticle(newsItem.title),
      summary: `${newsItem.title}. 點擊查看原文了解更多。`,
    };
  }
}

// Function to generate a simple summary from content
function generateSimpleSummary(content: string, title: string): string {
  // Split content into sentences
  const sentences = content.split(/(?<=[.!?])\s+/);
  
  // If we don't have enough sentences, return the first few
  if (sentences.length < 3) {
    return sentences.join(' ');
  }
  
  // Remove sentences that are too short or too long
  const validSentences = sentences.filter(s => 
    s.length > 10 && s.length < 200 && !s.includes(title)
  );
  
  // Return first few valid sentences, joined together
  return validSentences.slice(0, 3).join(' ');
}

// Function to categorize news
function categorizeArticle(text: string): string {
  const lowerText = text.toLowerCase();
  
  const keywords = {
    '行銷': ['行銷', 'marketing', '社群', 'social media', '品牌', 'brand', '廣告', 'ad', 'ads', 'advertising'],
    '商業': ['商業', 'business', '創業', 'startup', '企業', 'enterprise', '經營', 'management'],
    '科技': ['科技', 'tech', 'technology', 'AI', '人工智能', '人工智慧', '機器學習', 'machine learning'],
    '財經': ['金融', 'finance', '投資', 'investment', '股市', 'stock', '基金', 'fund']
  };
  
  for (const [category, catKeywords] of Object.entries(keywords)) {
    if (catKeywords.some(keyword => lowerText.includes(keyword))) {
      return category;
    }
  }
  
  return '其他';
}

export async function GET(): Promise<NextResponse> {
  try {
    console.log('Starting news scraping process...');
    
    // Create public directory if it doesn't exist (for debug screenshots)
    try {
      if (!fs.existsSync('./public')) {
        fs.mkdirSync('./public');
      }
    } catch (error) {
      console.error('Error checking/creating public directory:', error);
    }
    
    // Scrape news from UDN
    const udnNews = await scrapeUDN();
    console.log(`UDN News: ${udnNews.length} items`);
    
    // Check if we have any news items
    if (udnNews.length === 0) {
      console.log('No news items found from UDN');
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch news data',
      });
    }

    // Sort by date (newest first)
    udnNews.sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    console.log(`Returning ${udnNews.length} news items`);
    
    // Save scraped data to file for future reference
    try {
      const filePath = './public/scraped-news.json';
      
      const dataToSave = {
        timestamp: new Date().toISOString(),
        total: udnNews.length,
        articles: udnNews
      };
      
      fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2));
      console.log('Saved scraped news to file for future reference');
    } catch (error) {
      console.error('Error saving scraped news to file:', error);
    }
    
    // Return the news items
    return NextResponse.json({
      success: true,
      data: udnNews,
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while fetching news',
    });
  }
} 
