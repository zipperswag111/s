module.exports = async (req, res) => {
    const { apiKey, id } = req.query;
    if (!apiKey || !id) return res.status(400).json({ error: 'Missing params' });

    try {
        const response = await fetch(`https://api.openai.com/v1/videos/${id}/content`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        if (!response.ok) throw new Error("Failed to fetch video content");

        // Convert the video to a buffer and send it
        const videoBuffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'video/mp4');
        res.send(Buffer.from(videoBuffer));

    } catch (error) {
        res.status(500).send("Error fetching video");
    }
};
