import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PocketList from './components/PocketList';
import YouTubeList from './components/YouTubeList';

function App() {
  const [testData, setTestData] = useState([]);
  const [fetched, setFetched] = useState(false);

  function handlePocketClick() {
    setFetched(!fetched);
  }

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
      {/* add fetched as an input param? */}
      {fetched ? <PocketList /> : <img src="/images/pocket-logo.png" width={70} alt="Pocket" onClick={handlePocketClick} />}
    </div>
  );
}

export default App;