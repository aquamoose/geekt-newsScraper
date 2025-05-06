import React from 'react';
import Navbar from './components/layout/Navbar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import NewsScraper from './components/NewsScraper';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Header />
      
      <main className="flex-grow">
        <NewsScraper />
      </main>
      
      <Footer />
    </div>
  );
} 
