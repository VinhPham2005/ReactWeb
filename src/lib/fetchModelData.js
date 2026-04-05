/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 */
export const API_BASE_URL = "http://localhost:3001";

function fetchModel(url) {
  return fetch(`${API_BASE_URL}${url}`).then((res) => {
    if (!res.ok) throw new Error("API error");
    return res.json();
  });
}

export default fetchModel;
