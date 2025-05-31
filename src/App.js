import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Footer from './pages/footer/Footer';
import Header from './pages/header/Header';

function SplashScreen() {
  return (
    <div className="splash-screen">
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    //}, 2500);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {showSplash ? (
        <SplashScreen />
      ) : (
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Main />}></Route>
          </Routes>
          <Footer />
        </Router>
      )}
    </div>
  );
}

export default App;