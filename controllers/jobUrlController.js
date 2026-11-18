const extractJobPage = require("../services/ExtractFromUrl/jobUrlService")
const extractJobDetails = require("../services/ExtractFromUrl/jobDetailsAIService")

const extractJobFromURL = async (req, res) => {
    try {
        const { url } = req.body

        if (!url) {
            return res.send({
                success: false,
                message: "Job URL is required"
            })
        }

        let parsedURL

        try {
            parsedURL = new URL(url)
        } catch {
            return res.send({
                success: false,
                message: "Invalid URL"
            })
        }

        if (!["http:", "https:"].includes(parsedURL.protocol)) {
            return res.send({
                success: false,
                message: "Only HTTP and HTTPS URLs are allowed"
            })
        }

        if (
            parsedURL.hostname === "localhost" ||
            parsedURL.hostname.endsWith(".localhost") ||
            parsedURL.hostname.endsWith(".local")
        ) {
            return res.send({
                success: false,
                message: "Invalid job webpage URL"
            })
        }

        const { pageTitle, pageText } = await extractJobPage(url)

        const jobDetails = await extractJobDetails(
            pageTitle,
            pageText,
            url
        )

        res.send({
            success: true,
            message: "Job details extracted successfully",
            jobDetails
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message || "Failed to extract job details"
        })
    }
}

module.exports = { extractJobFromURL }