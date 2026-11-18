const axios = require("axios")
const cheerio = require("cheerio")

const extractJobPage = async (url) => {
    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36"
            },
            timeout: 15000
        })

        const $ = cheerio.load(response.data)

        $("script, style, noscript, iframe, svg, nav, header, footer").remove()

        const pageTitle = $("title").text().trim()
        const pageText = $("body").text().replace(/\s+/g, " ").trim()

        if (!pageText || pageText.length < 100)
            throw new Error("Unable to extract sufficient content from this webpage")

        return {
            pageTitle,
            pageText: pageText.slice(0, 20000)
        }
    }catch (error) {
        throw new Error(error.message || "Failed to extract job webpage")
    }

}

module.exports = extractJobPage