import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import SharedBackground from '../components/SharedBackground';
import PracticeSidebar from '../components/practice/PracticeSidebar';
import ChallengeDetail from '../components/practice/ChallengeDetail';
import ChallengeListPage from '../components/practice/ChallengeListPage';
import WelcomeScreen from '../components/practice/WelcomeScreen';

interface Challenge {
  id: number;
  name: string;
  solved: boolean;
  solves: number;
}

type ViewMode = 'welcome' | 'challengeList' | 'challengeDetail';

function Practice() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('welcome');

  const handleCategorySelect = (category: string) => {
    console.log('Category selected:', category);
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSelectedChallenge(null);
    setViewMode('welcome');
  };

  const handleSubcategorySelect = (category: string, subcategory: string) => {
    console.log('Subcategory selected:', category, subcategory);
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setSelectedChallenge(null);
    setViewMode('challengeList');
  };

  const handleChallengeSelect = (challenge: Challenge) => {
    console.log('Challenge selected:', challenge);
    console.log('Current context:', { selectedCategory, selectedSubcategory });
    setSelectedChallenge(challenge);
    setViewMode('challengeDetail');
  };

  const handleBackToList = () => {
    console.log('Back to list');
    setSelectedChallenge(null);
    setViewMode('challengeList');
  };

  const handleBackToWelcome = () => {
    console.log('Back to welcome');
    setSelectedSubcategory(null);
    setSelectedChallenge(null);
    setViewMode('welcome');
  };

  const renderMainContent = () => {
    console.log('Rendering main content:', { 
      viewMode, 
      selectedCategory, 
      selectedSubcategory, 
      selectedChallenge: selectedChallenge?.name 
    });
    
    switch (viewMode) {
      case 'challengeDetail':
        if (selectedChallenge && selectedCategory && selectedSubcategory) {
          console.log('Rendering ChallengeDetail with:', {
            category: selectedCategory,
            subcategory: selectedSubcategory,
            challenge: selectedChallenge
          });
          return (
            <ChallengeDetail 
              category={selectedCategory}
              subcategory={selectedSubcategory}
              challenge={selectedChallenge}
              onBack={handleBackToList}
            />
          );
        } else {
          console.log('Missing data for ChallengeDetail, showing WelcomeScreen');
          return <WelcomeScreen />;
        }
      
      case 'challengeList':
        if (selectedCategory && selectedSubcategory) {
          console.log('Rendering ChallengeListPage with:', {
            category: selectedCategory,
            subcategory: selectedSubcategory
          });
          return (
            <ChallengeListPage
              category={selectedCategory}
              subcategory={selectedSubcategory}
              onBack={handleBackToWelcome}
              onChallengeSelect={handleChallengeSelect}
            />
          );
        } else {
          console.log('Missing data for ChallengeListPage, showing WelcomeScreen');
          return <WelcomeScreen />;
        }
      
      default:
        console.log('Showing WelcomeScreen');
        return <WelcomeScreen />;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black relative overflow-hidden">
        <SharedBackground />
        
        <div className="relative z-10">
          <Navbar />
          
          <main className="flex min-h-screen pt-16">
            <PracticeSidebar 
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              onCategorySelect={handleCategorySelect}
              onSubcategorySelect={handleSubcategorySelect}
            />
            
            {renderMainContent()}
          </main>
        </div>
      </div>
    </PageTransition>
  );
}

export default Practice;