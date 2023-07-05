import React, { useState, useEffect } from 'react';
import axios from 'axios';

function YouTubeList() {
  const [youTubeData, setYouTubeData] = useState([]);

  useEffect(() => {
    axios.get('/youtube')
      .then(response => {
        setYouTubeData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h2>YouTube Data</h2>
      <ul>
        {youTubeData.map(item => (
          <li key={item.id}>
            <a href={`https://www.youtube.com/watch?v=${item.videoId}`}>{item.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default YouTubeList;