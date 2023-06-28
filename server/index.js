const axios = require('axios');
const express = require('express');
const { google } = require('googleapis');
const { auth } = require('googleapis/build/src/apis/abusiveexperiencereport');
const { oauth2 } = require('googleapis/build/src/apis/oauth2');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const port = 3001;
const app = express();
app.use(cors());

const consumerKey = process.env.POCKET_CONSUMER_KEY;
const youtubeApiKey = process.env.YOUTUBE_API_KEY;
const youtubeClientId = process.env.YOUTUBE_CLIENT_ID;
const youtubeClientSecret = process.env.YOUTUBE_CLIENT_SECRET;
const redirectUri = 'http://localhost:3000/pocket/callback';
const youtubeRedirectUri = 'http://localhost:3000/auth/callback/'

const headers = {
  'Content-Type': 'application/json; charset=UTF-8',
  'X-Accept': 'application/json',
};

// Set up the Google OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  youtubeClientId,
  youtubeClientSecret,
  youtubeRedirectUri
);

// Define the scopes that we need to access the user's YouTube account
const scopes = ['https://www.googleapis.com/auth/youtube.readonly'];

let requestToken = null;
let accessToken = null;

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });

app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Welcome to my homepage</h1>
        <button onclick="window.location.href='/pocket'">Pocket</button>
        <button onclick="window.location.href='/auth'">YouTube</button>
      </body>
    </html>
  `);
});

app.get('/test', (req, res) => {
  res.send("Hello World!!");
});

// Step 1: Obtain a request token
app.get('/pocket', (req, res) => {
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
});

// Step 2: Handle the authorization callback
app.get('/pocket/callback', (req, res) => {
  const url = `https://getpocket.com/v3/oauth/authorize?consumer_key=${consumerKey}&code=${requestToken}`;
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
          const pocketRes = response.data.list;
          res.send(pocketRes);

          // const imageElements = [];
          // Object.keys(pocketRes).forEach(key => {
          //   const item = pocketRes[key];
          //   let imgUrl = 'https://cdn.worldvectorlogo.com/logos/callback.svg';
          //   if (item.has_image == '1') {
          //     imgUrl = item.top_image_url;
          //   }
          //   const title = item.given_title;
          //   const linkUrl = item.resolved_url;

          //   const imgElement = `<img src="${imgUrl}" width=150>`;
          //   const linkElement = `<a href="${linkUrl}" target="_blank">${imgElement}</a><p>${title}</p>`;

          //   imageElements.push(linkElement);
          // });

          // const html = '<h1>Pocket</h1>' + imageElements.join('\n');
          // res.send(html);
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
});

app.get('/auth', (req, res) => {
  // Generate the URL for the authorization flow
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });

  // Redirect the user to the authorization URL
  res.redirect(authUrl);
});

app.get('/auth/callback', async (req, res) => {
  // Exchange the authorization code for an access token and refresh token
  const { tokens } = await oauth2Client.getToken(req.query.code);

  // Set the access token and refresh token on the OAuth2 client
  oauth2Client.setCredentials(tokens);

  // Retrieve the user's playlists
  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client,
  });

  // Retrieve the latest 10 videos in the Watch Later playlist
  const { data: { items: videos } } = await youtube.playlistItems.list({
    playlistId: 'WL',
    part: ["snippet"],
    // fields: 'items(snippet(title,description,thumbnails(default)))',
  });

  // Send the JSON object containing video details
  console.log(JSON.stringify(videos, null, 2));
  // res.send(videos);
  res.json(videos);

});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});