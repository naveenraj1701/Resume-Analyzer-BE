const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.Google_Gen_AI
})

const matchResumeWithJob = async (resumeText, jobDescription, requiredSkills) => {
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: `
            Compare the candidate's resume with the job description
            and provide a detailed job match analysis.

            Resume:
            ${resumeText}

            Job Description:
            ${jobDescription}

            Required Skills:
            ${requiredSkills.join(", ")}

            Analyze the candidate based on the following categories:
            1. Technical skills compatibility
            2. Experience compatibility
            3. Education compatibility
            4. Relevant keywords

            Return JSON with exactly these fields:
            {
                "matchScore": 0,
                "scoreBreakdown": {
                    "skills": 0,
                    "experience": 0,
                    "education": 0,
                    "keywords": 0
                },
                "matchedSkills": [],
                "missingSkills": [],
                "experienceMatch": "",
                "strengths": [],
                "explanation": "",
                "suggestions": []
            }

            Rules:
            - All scores must be between 0 and 100.
            - matchScore must represent the overall suitability of the candidate.
            - scoreBreakdown must contain individual category scores.
            - Identify skills genuinely supported by the resume.
            - Missing skills must be skills required by the job but not found in the resume.
            - experienceMatch must explain how the candidate's experience compares with the job requirements.
            - strengths must contain specific advantages of the candidate.
            - explanation must provide a clear summary of the overall match.
            - suggestions must provide actionable ways to improve the candidate's resume or qualifications.
            - Do not invent experience, skills, qualifications or achievements.
            - Avoid generic suggestions.
            - Return only valid JSON.
        `,
        config: {
            responseMimeType: "application/json"
        }
    })

    return JSON.parse(response.text)
}

module.exports = matchResumeWithJob