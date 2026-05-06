import axios from "axios"

const apiClient = axios.create({
  baseURL: "/api/proxy",
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default apiClient
