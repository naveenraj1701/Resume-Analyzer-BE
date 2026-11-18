const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.Google_Gen_AI
})

const extractJobDetails = async (pageTitle, pageText, url) => {
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: `
            Extract job details from the following webpage.

            URL: ${url}

            Page Title:
            ${pageTitle}

            Webpage Content:
            ${pageText}

            Return the following information in JSON format:

            {
                "jobTitle": "",
                "companyName": "",
                "jobDescription": "",
                "requiredSkills": [],
                "responsibilities": [],
                "qualifications": "",
                "experienceLevel": "",
                "location": "",
                "jobType": ""
            }

            Rules:
            - Extract only information supported by the webpage.
            - Do not invent missing details.
            - If information is unavailable, return an empty string or empty array.
            - requiredSkills must be an array of strings.
            - responsibilities must be an array of strings.
            - jobDescription should contain a detailed summary of the job.
            - experienceLevel can be Fresher, Entry Level, Junior, Mid Level, Senior, or another appropriate level.
            - jobType can be Full-time, Part-time, Internship, Contract, or another appropriate type.
            - Return only valid JSON.
        `,
        config: {
            responseMimeType: "application/json"
        }
    })

    return JSON.parse(response.text)
}

module.exports = extractJobDetails