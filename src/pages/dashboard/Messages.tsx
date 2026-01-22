import { useEffect, useState } from 'react';
import { api, Message, User } from '@/services/api';
import { MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      const currentUser = api.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        const data = await api.getMessages(currentUser.id);
        setMessages(data);
      }
      setIsLoading(false);
    };

    loadMessages();
  }, []);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // In a real app, this would send to the API
    setNewMessage('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-soft text-muted-foreground">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground">Chat with your veterinarian</p>
      </div>

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        {/* Messages area */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No messages yet</h3>
              <p className="text-muted-foreground">Start a conversation with your vet</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.senderId === user?.id ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-xs md:max-w-md rounded-2xl px-4 py-3",
                    message.senderId === user?.id
                      ? "gradient-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  )}
                >
                  <p className="text-sm font-medium mb-1">{message.senderName}</p>
                  <p>{message.content}</p>
                  <p className={cn(
                    "text-xs mt-1",
                    message.senderId === user?.id ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
