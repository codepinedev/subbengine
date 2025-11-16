import axios from 'axios'
import type {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:9999/api/v1',
  // baseURL: 'http://localhost:9999/sdk-api/v1',
  withCredentials: true,
  // headers: {
  //   'X-API-key':
  //     'sk_booms_fd5deb33c53e7ca2988d05d01bccbc092ad05406de9c4e0792beb33fe5e7f19f_490765',
  // },
})

axiosInstance.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    return request
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse | Promise<AxiosResponse> => response,
  async (error: AxiosError) => {
    return Promise.reject(error)
  },
)

export { axiosInstance }
