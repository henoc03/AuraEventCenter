import React, { useEffect } from 'react';
import AOS from 'aos'; 
import 'aos/dist/aos.css';

// Componentes
import Hero from '../components/sections/Hero';      // Hero específico para Home
import About from '../components/sections/About'; // Sección About
import Footer from '../components/common/Footer'; // Footer común
import Main from '../components/common/Main';    // Main común
import Page from '../components/common/Page';    // Página envolvente

function Home() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <Page>
      <Hero />
      <Main>
        <About />
      </Main>
      <Footer />
    </Page>
  );
}

export default Home;
