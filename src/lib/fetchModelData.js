/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 */
export const API_BASE_URLS = [
  "http://localhost:3001",
  "https://flxp3f-3001.csb.app",
];

export function buildApiUrl(baseUrl, url) {
  return `${baseUrl}${url}`;
}

async function fetchModel(url) {
  let lastError = null;

  for (const baseUrl of API_BASE_URLS) {
    try {
      const res = await fetch(buildApiUrl(baseUrl, url));
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("API error");
}

export default fetchModel;
