import { useState } from 'react';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Xin chào! Chúng tôi có thể giúp gì cho bạn?', sender: 'store' }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setMessages([
      ...messages,
      { id: Date.now(), text: message, sender: 'user' }
    ]);
    setMessage('');
    
    // Mock reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, text: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!', sender: 'store' }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-secondary text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-semibold">Hỗ trợ khách hàng</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 p-4 bg-bg-gray overflow-y-auto flex flex-col gap-3">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-white self-end rounded-tr-sm' 
                    : 'bg-white text-text-dark border border-border self-start rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-border flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-bg-gray border border-transparent focus:border-primary focus:bg-white px-3 py-2 rounded-xl text-sm outline-none transition-colors"
            />
            <button 
              type="submit"
              disabled={!message.trim()}
              className="w-10 h-10 bg-secondary hover:bg-secondary-light disabled:opacity-50 disabled:hover:bg-secondary text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
            >
              <FiSend size={16} className="-ml-0.5" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-secondary hover:bg-secondary-light text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
        >
          <FiMessageSquare size={22} />
          <span className="font-semibold">Liên hệ</span>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
