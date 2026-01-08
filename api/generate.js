module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { apiKey, prompt } = req.body;

    if (!apiKey) {
        return res.status(400).json({ error: 'API Key is missing' });
    }

    try {
        const fetch = (await import('node-fetch')).default;

        // This connects to OpenAI (using DALL-E 3 as the placeholder for now)
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: prompt,
                size: "1024x1024",
                quality: "standard",
                n: 1
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        // Return the result
        res.status(200).json({ url: data.data[0].url });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
