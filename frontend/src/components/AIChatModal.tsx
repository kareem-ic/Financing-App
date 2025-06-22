import React, { useState, useRef, useEffect } from 'react';

interface AIChatModalProps {
  open: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AIChatModal({ open, onClose }: AIChatModalProps): React.JSX.Element | null {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI financial assistant. How can I help you with your finances today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Try to connect to the backend first
      const response = await fetch('http://localhost:8000/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: inputValue,
          idToken: 'demo-token', // For demo purposes
          history: []
        }),
      });

      if (!response.ok) {
        throw new Error('Backend not available');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      
      // Fallback responses for demo purposes when backend is not available
      const fallbackResponses = [
        "I'd be happy to help you with your finances! For budgeting, I recommend following the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.",
        "Great question! When it comes to saving money as a student, start by tracking your expenses and setting up automatic transfers to a savings account.",
        "That's an important financial consideration. I suggest creating an emergency fund with 3-6 months of expenses before investing in other goals.",
        "For student loans, make sure to understand your repayment options and consider income-driven repayment plans if you're struggling with payments.",
        "Building credit as a young adult is crucial. Start with a secured credit card and always pay your bills on time to establish a good credit history."
      ];
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="ai-modal-overlay" onClick={onClose}>
      <div className="ai-modal" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <button className="ai-modal-close" onClick={onClose}>×</button>
        <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.25rem', fontWeight: '600' }}>
          AI Financial Assistant
        </h3>
        <div className="ai-modal-history">
          {messages.map((message) => (
            <div key={message.id} className={`ai-msg ${message.sender === 'user' ? 'ai-msg-user' : 'ai-msg-assistant'}`}>
              <div>{message.text}</div>
              <small style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                {message.timestamp.toLocaleTimeString()}
              </small>
            </div>
          ))}
          {isLoading && (
            <div className="ai-msg ai-msg-assistant">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="ai-modal-input-row">
          <input
            type="text"
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            placeholder="Ask me about budgeting, saving, or financial planning..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !inputValue.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
} 