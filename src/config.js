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
export const features = Object.keys(process.env).reduce((acc, key) => {
  const matches = key.match(/REACT_APP_ENABLE_(.*)/)

  if (matches) {
    acc[matches[1]] = true
  }

  return acc
}, {})
