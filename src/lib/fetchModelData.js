/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 */

import axios from "axios";

export const API_BASE_URLS = ["https://7qyx49-8081.csb.app/api", "http://localhost:8081/api"];
// "https://54fstt-8081.csb.app/api",
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export function buildApiUrl(baseUrl, url) {
  return `${baseUrl}${url}`;
}

async function fetchModel(url) {
  let lastError = null;

  for (const baseUrl of API_BASE_URLS) {
    try {
      // const res = await fetch(buildApiUrl(baseUrl, url));
      // if (!res.ok) {
      //   throw new Error(`API error: ${res.status}`);
      // }
      // return await res.json();
      const res = await axios.get(buildApiUrl(baseUrl, url));
      return res.data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("API error");
}

export async function postModel(url, data) {
  let lastError = null;

  for (const baseUrl of API_BASE_URLS) {
    try {
      // Thử gửi POST tới link đầu tiên, nếu lỗi sẽ tự chạy vòng lặp nhảy sang link thứ 2
      const res = await axios.post(buildApiUrl(baseUrl, url), data);
      return res; // Trả về toàn bộ response để component con lấy status/token
    } catch (error) {
      lastError = error;
    }
  }

  // Nếu tèo cả 3 link thì mới chịu thua và ném lỗi
  throw lastError || new Error("Tất cả máy chủ đều không phản hồi");
}

export default fetchModel;
