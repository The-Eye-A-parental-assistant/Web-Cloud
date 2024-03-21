import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import amplifyConfig from './amplifyconfiguration.json';
import { uploadData, list } from 'aws-amplify/storage';
import awsconfig from './aws-exports';

Amplify.configure(amplifyConfig);

function App() {
  const [files, setFiles] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const filename = file.name;
    try {
      const result = await uploadData({
        key: filename,
        data: file,
        options: {
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              console.log(
                `Upload progress ${
                  Math.round((transferredBytes / totalBytes) * 100)
                } %`
              );
            }
          }
        }
      });
      console.log('Key from Response: ', result.key);
      listFiles(); 
    } catch (error) {
      console.log('Error : ', error);
    }
  };

  const listFiles = async () => {
    try {
      const result = await list();
      if (result && Array.isArray(result.items)) {
        setFiles(result.items); 
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    listFiles(); 
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial', 
      backgroundColor: '#282c34', 
      color: '#ffffff',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }}>
    <h1 style={{ textAlign: 'center', color: '#61dafb' }}>File Upload and List</h1>
    <input type="file" onChange={handleFileUpload} style={{ display: 'block', margin: '20px auto' }} />
    <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
      {Array.isArray(files) && files.map((file, index) => (
        <li key={index} style={{ 
          marginBottom: '10px', 
          backgroundColor: '#f8f8f8', 
          padding: '10px', 
          borderRadius: '5px',
          color: '#282c34',
          wordBreak: 'break-all'
        }}>
          {file.key}
        </li>
      ))}
    </ul>
  </div>
  );
}

export default App;

