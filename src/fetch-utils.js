// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
/** @type {RequestInit} */
const commonFetchConfig = {
  mode: 'cors', // no-cors, *cors, same-origin
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'same-origin', // include, *same-origin, omit
  headers: {
    'Content-Type': 'application/json',
  },
  redirect: 'follow', // manual, *follow, error
  referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
}

export async function getData(url = '', data = {}) {
  const params = new URLSearchParams()

  Object.keys(data).forEach(key =>
    params.append(encodeURIComponent(key), encodeURIComponent(data[key]))
  )

  // Default options are marked with *
  const response = await fetch(`${url}?${params}`, {
    ...commonFetchConfig,
    method: 'GET',
  })

  return response.json() // parses JSON response into native JavaScript objects
}

export async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    ...commonFetchConfig,
    method: 'POST',
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })

  return response.json() // parses JSON response into native JavaScript objects
}
