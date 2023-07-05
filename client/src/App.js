import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PocketList from './components/PocketList';
import YouTubeList from './components/YouTubeList';

function App() {
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    axios.get('/api/test')
      .then(response => {
        setTestData(response.data.message);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1>This is Later</h1>
      <h2>Test: {testData}</h2>
      {/* <PocketList /> */}
      {/* <YouTubeList /> */}
    </div>
  );
}

export default App;