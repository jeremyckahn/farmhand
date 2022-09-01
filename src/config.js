import window from 'global/window'

export const endpoints = {
  getMarketData: `${process.env.REACT_APP_API_ROOT}api/get-market-data`,
  postDayResults: `${process.env.REACT_APP_API_ROOT}api/post-day-results`,
}

// Represents all of the features enabled for the current environment. Features
// are enabled by environment-specific envars that start with
// "REACT_APP_ENABLE_" prefix. The name of the enabled feature is the part of
// the envar name that follows the prefix. So, `REACT_APP_ENABLE_MINING=true`
// in a .env file will enable the "MINING" feature for its corresponding
// environment.
//
// See: https://create-react-app.dev/docs/adding-custom-environment-variables/
//
// In addition to enabling features via envars, end users can manually enable
// them via URL query parameters. This can be done by constructing a query
// parameter that looks like:
//
//   ?enable_MINING=true
export const features = Object.keys(process.env).reduce((acc, key) => {
  const matches = key.match(/REACT_APP_ENABLE_(.*)/)

  if (matches) {
    acc[matches[1]] = true
  }

  return acc
}, {})

const searchParams = new URLSearchParams(window.location.search)

for (const key of searchParams.keys()) {
  const matches = key.match(/enable_(.*)/)

  if (matches) {
    features[matches[1]] = true
  }
}

export const rtcConfig = {
  iceServers: [
    {
      urls: 'stun:openrelay.metered.ca:80',
    },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
}

export const trackerUrls = process.env.REACT_APP_TRACKER_URL
  ? [process.env.REACT_APP_TRACKER_URL]
  : undefined
