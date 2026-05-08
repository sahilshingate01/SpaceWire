import React from 'react';
import Header from './components/Header';
import ISSLiveTracking from './components/ISSLiveTracking';
import SpeedTrend from './components/SpeedTrend';
import BreakingNews from './components/BreakingNews';

import Footer from './components/Footer';

function App() {
  return (
    <div className="dashboard-container">
      <Header />
      
      <div className="main-grid">
        <ISSLiveTracking />
        <SpeedTrend />
      </div>

      <BreakingNews />



      <Footer />
    </div>
  );
}

export default App;
