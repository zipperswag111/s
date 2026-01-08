module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { apiKey, prompt, size } = req.body;
    if (!apiKey) return res.status(400).json({ error: 'API Key is missing' });

    try {
        const fetch = (await import('node-fetch')).default;

        // Official Sora Endpoint
        const response = await fetch('https://api.openai.com/v1/videos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "sora-2", // Using the real model name
                prompt: prompt,
                size: size || "1280x720", // Standard Sora resolution
                seconds: 8 // Default duration
            })
        });

        const data = await response.json();

        if (data.error) throw new Error(data.error.message);

        // Return the Job ID immediately (don't wait for video)
        res.status(200).json({ id: data.id, status: data.status });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
