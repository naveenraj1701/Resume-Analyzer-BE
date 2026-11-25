const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.Google_Gen_AI
})

const generateInterviewQuestions = async (jobTitle, selectedSkills, interviewType) => {
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: `
            Generate interview questions for a candidate preparing for a job interview.

            Job Title:
            ${jobTitle}

            Selected Skills:
            ${selectedSkills.join(", ")}

            Interview Type:
            ${interviewType}

            Generate 10 relevant interview questions based ONLY on the selected skills.

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
            - Questions must focus only on the selected skills.
            - For Technical, focus on technical concepts, coding, implementation, and problem-solving related to the selected skills.
            - For HR, focus on career goals, communication, workplace behavior, and motivation.
            - For Behavioral, focus on real-world situations, teamwork, decision-making, and problem-solving.
            - For Mixed, include a combination of technical, HR, and behavioral questions relevant to the job and selected skills.
            - Do not ask questions about skills that were not selected.
            - Generate a mixture of beginner, intermediate, and advanced questions.
            - Sample answers should be accurate, clear, and helpful for learning.
            - Keep questions practical and interview-oriented.
            - Avoid repeating similar questions.
            - Return only valid JSON.
        `,
        config: {
            responseMimeType: "application/json"
        }
    })

    return JSON.parse(response.text)
}

const evaluateInterviewAnswer = async (question, userAnswer, sampleAnswer, category) => {
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: `
            Evaluate the candidate's interview answer.

            Question:
            ${question}

            Category:
            ${category}

            Sample Answer:
            ${sampleAnswer}

            Candidate Answer:
            ${userAnswer}

            Evaluate based on:
            - Relevance to the question
            - Accuracy of the information
            - Clarity and communication
            - Completeness of the answer

            Return JSON with exactly this structure:
            {
                "score": 0,
                "feedback": "",
                "suggestions": []
            }

            Rules:
            - Score must be between 0 and 100.
            - Give honest and constructive feedback.
            - Do not require the candidate to use the exact sample answer.
            - Accept alternative correct explanations.
            - Do not reward irrelevant or fabricated claims.
            - If the answer is empty, give a score of 0.
            - Suggestions must contain specific improvements.
            - Return only valid JSON.
        `,
        config: {
            responseMimeType: "application/json"
        }
    })

    return JSON.parse(response.text)
}

module.exports = {
    generateInterviewQuestions,
    evaluateInterviewAnswer
}