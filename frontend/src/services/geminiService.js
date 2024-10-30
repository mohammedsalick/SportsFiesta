import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

const cleanJsonResponse = (text) => {
    // Remove markdown code blocks and any other non-JSON content
    let cleanText = text.replace(/```json\n?/g, '').replace(/```/g, '');
    
    // Remove any leading/trailing whitespace
    cleanText = cleanText.trim();
    
    // Try to find the JSON object if there's additional text
    const jsonStart = cleanText.indexOf('{');
    const jsonEnd = cleanText.lastIndexOf('}') + 1;
    if (jsonStart >= 0 && jsonEnd > 0) {
        cleanText = cleanText.slice(jsonStart, jsonEnd);
    }
    
    return cleanText;
};

export const generateEventSuggestion = async (userInput) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        const prompt = `Generate a corporate tournament event suggestion based on this mood/request: "${userInput}".
            Respond with ONLY a JSON object in this exact format (no additional text or markdown):
            {
                "title": "Event Title",
                "category": "category",
                "description": "description",
                "maxRegistrations": number
            }
            
            Requirements:
            - category must be exactly one of: "indoor", "outdoor", or "fun"
            - description should be under 500 characters
            - maxRegistrations should be a number between 10 and 100
            - do not include any explanatory text, only the JSON object`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Clean and parse the response
        const cleanedJson = cleanJsonResponse(text);
        const parsed = JSON.parse(cleanedJson);
        
        // Validate the response format
        if (!parsed.title || !parsed.category || !parsed.description || !parsed.maxRegistrations) {
            throw new Error('Invalid response format from AI');
        }
        
        // Ensure category is valid
        if (!['indoor', 'outdoor', 'fun'].includes(parsed.category.toLowerCase())) {
            parsed.category = 'indoor'; // Default to indoor if invalid
        }
        
        return parsed;
    } catch (error) {
        console.error('Error generating event suggestion:', error);
        throw new Error('Failed to generate event suggestion. Please try again.');
    }
};
