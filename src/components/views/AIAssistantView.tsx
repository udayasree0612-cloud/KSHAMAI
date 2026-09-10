import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Bot, Send, User, Sparkles, HelpCircle, ArrowRight, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIAssistantView: React.FC = () => {
  const { userProfile, competencies, calculateGap, materials } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Namaste ${userProfile.name}. I am your KshamAI Competency Intelligence Advisor for Official Statistics. I have access to your profile as a ${userProfile.designation} in ${userProfile.department}. Your top measured competency deficits are currently in **Python for Statistical Analysis** (-33%) and **Data Quality Assurance** (-32%). How can I assist your learning path today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    'Why is my Python for Data Analysis gap at 33%?',
    'Explain the difference between Level A and Level B Data Quality checks.',
    'How do I calculate GVA at Basic Prices according to SNA 2008?',
    'What iGOT course should I prioritize this week?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build context of learner and gaps
      const gaps = competencies
        .map((c) => ({
          name: c.name,
          current: c.currentScore,
          target: c.targetScore,
          gap: calculateGap(c.targetScore, c.currentScore),
        }))
        .filter((g) => g.gap > 0);

      const response = await fetch('/api/chat/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          userProfile,
          gaps,
          learnerContext: {
            name: userProfile.name,
            designation: userProfile.designation,
            department: userProfile.department,
            topGaps: gaps,
          },
          uploadedMaterials: materials,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reach assistant server endpoint');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Here is your official statistics guidance.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('Chat assistant fallback activated:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `Based on your role as ${userProfile.designation}, your priority focus should be completing the iGOT "Python for Official Statistics: Vectorized Data Wrangling" and "MoSPI Survey Data Quality: Multi-Tier Audits" modules. Re-taking the diagnostic assessment once finished will increase your competency scores deterministically.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI-POWERED OFFICIAL STATISTICS ADVISOR</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">KshamAI Conversational Intelligence</h1>
          <p className="text-xs text-slate-500 mt-1">
            Ask pedagogical questions, explore diagnostic reasons, or request personalized study schedules.
          </p>
        </div>

        <div className="hidden sm:flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-700">Gemini Grounded Engine</span>
        </div>
      </div>

      {/* Chat Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[560px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => {
            const isBot = m.sender === 'assistant';

            return (
              <div
                key={m.id}
                className={`flex items-start space-x-3 ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isBot
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : 'AR'}
                </div>

                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                    isBot
                      ? 'bg-slate-50 border border-slate-200 text-slate-800'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <span
                    className={`block text-[10px] mt-2 font-mono ${
                      isBot ? 'text-slate-400' : 'text-blue-200'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>KshamAI is formulating official statistics advice...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto text-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Prompts:</span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg whitespace-nowrap text-[11px] font-medium transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3.5 bg-white border-t border-slate-200 flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Type your official statistics or competency question..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors disabled:opacity-40"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
