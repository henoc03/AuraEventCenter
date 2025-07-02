import { useEffect, useRef, useState } from 'react';
import '../../style/chatbot.css';

export default function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const hasGreetedRef = useRef(false);
  const messagesEndRef = useRef(null);

  const contextRef = useRef({});

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (msg = input) => {
    if (!msg.trim()) return;

    setIsTyping(true);

    // Mostramos el mensaje del usuario
    const userMessage = { from: 'user', text: msg };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch('http://localhost:1522/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          context: contextRef.current,
        }),
      });

      const data = await res.json();

      // Mostramos la respuesta del bot
      const botMessage = { from: 'bot', text: data.response };
      setMessages((prev) => [...prev, botMessage]);

      contextRef.current = data.context || {};

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'Ocurrió un error al enviar el mensaje.' },
      ]);
      contextRef.current = {};
    }

    setInput('');
    setIsTyping(false);
  };

  useEffect(() => {
    if (!hasGreetedRef.current) {
      hasGreetedRef.current = true;
      sendMessage('Hola');
    }
  }, []);

  return (
    <div className="chatbot-container">
      <button className="chatbot-close" onClick={onClose}>
        ✖
      </button>

      <div className="chatbot-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chatbot-msg ${msg.from}`}>
            {msg.text.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        ))}
        {isTyping && (
          <div className="chatbot-msg bot typing-indicator">Escribiendo...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-replies">
        {['Zonas', 'Servicios', 'Equipos'].map((txt) => (
          <button
            className="replies-btns"
            key={txt}
            onClick={() => sendMessage(txt)}
          >
            {txt}
          </button>
        ))}
      </div>

      <div className="chatbot-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe algo..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={() => sendMessage()}>Enviar</button>
      </div>
    </div>
  );
}
