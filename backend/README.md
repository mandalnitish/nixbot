// README.md - Setup Instructions

# NixBot - Personal AI Chatbot

A modern, full-stack AI chatbot with a beautiful UI and robust backend.

## Features

- 🤖 AI-powered conversations
- 💬 Real-time chat interface
- 🎨 Modern, responsive design
- 🔒 Rate limiting and security
- 📱 Mobile-friendly
- 🌙 Dark mode UI

## Backend Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create .env file:
```bash
cp .env.example .env
```

3. Configure your environment variables in .env

4. Start the development server:
```bash
npm run dev
```

The server will run on http://localhost:3001

### API Endpoints

#### Health Check
```
GET /api/health
```

#### Create Conversation
```
POST /api/conversations
Body: { "userId": "optional_user_id" }
```

#### Send Message
```
POST /api/conversations/:id/messages
Body: { "message": "Your message", "userId": "optional" }
```

#### Get Conversation
```
GET /api/conversations/:id
```

#### Delete Conversation
```
DELETE /api/conversations/:id
```

#### Get User Conversations
```
GET /api/users/:userId/conversations
```

## Frontend Setup

The frontend is built with React and Tailwind CSS.

### Installation

1. Create React app or use the provided component
2. Install dependencies:
```bash
npm install lucide-react
```

3. Update API endpoint in the component to match your backend URL

## Integrating Real AI

To connect with actual AI services, update the `generateAIResponse` function in `server.js`:

### OpenAI Example:
```javascript
const { Configuration, OpenAIApi } = require('openai');

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

const generateAIResponse = async (message, history) => {
  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: message }
    ],
  });
  return response.data.choices[0].message.content;
};
```

### Anthropic Claude Example:
```javascript
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const generateAIResponse = async (message, history) => {
  const response = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 1024,
    messages: [
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: message }
    ],
  });
  return response.content[0].text;
};
```

## Production Deployment

### Backend
- Use a process manager like PM2
- Set up a reverse proxy (nginx)
- Use a proper database (PostgreSQL, MongoDB)
- Implement proper authentication
- Add logging and monitoring

### Frontend
- Build for production: `npm run build`
- Deploy to Vercel, Netlify, or your hosting service
- Update environment variables

## Security Considerations

- Never commit .env file
- Use HTTPS in production
- Implement proper authentication
- Add input validation
- Set up CORS properly
- Use rate limiting
- Sanitize user inputs

## License

MIT License - feel free to use for personal or commercial projects!