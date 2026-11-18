const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.Google_Gen_AI
})

const analyzeResumeWithAI = async (resumeText) => {
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: `Analyze this resume and return the result in JSON format.

        Include:
        1. score: Number between 0 and 100.
        2. skills: Array of technical and professional skills.
        3. experience: Short work experience summary.
        4. strengths: Array of strengths.
        5. weaknesses: Array of weaknesses.
        6. suggestions: Array of improvement suggestions.

        Resume:
        ${resumeText}`,
        config: {
            responseMimeType: "application/json"
        }
    })

    return JSON.parse(response.text)
}

module.exports = analyzeResumeWithAI