module.exports = async (req, res) => {
    const { apiKey, id } = req.query;
    if (!apiKey || !id) return res.status(400).json({ error: 'Missing params' });

    try {
        const response = await fetch(`https://api.openai.com/v1/videos/${id}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
