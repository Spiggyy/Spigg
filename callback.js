// api/callback.js

const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { code, state } = req.query;
  const { MAL_CLIENT_ID, MAL_CLIENT_SECRET, MAL_REDIRECT_URI } = process.env;

  if (!code || !state) {
    return res.status(400).send('Authorization failed.');
  }

  const tokenUrl = 'https://myanimelist.net/v1/oauth2/token';
  const data = new URLSearchParams({
    client_id: MAL_CLIENT_ID,
    client_secret: MAL_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: MAL_REDIRECT_URI,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: data,
  });

  const responseData = await response.json();
  const accessToken = responseData.access_token;

  if (accessToken) {
    // Store the access token with the user's ID (this example is simplified)
    // In a real application, you would store this in a database
    // Here, we're just using a placeholder dictionary

    global.userTokens = global.userTokens || {};
    global.userTokens[state] = accessToken;

    return res.status(200).send('Authorization successful! You can close this window.');
  } else {
    return res.status(500).send('Failed to obtain access token.');
  }
};￼Enter
