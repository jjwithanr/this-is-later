const axios = require('axios');
const express = require('express');
const app = express();
const port = 3000;

require('dotenv').config();
const consumerKey = process.env.POCKET_CONSUMER_KEY;
const redirectUri = 'http://localhost:3000/pocket';

const headers = {
  'Content-Type': 'application/json; charset=UTF-8',
  'X-Accept': 'application/json',
};

let requestToken = null;
let accessToken = null;

// Step 1: Obtain a request token
app.get('/', (req, res) => {
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
app.get('/pocket', (req, res) => {
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
          const items = response.data.list;

          const imageElements = [];
          // Loop through each saved link and create the associated HTML elements
          Object.keys(items).forEach(key => {
            const item = items[key];
            let imgUrl = 'https://cdn.worldvectorlogo.com/logos/pocket.svg';
            if (item.has_image == '1') {
              imgUrl = item.top_image_url;
            }
            const title = item.given_title;
            const linkUrl = item.resolved_url;

            // Create the HTML for the link's image and link element
            const imgElement = `<img src="${imgUrl}" width=150>`;
            const linkElement = `<a href="${linkUrl}" target="_blank">${imgElement}</a><p>${title}</p>`;

            // Add the link's HTML to the array
            imageElements.push(linkElement);
          });

          // Send the HTML for all link images as a response
          const html = imageElements.join('\n');
          res.send(html);
          // const html = '<h1>Pocket</h1>' + '<ul>' + Object.values(items).map(item => `<li><p>${item.given_url}</p></li>`).join('') + '</ul>';
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

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});