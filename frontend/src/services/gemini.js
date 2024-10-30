import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const generateEventSuggestion = async (prompt) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response to extract structured event data
    // You might want to add more sophisticated parsing logic here
    const suggestion = {
        title: "", // Extract from response
        category: "", // Extract from response
        description: "", // Extract from response
        maxRegistrations: 0 // Extract from response
    };
    
    return {
        rawResponse: text,
        suggestion
    };
};
