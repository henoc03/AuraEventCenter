import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import '../style/contact.css';
import RoomsServicesHero  from "../components/sections/ClientDefaultHero";
import heroImage from "../assets/images/services-hero.jpg";
import Footer from "../components/common/Footer";
import Navigation from '../components/common/Navigation';
import AOS from "aos";
import "aos/dist/aos.css";


const PORT = "http://localhost:1522";

const ContactForm = () => {
  
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
    useEffect(() => {
      AOS.init();
        fetchUserInfo();
    }, []);
  

  const [responseMessage, setResponseMessage] = useState('');
  const [messageColor, setMessageColor] = useState('black');


    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const { id } = jwtDecode(token);
        const res = await fetch(`${PORT}/users/${id}`);
        const user = await res.json();
        setFormData((prev) => ({
        ...prev,
        name: user.FIRST_NAME+' ' +user.LAST_NAME_1+' ' +user.LAST_NAME_2|| '',
        email: user.EMAIL || ''
        }));
      } catch (err) {
        console.error("Error al obtener usuario:", err);
      }
    };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:1522/email/contactar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok) {
        setResponseMessage('¡Mensaje enviado correctamente!');
        setMessageColor('green');
        setFormData({ ...formData, subject: '', message: '' }); 
      } else {
        setResponseMessage(result.error || 'Error al enviar el mensaje.');
        setMessageColor('red');
      }
    } catch (err) {
      setResponseMessage('Error al conectar con el servidor.');
      setMessageColor('red');
    }
  };
  

  return (
    <div className='contact-page'>

      <div className="contact-navigation-container">
        <Navigation />
      </div>
   <section className="contact-wrapper" data-aos="fade-down"
                        data-aos-duration="1500">
  <div className="contact-container">
    <div className="social-panel">
  <ul>
    <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
    <li><a href="#"><i className="fab fa-twitter"></i></a></li>
    <li><a href="#"><i className="fab fa-instagram"></i></a></li>
    <li><a href="#"><i className="fab fa-youtube"></i></a></li>
  </ul>
</div>
    <div className="form-panel">
      <h2>Contáctanos</h2>
      <p>Llámamos o escríbenos si tienes preguntas o inconvenientes.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder={"Tu nombre"}
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Asunto"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Mensaje"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit">Enviar mensaje</button>
        <p style={{ color: messageColor }}>{responseMessage}</p>
      </form>
    </div>

    <div className="map-panel">
      <a
  href="https://www.google.com/maps?q=9.928069,-84.047734"
  target="_blank"
  rel="noopener noreferrer"
  className="map-link"
>
  <iframe
    title="Ubicación"
    className="map"
    src="https://www.openstreetmap.org/export/embed.html?bbox=-84.057734%2C9.918069%2C-84.037734%2C9.938069&layer=mapnik&marker=9.928069%2C-84.047734"
  ></iframe>
</a>
         <ul className="contact-info-list">
      <li>
        <i className="fas fa-map-marker-alt"></i>
        123 Calle Principal, San José, Costa Rica
      </li>
      <li>
        <i className="fas fa-phone-alt"></i>
    <a href="tel:+50688889999">+506 8888 9999</a>
      </li>
      <li>
        <i className="fas fa-envelope"></i>
       <a href="mailto:info@moonlightcr.com">auraeventcentercr@gmail.com</a>
      </li>
    </ul>
    </div>
  </div>
</section>

<Footer />

    </div>
  );
};

export default ContactForm;
