import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';

export default function AIChatModal({ open, onClose }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;
    const idToken = user && (await user.getIdToken());

    const newHistory = [...history, { role: 'user', content: input }];
    setHistory(newHistory);

    const res = await fetch('http://localhost:8000/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: input,
        idToken,
        history: newHistory,
      }),
    });
    const data = await res.json();
    setHistory([...newHistory, { role: 'assistant', content: data.reply }]);
    setInput('');
    setLoading(false);
  };

  if (!open) return null;
  return (
    <div className="ai-modal-overlay">
      <div className="ai-modal">
        <button className="ai-modal-close" onClick={onClose}>×</button>
        <div className="ai-modal-history">
          {history.map((msg, i) => (
            <div key={i} className={`ai-msg ai-msg-${msg.role}`}>
              {msg.content}
            </div>
          ))}
        </div>
        <div className="ai-modal-input-row">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask AI about your finances..."
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()}>
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
} 