/**
 * AI Provider Configuration for NixBot
 * ------------------------------------
 * Supports multiple AI providers (Google, Hugging Face, OpenAI, etc.)
 * 
 * For Google Gemini → Make sure:
 *  1. npm install @google/generative-ai@latest
 *  2. .env file includes:
 *        GOOGLE_API_KEY=your_google_api_key
 *        GOOGLE_MODEL=gemini-1.5-flash-latest
 *  3. The model name matches the version supported by your API key.
 */

const aiConfig = {
  provider: process.env.AI_PROVIDER || 'google', // Options: google | huggingface | openai

  google: {
    apiKey: process.env.GOOGLE_API_KEY,
    // ✅ Updated model name to latest Gemini model
    model: process.env.GOOGLE_MODEL || 'gemini-1.5-flash-latest',
  },

  huggingface: {
    apiKey: process.env.HF_API_KEY,
    model: process.env.HF_MODEL || 'mistralai/Mixtral-8x7B-Instruct-v0.1',
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  },
};

module.exports = aiConfig;
