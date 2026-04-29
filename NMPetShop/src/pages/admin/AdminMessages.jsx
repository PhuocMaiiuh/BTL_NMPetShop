import { useState } from 'react';
import { FiSearch, FiSend, FiMoreVertical, FiMessageSquare } from 'react-icons/fi';

const mockConversations = [
  {
    id: 1,
    customerName: 'Nguyễn Văn A',
    customerCode: 'KH26001',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    lastMessage: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ...',
    time: '10:30 AM',
    unread: 0,
    online: true,
    messages: [
      { id: 1, text: 'Xin chào! Chúng tôi có thể giúp gì cho bạn?', sender: 'admin', time: '10:28 AM' },
      { id: 2, text: 'Shop cho mình hỏi về Hạt Khô Cao Cấp Royal Canin ạ?', sender: 'customer', time: '10:29 AM' },
      { id: 3, text: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!', sender: 'admin', time: '10:30 AM' }
    ]
  },
  {
    id: 2,
    customerName: 'Trần Thị B',
    customerCode: 'KH26002',
    avatar: '',
    lastMessage: 'Đơn hàng của mình khi nào giao vậy shop?',
    time: '09:15 AM',
    unread: 2,
    online: false,
    messages: [
      { id: 1, text: 'Đơn hàng của mình khi nào giao vậy shop?', sender: 'customer', time: '09:15 AM' }
    ]
  },
  {
    id: 3,
    customerName: 'Lê Văn C',
    customerCode: 'KH26003',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    lastMessage: 'Tuyệt vời, cảm ơn shop!',
    time: 'Hôm qua',
    unread: 0,
    online: true,
    messages: [
      { id: 1, text: 'Mình đã nhận được hàng rồi nha.', sender: 'customer', time: 'Hôm qua 15:00' },
      { id: 2, text: 'Dạ shop cảm ơn bạn đã ủng hộ ạ!', sender: 'admin', time: 'Hôm qua 15:15' },
      { id: 3, text: 'Tuyệt vời, cảm ơn shop!', sender: 'customer', time: 'Hôm qua 15:20' }
    ]
  }
];

const AdminMessages = () => {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeChatId, setActiveChatId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const activeChat = conversations.find(c => c.id === activeChatId);

  const filteredConversations = conversations.filter(c => 
    c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.customerCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const newMsg = {
      id: Date.now(),
      text: newMessage,
      sender: 'admin',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(conversations.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          lastMessage: newMsg.text,
          time: newMsg.time,
          messages: [...chat.messages, newMsg]
        };
      }
      return chat;
    }));

    setNewMessage('');
  };

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    // Mark as read
    setConversations(conversations.map(chat => 
      chat.id === id ? { ...chat, unread: 0 } : chat
    ));
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Container inside admin layout padding */}
      <div className="flex-1 flex bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        
        {/* Sidebar / Conversation List */}
        <div className="w-80 border-r border-border flex flex-col bg-white shrink-0">
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-bold text-text-dark mb-4">Tin nhắn</h2>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Tìm kiếm khách hàng..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-bg-gray border border-transparent focus:bg-white focus:border-primary rounded-lg text-sm outline-none transition-colors"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map(chat => (
              <button 
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`w-full text-left p-4 border-b border-border flex items-start gap-3 transition-colors ${activeChatId === chat.id ? 'bg-primary/5' : 'hover:bg-bg-gray/50'}`}
              >
                <div className="relative shrink-0">
                  {chat.avatar ? (
                    <img src={chat.avatar} alt={chat.customerName} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                      {chat.customerName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className={`text-sm truncate ${chat.unread > 0 ? 'font-bold text-text-dark' : 'font-semibold text-text-dark'}`}>
                      {chat.customerName}
                    </h4>
                    <span className="text-xs text-text-light whitespace-nowrap">{chat.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-xs truncate mr-2 ${chat.unread > 0 ? 'font-medium text-text-dark' : 'text-text-gray'}`}>
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <span className="w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {activeChat ? (
          <div className="flex-1 flex flex-col bg-bg-light relative">
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-border flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-3">
                {activeChat.avatar ? (
                  <img src={activeChat.avatar} alt={activeChat.customerName} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {activeChat.customerName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-text-dark">{activeChat.customerName}</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-text-gray">{activeChat.customerCode}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className={activeChat.online ? 'text-success font-medium' : 'text-text-gray'}>
                      {activeChat.online ? 'Đang hoạt động' : 'Ngoại tuyến'}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-text-gray hover:text-text-dark hover:bg-bg-gray rounded-full transition-colors">
                <FiMoreVertical size={20} />
              </button>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeChat.messages.map((msg, index) => {
                const isAdmin = msg.sender === 'admin';
                return (
                  <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                    <div 
                      className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                        isAdmin 
                          ? 'bg-primary text-white rounded-tr-sm shadow-sm' 
                          : 'bg-white text-text-dark border border-border rounded-tl-sm shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-text-light mt-1 mx-1">{msg.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-border mt-auto">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder={`Trả lời ${activeChat.customerName}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-bg-gray border border-transparent focus:bg-white focus:border-primary rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-11 h-11 bg-primary hover:bg-primary-light disabled:opacity-50 disabled:hover:bg-primary text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
                >
                  <FiSend size={18} className="-ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-bg-light text-text-gray">
            <FiMessageSquare size={48} className="mb-4 opacity-20" />
            <p>Chọn một cuộc trò chuyện để xem nội dung</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
