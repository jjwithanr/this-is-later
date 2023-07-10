import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PocketList() {
  const [pocketData, setPocketData] = useState([]);

  useEffect(() => {
    axios.get('/api/pocket')
      .then(response => {
        setPocketData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h2>Pocket Data: {pocketData}</h2>
      {/* <ul>
        {pocketData.map(item => (
          <li key={item.id}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul> */}
    </div>
  );
}

export default PocketList;