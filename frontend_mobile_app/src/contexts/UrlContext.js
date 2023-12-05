// ---------Inbuilt components & modules---------
import {createContext, useState} from 'react';

// Create context
const UrlContext = createContext();

const UrlProvider = ({children}) => {
  // Url state
  const [Urls, SetUrls] = useState({
    baseUrl: 'http://192.168.228.241:3300/api/',
    fileUrl: 'http://192.168.228.241:3300/uploads/',
    fishIdUrl: 'http://192.168.228.241:5001/',
    fishDisIdUrl: 'http://192.168.228.241:5002/',
    fishTrIdUrl: 'http://192.168.228.241:5003/',
    reenUrl: 'http://192.168.228.241:5004/',
  });

  return (
    <UrlContext.Provider
      value={{
        Urls,
      }}>
      {children}
    </UrlContext.Provider>
  );
};

export {UrlContext, UrlProvider};
