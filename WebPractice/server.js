require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json({limit: '50mb'}));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/analyze', async (req, res) => {
    try {
        const { reviews, productLink, imageData } = req.body;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        const prompt = `
            First, provide an overall 'Falsity Score' as a percentage for the entire batch of reviews. Format it on a single line exactly like this: "Falsity-Score: [number]%". Do not add any other text to this line.
            After that line, provide a structured analysis in both English and Korean. For each category (Image, Reviews, Product Link), provide a separate analysis.
            If a piece of information is not provided, state that it was not provided and that the analysis for that category cannot be completed.

            **1. Image Analysis:**
            ${imageData ? 'Analyze the image provided.' : 'User did not provide an image.'}

            **2. Reviews Analysis:**
            ${reviews ? `Analyze the following reviews and determine if they are likely to be real, AI-generated, or manipulated. For each review, provide a verdict (Real, AI-generated, or Manipulated) and a brief justification. Do not include a percentile rank.

${reviews}` : 'User did not provide any reviews.'}

            **3. Product Link Analysis:**
            ${productLink ? `Analyze the product link and determine if it is a reliable source.

${productLink}` : 'User did not provide a product link.'}

            Provide the entire response in both English and Korean.
        `;

        const imageParts = [];
        if (imageData) {
            const base64ImageData = imageData.split(',')[1];
            imageParts.push({
                inlineData: {
                    data: base64ImageData,
                    mimeType: 'image/jpeg' // Assuming JPEG, you might need to adjust this based on the actual image type
                }
            });
        }

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        let text = await response.text();

        let score = 'N/A';
        const scoreRegex = /Falsity-Score: ([\d.]+%)/;
        const match = text.match(scoreRegex);

        if (match && match[1]) {
            score = match[1];
            text = text.replace(scoreRegex, '').trim();
        }

        res.json({ text, score });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during analysis.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
