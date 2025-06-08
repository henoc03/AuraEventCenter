import React, { useEffect, useState } from 'react';
import AlertMessage from '../components/common/AlertMessage';
import AOS from 'aos'; 
import 'aos/dist/aos.css';

// Componentes
import Hero from '../components/sections/HomeHero';      // Hero específico para Home
import About from '../components/sections/About'; // Sección About
import Footer from '../components/common/Footer'; // Footer común
import Main from '../components/common/Main';    // Main común
import Page from '../components/common/Page';    // Página envolvente

function Home() {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    AOS.init();
    const storedMessage = sessionStorage.getItem('authSuccessMessage');
    const storedType = sessionStorage.getItem('authMessageType');

  if (storedMessage) {
    setMessage(storedMessage);
    setMessageType(storedType || 'success');
    sessionStorage.removeItem('authSuccessMessage');
    sessionStorage.removeItem('authMessageType');
  }
  }, []);
  

  return (
    <Page>
      {message && (
        <AlertMessage
          message={message}
          type={messageType}
          onClose={() => setMessage('')}
          className="alert-floating"
        />
    )}
      <Hero />
      <Main>
        <About />
      </Main>
      <Footer />
    </Page>
  );
}

export default Home;
