import React, { useState, useEffect } from 'react';

const TypewriterText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [text]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="inline-block">
      <span className="text-6xl font-bold text-white">{displayText}</span>
      <span className={`text-6xl font-bold text-white ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>_</span>
    </div>
  );
};

export default TypewriterText;