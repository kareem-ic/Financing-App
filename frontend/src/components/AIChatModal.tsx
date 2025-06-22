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

interface UserProfile {
  age?: number;
  income?: number;
  expenses?: number;
  savings?: number;
  debt?: number;
  goals?: string[];
  riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
  financialHabits?: string[];
  budgetCategories?: Record<string, number>;
  lastUpdated: Date;
}

export default function AIChatModal({ open, onClose }: AIChatModalProps): React.JSX.Element | null {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI financial assistant. I\'m here to help you with personalized financial advice. To provide the best guidance, I\'d like to learn about your financial situation. What\'s your current financial goal?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('coincise_user_profile');
    return saved ? JSON.parse(saved) : { lastUpdated: new Date() };
  });
  const [showProfileForm, setShowProfileForm] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('coincise_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const extractUserInfo = (message: string): Partial<UserProfile> => {
    const info: Partial<UserProfile> = {};
    
    // Extract age
    const ageMatch = message.match(/(\d+)\s*(?:years?\s*old|yo)/i);
    if (ageMatch) info.age = parseInt(ageMatch[1]);
    
    // Extract income
    const incomeMatch = message.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:per\s*(?:year|month)|annually|monthly|yearly)/i);
    if (incomeMatch) info.income = parseFloat(incomeMatch[1].replace(/,/g, ''));
    
    // Extract expenses
    const expenseMatch = message.match(/expenses?\s*(?:of\s*)?\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
    if (expenseMatch) info.expenses = parseFloat(expenseMatch[1].replace(/,/g, ''));
    
    // Extract savings
    const savingsMatch = message.match(/savings?\s*(?:of\s*)?\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
    if (savingsMatch) info.savings = parseFloat(savingsMatch[1].replace(/,/g, ''));
    
    // Extract debt
    const debtMatch = message.match(/debt\s*(?:of\s*)?\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
    if (debtMatch) info.debt = parseFloat(debtMatch[1].replace(/,/g, ''));
    
    // Extract goals
    const goalKeywords = ['save', 'buy', 'pay off', 'invest', 'emergency fund', 'retirement', 'house', 'car', 'education'];
    const foundGoals = goalKeywords.filter(keyword => message.toLowerCase().includes(keyword));
    if (foundGoals.length > 0) info.goals = foundGoals;
    
    // Extract risk tolerance
    if (message.toLowerCase().includes('conservative')) info.riskTolerance = 'conservative';
    else if (message.toLowerCase().includes('aggressive')) info.riskTolerance = 'aggressive';
    else if (message.toLowerCase().includes('moderate')) info.riskTolerance = 'moderate';
    
    return info;
  };

  const updateUserProfile = (newInfo: Partial<UserProfile>) => {
    setUserProfile(prev => ({
      ...prev,
      ...newInfo,
      lastUpdated: new Date()
    }));
  };

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

    // Extract and update user information from the message
    const extractedInfo = extractUserInfo(inputValue);
    if (Object.keys(extractedInfo).length > 0) {
      updateUserProfile(extractedInfo);
    }

    try {
      // Try to connect to the backend first
      const response = await fetch('http://localhost:8000/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: inputValue,
          idToken: 'demo-token',
          history: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          })),
          userProfile: userProfile
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
      
      // Enhanced fallback responses based on user profile
      let fallbackResponse = "I'd be happy to help you with your finances!";
      
      if (userProfile.age && userProfile.age < 25) {
        fallbackResponse = "As a young adult, focus on building good financial habits early. Start with an emergency fund and consider opening a retirement account.";
      } else if (userProfile.debt && userProfile.debt > 0) {
        fallbackResponse = "I see you have some debt. Prioritize paying off high-interest debt first, then focus on building savings.";
      } else if (userProfile.goals && userProfile.goals.length > 0) {
        fallbackResponse = `Great! I can help you work toward your goals like ${userProfile.goals.join(', ')}. Let's create a plan to achieve them.`;
      } else if (userProfile.income && userProfile.expenses) {
        const savingsRate = ((userProfile.income - userProfile.expenses) / userProfile.income) * 100;
        if (savingsRate < 20) {
          fallbackResponse = "Your savings rate could be improved. Try to save at least 20% of your income for long-term financial security.";
        } else {
          fallbackResponse = "Great job on your savings rate! Consider investing your extra money to grow your wealth over time.";
        }
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newProfile: Partial<UserProfile> = {
      age: formData.get('age') ? parseInt(formData.get('age') as string) : undefined,
      income: formData.get('income') ? parseFloat(formData.get('income') as string) : undefined,
      expenses: formData.get('expenses') ? parseFloat(formData.get('expenses') as string) : undefined,
      savings: formData.get('savings') ? parseFloat(formData.get('savings') as string) : undefined,
      debt: formData.get('debt') ? parseFloat(formData.get('debt') as string) : undefined,
      riskTolerance: formData.get('riskTolerance') as UserProfile['riskTolerance'],
      goals: formData.get('goals') ? (formData.get('goals') as string).split(',').map(g => g.trim()) : undefined
    };
    
    updateUserProfile(newProfile);
    setShowProfileForm(false);
    
    const profileMessage: Message = {
      id: Date.now().toString(),
      text: 'Thank you for updating your profile! I\'ll use this information to provide more personalized financial advice.',
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, profileMessage]);
  };

  if (!open) return null;

  return (
    <div className="ai-modal-overlay" onClick={onClose}>
      <div className="ai-modal" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <button className="ai-modal-close" onClick={onClose}>×</button>
        <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.25rem', fontWeight: '600' }}>
          AI Financial Assistant
        </h3>
        
        {showProfileForm ? (
          <div className="profile-form-container">
            <h4 style={{ marginBottom: '1rem', color: '#374151' }}>Update Your Financial Profile</h4>
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-row">
                <input type="number" name="age" placeholder="Age" defaultValue={userProfile.age} />
                <select name="riskTolerance" defaultValue={userProfile.riskTolerance}>
                  <option value="">Risk Tolerance</option>
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
              <div className="form-row">
                <input type="number" name="income" placeholder="Annual Income" defaultValue={userProfile.income} />
                <input type="number" name="expenses" placeholder="Monthly Expenses" defaultValue={userProfile.expenses} />
              </div>
              <div className="form-row">
                <input type="number" name="savings" placeholder="Current Savings" defaultValue={userProfile.savings} />
                <input type="number" name="debt" placeholder="Total Debt" defaultValue={userProfile.debt} />
              </div>
              <input type="text" name="goals" placeholder="Financial Goals (comma-separated)" defaultValue={userProfile.goals?.join(', ')} />
              <div className="form-buttons">
                <button type="submit" className="save-profile-btn">Save Profile</button>
                <button type="button" onClick={() => setShowProfileForm(false)} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <>
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
            <div className="ai-modal-actions">
              <button 
                onClick={() => setShowProfileForm(true)}
                className="profile-btn"
                title="Update your financial profile for personalized advice"
              >
                📊 Update Profile
              </button>
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
          </>
        )}
      </div>
    </div>
  );
} 