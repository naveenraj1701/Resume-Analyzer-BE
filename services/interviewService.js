
const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.Google_Gen_AI
})

const generateInterviewQuestions = async (resumeText, jobDescription, requiredSkills, interviewType) => {
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: `
            Generate personalized interview questions based on the candidate's resume and job description.

            Resume:
            ${resumeText}

            Job Description:
            ${jobDescription}

            Required Skills:
            ${requiredSkills.join(", ")}

            Interview Type:
            ${interviewType}

            Generate 10 relevant interview questions.

            Return JSON with exactly this structure:
            {
                "questions": [
                    {
                        "question": "",
                        "category": "",
                        "sampleAnswer": ""
                    }
                ]
            }

            Rules:
            - Generate questions relevant to the selected interview type.
            - For Technical, focus on technical skills and concepts.
            - For HR, focus on communication, career goals and workplace behavior.
            - For Behavioral, focus on real-world situations and problem-solving.
            - For Mixed, include a combination of all categories.
            - Personalize questions using the candidate's actual resume.
            - Sample answers should be based only on information supported by the resume.
            - Do not invent candidate experience or achievements.
            - Keep questions clear and practical.
            - Return only valid JSON.
        `,
        config: {
            responseMimeType: "application/json"
        }
    })

    return JSON.parse(response.text)
}

module.exports = generateInterviewQuestions
