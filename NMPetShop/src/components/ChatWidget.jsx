import { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';

const MAX_CHARS = 500;

const formatTime = (date) => {
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Xin chào! Chúng tôi có thể giúp gì cho bạn?', sender: 'store', time: new Date() }
  ]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || message.length > MAX_CHARS) return;

    const newMsg = { id: Date.now(), text: message.trim(), sender: 'user', time: new Date() };
    setMessages(prev => [...prev, newMsg]);
    setMessage('');

    // Mock reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, text: 'Cảm ơn bạn đã liên hệ! Nhân viên hỗ trợ sẽ phản hồi trong thời gian sớm nhất có thể.', sender: 'store', time: new Date() }
      ]);
    }, 1000);
  };

  const charsLeft = MAX_CHARS - message.length;
  const isOverLimit = message.length > MAX_CHARS;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden" style={{ animation: 'slideUp 0.25s ease-out' }}>
          {/* Header */}
          <div className="bg-secondary text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-semibold">Hỗ trợ khách hàng</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <FiX size={20}/>
            </button>
          </div>

          {/* Messages */}
          <div className="h-72 p-4 bg-bg-gray overflow-y-auto flex flex-col gap-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col gap-0.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white rounded-tr-sm'
                    : 'bg-white text-text-dark border border-border rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-text-light px-1">{formatTime(msg.time)}</span>
              </div>
            ))}
            <div ref={messagesEndRef}/>
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-border">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Nhập tin nhắn... (tối đa ${MAX_CHARS} ký tự)`}
                  maxLength={MAX_CHARS + 10}
                  className={`w-full bg-bg-gray border focus:bg-white px-3 py-2 rounded-xl text-sm outline-none transition-colors ${isOverLimit ? 'border-red-400' : 'border-transparent focus:border-primary'}`}
                />
              </div>
              <button
                type="submit"
                disabled={!message.trim() || isOverLimit}
                className="w-10 h-10 bg-secondary hover:bg-secondary-light disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
              >
                <FiSend size={16} className="-ml-0.5"/>
              </button>
            </div>
            <div className={`text-right text-[11px] mt-1 px-1 ${isOverLimit ? 'text-red-500 font-medium' : 'text-text-light'}`}>
              {isOverLimit ? `Vượt quá ${-charsLeft} ký tự` : `${charsLeft} ký tự còn lại`}
            </div>
          </form>

          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(16px) scale(0.97); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-secondary hover:bg-secondary-light text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
        >
          <FiMessageSquare size={22}/>
          <span className="font-semibold">Liên hệ</span>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
