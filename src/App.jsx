// navigation and hero
import About from './components/sections/About';
import Header from './components/sections/Header';
import Navigation from './components/sections/Navigation';
// main
import Main from './components/sections/Main';
// page
import Page from './components/sections/Page'
// footer
import Footer from './components/sections/Footer';

import React, { useEffect } from 'react';
import AOS from 'aos'; 
import 'aos/dist/aos.css'; 

function App() {
  useEffect(() => {
    AOS.init({
    });
  }, []);
  return (
  <Page>
    <Header>
      <Navigation/>
    </Header>
    <Main>
    <About/>
    </Main>
    <Footer/>
  </Page>)
}

export default App;