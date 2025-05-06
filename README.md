# GeeKtooL News Scraper

The GeeKtooL News Scraper is a web application that automatically collects, categorizes, and displays the latest news articles from various sources. It's designed to help users stay informed about the latest developments in different categories like business, technology, marketing, and finance.

## Features

- **Automated News Collection**: Automatically scrapes news from trusted sources
- **Content Categorization**: AI-powered categorization of news into relevant topics
- **Full Article Summaries**: Generates concise summaries of full articles
- **Responsive Design**: Works on all devices from mobiles to desktops
- **Category Filtering**: Filter news by categories of interest

## Tech Stack

- **Framework**: Next.js (React)
- **Styling**: TailwindCSS
- **Web Scraping**: Puppeteer
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone git@github.com:aquamoose/geekt-newsScraper.git
   cd geekt-newsScraper
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This application can be deployed on Vercel or any other hosting platform that supports Next.js. Ensure that your hosting provider supports serverless functions and puppeteer for the web scraping functionality.

```bash
npm run build
npm run start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Puppeteer](https://pptr.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [UDN News](https://udn.com/) 
