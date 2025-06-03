const protectPublicApi = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(500).json({ error: "Unauthorized, API Key is missing." });
  }
  if (apiKey !== process.env.PUBLIC_API_KEY) {
    return res.status(403).json({ error: "Forbidden. Invalid API Key." });
  }

  // if valid api
  next();
};

module.exports = { protectPublicApi };
