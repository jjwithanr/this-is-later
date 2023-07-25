import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PocketList() {
  const [pocketData, setPocketData] = useState([]);

  useEffect(() => {
    axios.get('/api/pocket')
      .then(response => {
        window.location.href = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h2>Pocket Data:</h2>
      <ul>
        {pocketData.map(item => (
          <li key={item.item_id}>
            <a href={item.given_url}>{item.given_title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PocketList;