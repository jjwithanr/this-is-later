const dotenv = require('dotenv');
const axios = require('axios');
const { handleAuthorizationCallback } = require('./pocketController');

dotenv.config();

const consumerKey = process.env.POCKET_CONSUMER_KEY;
const redirectUri = "http:localhost:3001/api/callback/";

async function getTestData(req, res) {
    try {
        res.json({'message': 'Hello Earth!'});
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}

async function getPocketData(req, res) {
  const url = `https://getpocket.com/v3/oauth/request?consumer_key=${consumerKey}&redirect_uri=${redirectUri}`;
  axios.post(url)
    .then(response => {
      requestToken = response.data.split('=')[1];
      console.log(`Request token: ${requestToken}`);
      const redirectUrl = `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${redirectUri}`;
      res.redirect(redirectUrl);
    })
    .catch(error => {
      console.error(error);
      res.send('An error occurred while obtaining a request token');
    });
}

async function getYouTubeData(req, res) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        channelId: process.env.YOUTUBE_CHANNEL_ID,
        part: 'snippet',
        maxResults: 10,
      },
    });
    const items = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
    }));
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
}

module.exports = {
  getTestData,
  getPocketData,
  getYouTubeData,
  handleAuthorizationCallback,
};