const Resume = require("../models/resumeModel")
const cloudinary = require("../config/cloudinary")
const { Readable } = require("stream")
const { PDFParse } = require("pdf-parse")
const analyzeResumeWithAI = require("../services/geminiService")


//Upload the resume in cloudinary as pdf

const uploadResume = async (req, res) => {
    try {
        const file = req.file

        if (!file) {
            return res.status(400).send({
                message: "Please upload a PDF resume"
            })
        }

        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",
                    folder: "AIResumeAnalyzer/resumes",
                    public_id: `${Date.now()}-${file.originalname.replace(/\.pdf$/i, "")}.pdf`
                },
                (error, result) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(result)
                    }
                }
            )

            Readable.from(file.buffer).pipe(uploadStream)
        })

        const newResume = new Resume({
            userId: req.userId,
            fileName: file.originalname,
            fileUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id
        })

        await newResume.save()

        return res.status(201).send({
            message: "Resume uploaded successfully",
            resume: newResume
        })
    } catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }
}

//Extract the text using pdf parse package


const extractResumeText = async (req, res) => {
    try {
        const { resumeId } = req.params

        const resume = await Resume.findOne({
            _id: resumeId,
            userId: req.userId
        })

        if (!resume) {
            return res.status(404).send({
                message: "Resume not found"
            })
        }

        const response = await fetch(resume.fileUrl)

        if (!response.ok) {
            return res.status(400).send({
                message: "Unable to download PDF from Cloudinary"
            })
        }

        const buffer = Buffer.from(await response.arrayBuffer())

        const parser = new PDFParse({
            data: buffer
        })

        const result = await parser.getText()

        resume.extractedText = result.text

        await resume.save()

        await parser.destroy()

        return res.status(200).send({
            message: "Resume text extracted successfully",
            extractedText: resume.extractedText
        })
    } catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }
}
//connect Gemini AI and analyze resume

const analyzeResume = async (req, res) => {
    try {
        const { resumeId } = req.params

        const resume = await Resume.findOne({
            _id: resumeId,
            userId: req.userId
        })

        if (!resume) {
            return res.status(404).send({
                message: "Resume not found"
            })
        }

        if (!resume.extractedText) {
            return res.status(400).send({
                message: "Please extract resume text first"
            })
        }

        const analysis = await analyzeResumeWithAI(resume.extractedText)

        resume.score = analysis.score
        resume.skills = analysis.skills
        resume.experience = analysis.experience
        resume.feedback = JSON.stringify({
            strengths: analysis.strengths,
            weaknesses: analysis.weaknesses,
            suggestions: analysis.suggestions
        })

        await resume.save()

        res.status(200).send({
            message: "Resume analyzed successfully",
            analysis
        })
    }
    catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const getAllResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({
            userId: req.userId
        }).sort({ createdAt: -1 })

        return res.status(200).send({
            message: "Resumes fetched successfully",
            resumes
        })
    } catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }
}


module.exports = {
    uploadResume,
    extractResumeText,
    analyzeResume,
    getAllResumes
}
