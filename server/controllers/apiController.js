const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

let requestToken;
const consumerKey = process.env.POCKET_CONSUMER_KEY;
const redirectUri = "http:localhost:3001/api/callback";
// const redirectUri = "http:localhost:3000/";


const headers = {
  'Content-Type': 'application/json; charset=UTF-8',
  'X-Accept': 'application/json',
};

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
  let redirectUrl;
  axios.post(url)
    .then(response => {
      requestToken = response.data.split('=')[1];
      console.log(`Request token: ${requestToken}`);
      redirectUrl = `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${redirectUri}`;
      res.json(redirectUrl);
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



async function handleAuthorizationCallback(req, res) {
  // Step 2: Handle the authorization callback
  const url = `https://getpocket.com/v3/oauth/authorize?consumer_key=${consumerKey}&code=${requestToken}`;
  console.log("handleAuthorization");
  axios.post(url)
    .then(response => {
      accessToken = response.data.split('&')[0].split('=')[1];
      console.log(`Access token: ${accessToken}`);
      // Step 3: Retrieve the user's most recent saves
      const retrieveUrl = 'https://getpocket.com/v3/get';
      const data = {
        consumer_key: consumerKey,
        access_token: accessToken,
        count: 10,
        detailType: 'simple',
      };
      axios.post(retrieveUrl, data, { headers: headers })
        .then(response => {
          const items = response.data.list;
          console.log("Inside handleAuthorization POST");
          res.json(items);
        //   const imageElements = [];
        //   Object.keys(items).forEach(key => {
        //     const item = items[key];
        //     let imgUrl = 'https://cdn.worldvectorlogo.com/logos/callback.svg';
        //     if (item.has_image == '1') {
        //       imgUrl = item.top_image_url;
        //     }
        //     const title = item.given_title;
        //     const linkUrl = item.resolved_url;

        //     const imgElement = `<img src="${imgUrl}" width=150>`;
        //     const linkElement = `<a href="${linkUrl}" target="_blank">${imgElement}</a><p>${title}</p>`;
        //     imageElements.push(linkElement);
        //   });
        //   const html = '<h1>Pocket</h1>' + imageElements.join('\n');
        //   res.send(html);
        })
        .catch(error => {
          console.error(error);
          res.send('An error occurred while retrieving your saves');
        });
    })
    .catch(error => {
      // console.error(error);
      res.send('An error occurred while authorizing the request token');
    });
}

module.exports = {
  getTestData,
  getPocketData,
  getYouTubeData,
  handleAuthorizationCallback,
};