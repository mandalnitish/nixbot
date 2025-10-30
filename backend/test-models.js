// backend/test-models.js - Run this to see available models
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyBPn_uh4CAtHJGBJRFb2gldSywegIy6id8');

async function listModels() {
  try {
    console.log('Fetching available models...\n');
    
    // Try different model names
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.0-pro',
      'models/gemini-pro',
      'models/gemini-1.5-flash'
    ];

    for (const modelName of modelsToTry) {
      try {
        console.log(`Testing: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say hi');
        const response = await result.response;
        console.log(`✅ ${modelName} - WORKS!`);
        console.log(`   Response: ${response.text().substring(0, 50)}...\n`);
      } catch (error) {
        console.log(`❌ ${modelName} - ${error.message}\n`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

listModels();