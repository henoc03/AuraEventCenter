import { useState } from 'react';
import ChatBot from './ChatBot';
import logo from '../../assets/images/logo-no-background.png';
import '../../style/chatbot.css';


export default function ChatBotWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);

  const openChat = () => {
    setIsOpen(true);
    if (!hasGreeted) {
      setHasGreeted(true);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {!isOpen && (
        <button className="chatbot-button blinking" onClick={openChat}>
          <img src={logo} alt="Chatbot" className="chatbot-icon" />
        </button>
      )}

      {isOpen && (
        <div className="chatbot-popup">
          <ChatBot onClose={closeChat} />
        </div>
      )}
    </div>
  );
}
