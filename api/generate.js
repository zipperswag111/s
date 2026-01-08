module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { apiKey, prompt, size } = req.body;

    if (!apiKey) {
        return res.status(400).json({ error: 'API Key is missing' });
    }

    try {
        const fetch = (await import('node-fetch')).default;

        // 1. Target the VIDEO endpoint (not images)
        const response = await fetch('https://api.openai.com/v1/videos/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                // 2. Use the Sora model
                model: "sora-1.0-turbo", 
                prompt: prompt,
                // Map the simple size to Sora's expected format if needed, 
                // or default to 1920x1080
                size: size || "1920x1080",
                quality: "standard"
            })
        });

        const data = await response.json();

        // 3. Catch OpenAI errors (like "Model not found")
        if (data.error) {
            throw new Error(data.error.message);
        }

        // 4. Return the video URL
        // Note: Real Sora requests might be async (returning an ID first), 
        // but this handles the direct URL case.
        res.status(200).json({ url: data.data[0].url });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
