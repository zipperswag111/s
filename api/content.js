module.exports = async (req, res) => {
    const { apiKey, id } = req.query;
    if (!apiKey || !id) return res.status(400).json({ error: 'Missing params' });

    try {
        const fetch = (await import('node-fetch')).default;

        // Fetch the binary content
        const response = await fetch(`https://api.openai.com/v1/videos/${id}/content`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        if (!response.ok) throw new Error("Failed to fetch video content");

        // Stream the video directly to the browser
        res.setHeader('Content-Type', 'video/mp4');
        response.body.pipe(res);

    } catch (error) {
        res.status(500).send("Error fetching video");
    }
};
