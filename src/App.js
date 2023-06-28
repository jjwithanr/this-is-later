import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [testData, setTestData] = useState(null);
  const [pocketData, setPocketData] = useState(null);
  const [youtubeData, setYoutubeData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const testRes = await axios.get("http://localhost:3001/test");
      // const pocketRes = await axios.get("http://localhost:3001/pocket");
      // const youtubeRes = await axios.get("http://localhost:3001/youtube");

      setTestData(testRes.data);
      // setPocketData(pocketRes.data);
      // setYoutubeData(youtubeRes.data);
    };

    fetchData();
  }, []);
  
  return (
    <div className="App">
      <h1>This Is Later</h1>

      <h2>{testData}</h2>

      {/* Display Pocket data */}
      {/* {pocketData && 
        pocketData.map(d => (
          <div key={d.id}>
            <a href={d.given_url}>{d.given_title}</a>
          </div>
      ))} */}
      
      {/* Display YouTube data */}
      {/* {youtubeData &&
        youtubeData.map(video => (
          <div key={video.id}>
            <h3>{video.snippet.title}</h3>
            <img src={video.snippet.thumbnails.default.url} />
          </div>
        ))} */}
    </div>
  );
}

export default App;