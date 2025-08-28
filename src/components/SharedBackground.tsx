import React from 'react';

const SharedBackground = () => {
  return (
    <div className="absolute inset-0">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=1920&q=60")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
    </div>
  );
};

export default SharedBackground;