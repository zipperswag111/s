module.exports = async (req, res) => {
    const { apiKey, id } = req.query; // Get ID from URL parameters
    if (!apiKey || !id) return res.status(400).json({ error: 'Missing params' });

    try {
        const fetch = (await import('node-fetch')).default;

        const response = await fetch(`https://api.openai.com/v1/videos/${id}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        const data = await response.json();
        res.status(200).json(data); // Returns status: "in_progress", "completed", etc.

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
