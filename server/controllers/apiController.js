const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

async function getTestData(req, res) {
    try {
        res.json({'message': 'Hello World'});
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}

async function getPocketData(req, res) {
  try {
    const response = await axios.get('https://getpocket.com/v3/get', {
      params: {
        consumer_key: process.env.POCKET_CONSUMER_KEY,
        access_token: process.env.POCKET_ACCESS_TOKEN,
        count: 10,
        detailType: 'complete',
      },
    });
    res.json(response.data.list);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
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
};