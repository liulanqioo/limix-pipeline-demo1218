import React, { useState } from 'react';
import LimixDemoMockPreview from './LimiPreview';
import WelcomePage from './WelcomePage';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  if (showWelcome) {
    return <WelcomePage onEnter={() => setShowWelcome(false)} />;
  }

  return (
    <LimixDemoMockPreview />
  );
}

export default App;
