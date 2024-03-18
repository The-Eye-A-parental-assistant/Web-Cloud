import React from 'react';
import { Amplify } from 'aws-amplify'; // Import Amplify
import amplifyConfig from './amplifyconfiguration.json'; // Import Amplify configuration
import { uploadData } from 'aws-amplify/storage'; // Import uploadData function
import awsconfig from './aws-exports';
// Configure Amplify with amplifyconfig
Amplify.configure(amplifyConfig);

function App() {
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
    } catch (error) {
      console.log('Error : ', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
}

export default App;

