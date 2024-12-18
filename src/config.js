import globalWindow from 'global/window.js'

export const endpoints = {
  getMarketData: `${import.meta.env?.VITE_API_ROOT}api/get-market-data`,
  postDayResults: `${import.meta.env?.VITE_API_ROOT}api/post-day-results`,
}

// Represents all of the features enabled for the current environment. Features
// are enabled by environment-specific envars that start with
// "VITE_ENABLE_" prefix. The name of the enabled feature is the part of
// the envar name that follows the prefix. So, `VITE_ENABLE_MINING=true`
// in a .env file will enable the "MINING" feature for its corresponding
// environment.
//
// See: https://create-react-app.dev/docs/adding-custom-environment-variables/
//
// In addition to enabling features via envars, end users can manually enable
// them via URL query parameters. This can be done by constructing a query
// parameter that looks like:
//
//   ?enable_FOREST=true
/**
 * @type {{
 *   FOREST?: boolean
 * }}
 */
export const features = Object.keys(import.meta.env ?? {}).reduce(
  (acc, key) => {
    const matches = key.match(/VITE_ENABLE_(.*)/)

    if (matches) {
      acc[matches[1]] = true
    }

    return acc
  },
  {}
)

// Use optional chaining here because window.location will not be defined when
// this is running in a Node.js context.
const searchParams = new URLSearchParams(globalWindow.location?.search)

for (const key of searchParams.keys()) {
  const matches = key.match(/enable_(.*)/)

  if (matches) {
    features[matches[1]] = true
  }
}

export const rtcConfig = {
  iceServers: [
    {
      urls: 'stun:stun.relay.metered.ca:80',
    },
    {
      urls: 'turn:a.relay.metered.ca:80',
      username: import.meta.env?.VITE_TURN_USERNAME,
      credential: import.meta.env?.VITE_TURN_CREDENTIAL,
    },
    {
      urls: 'turn:a.relay.metered.ca:80?transport=tcp',
      username: import.meta.env?.VITE_TURN_USERNAME,
      credential: import.meta.env?.VITE_TURN_CREDENTIAL,
    },
    {
      urls: 'turn:a.relay.metered.ca:443',
      username: import.meta.env?.VITE_TURN_USERNAME,
      credential: import.meta.env?.VITE_TURN_CREDENTIAL,
    },
    {
      urls: 'turn:a.relay.metered.ca:443?transport=tcp',
      username: import.meta.env?.VITE_TURN_USERNAME,
      credential: import.meta.env?.VITE_TURN_CREDENTIAL,
    },
  ],
}

export const relayUrls = import.meta.env?.VITE_TRACKER_URL
  ? [import.meta.env?.VITE_TRACKER_URL]
  : undefined
