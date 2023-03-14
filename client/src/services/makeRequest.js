import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  withCredentials: true
})

export function makeRequest(url, options) {
  return api(url, options).then(res => res.data)
      .catch(err =>
        Promise.reject(err.response.data.message ?? "에러가 발생했습니다.")
      )
  
}
