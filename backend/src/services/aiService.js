// backend/src/services/aiService.js - With Groq Support
const Groq = require('groq-sdk');

class AIService {
  constructor() {
    const provider = process.env.AI_PROVIDER;
    const groqKey = process.env.GROQ_API_KEY;
    
    console.log('🤖 AI Service Initialized');
    console.log('Provider:', provider);
    
    if (provider === 'groq' && groqKey) {
      this.groq = new Groq({ apiKey: groqKey });
      console.log('✅ Groq configured');
    } else {
      console.log('⚠️  Using mock responses');
    }
  }

  async generateResponse(userMessage, conversationHistory) {
    const provider = process.env.AI_PROVIDER;
    
    console.log('📨 Generating response...');
    console.log('Provider:', provider);
    console.log('Message:', userMessage);

    if (provider === 'groq' && this.groq) {
      return await this.groqResponse(userMessage, conversationHistory);
    }
    
    console.log('⚠️  Using mock response');
    return await this.mockResponse(userMessage);
  }

  async groqResponse(userMessage, history) {
    try {
      console.log('🔄 Calling Groq API...');
      
      const messages = [
        {
          role: 'system',
          content: 'You are NixBot, a helpful, friendly, and knowledgeable AI assistant. Provide clear, concise, and helpful responses.'
        },
        ...history.slice(-10).map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        })),
        {
          role: 'user',
          content: userMessage
        }
      ];

      const completion = await this.groq.chat.completions.create({
        messages: messages,
        model: 'llama-3.3-70b-versatile', // Latest Llama model
        temperature: 0.7,
        max_tokens: 1024,
      });

      const responseText = completion.choices[0].message.content;

      console.log('✅ Groq response received');
      console.log('Response preview:', responseText.substring(0, 100) + '...');

      return {
        content: responseText,
        model: 'llama-3.3-70b',
        tokens: completion.usage.total_tokens,
      };
    } catch (error) {
      console.error('❌ Groq API Error:', error.message);
      console.error('Full error:', error);
      return await this.mockResponse(userMessage);
    }
  }

  async mockResponse(userMessage) {
    console.log('🎭 Using mock response');
    await new Promise(resolve => setTimeout(resolve, 1000));

    const responses = {
      greeting: "Hello! It's great to chat with you. How can I assist you today?",
      help: "I can help you with various tasks like answering questions, providing information, brainstorming ideas, or just having a conversation. What would you like to explore?",
      code: "I'd be happy to help with coding! What programming language or concept would you like assistance with?",
      thanks: "You're very welcome! Feel free to ask if you need anything else.",
      weather: "I'm a text-based AI and don't have access to real-time weather data, but I'd be happy to help with other questions!",
      about: "I'm NixBot, your personal AI assistant. I can help answer questions, provide information, assist with coding, brainstorm ideas, and have conversations on various topics!",
      default: "That's interesting! I'm here to help. Could you tell me more about what you'd like to know or discuss?"
    };

    const lowerMsg = userMessage.toLowerCase();
    let content = responses.default;

    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      content = responses.greeting;
    } else if (lowerMsg.includes('help')) {
      content = responses.help;
    } else if (lowerMsg.includes('code') || lowerMsg.includes('program')) {
      content = responses.code;
    } else if (lowerMsg.includes('thank')) {
      content = responses.thanks;
    } else if (lowerMsg.includes('weather')) {
      content = responses.weather;
    } else if (lowerMsg.includes('who are you') || lowerMsg.includes('what are you') || lowerMsg.includes('about you')) {
      content = responses.about;
    }

    return {
      content,
      model: 'mock-model',
      tokens: 0,
    };
  }
}

module.exports = new AIService();