const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const consumerKey = process.env.POCKET_CONSUMER_KEY;
const redirectUri = 'http://localhost:3000/pocket/callback';

const headers = {
  'Content-Type': 'application/json; charset=UTF-8',
  'X-Accept': 'application/json',
};

let requestToken = null;

async function handleAuthorizationCallback(req, res) {
  // Step 2: Handle the authorization callback
  const url = `https://getpocket.com/v3/oauth/authorize?consumer_key=${consumerKey}&code=${requestToken}`;
  console.log("handleAuthorization");
  res.redirect("https://www.google.com");
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
  handleAuthorizationCallback,
};