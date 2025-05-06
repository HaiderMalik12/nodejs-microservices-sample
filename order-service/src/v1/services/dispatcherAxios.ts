import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import AppSettings from '@logs/models/appSettings';

// Define an interface for request options
interface RequestOptions {
  appId: string;
}

// Define a base HTTP service class
class DispatcherService {
  private baseUrl: string;

  constructor() {
    if (!process.env.DISPATCHER_BASE_URL) {
      throw new Error('DISPATCHER_BASE_URL is not set in the environment variables');
    }
    this.baseUrl = process.env.DISPATCHER_BASE_URL;
  }

  /**
   * Creates an Axios configuration for requests.
   * @param {string} method - The HTTP method.
   * @param {string} route - The endpoint route.
   * @param {RequestOptions} options - Request-specific options (token, appId).
   * @param {Record<string, any>} [dataOrParams] - Request body or query parameters.
   * @returns {AxiosRequestConfig} - Configured Axios request.
   */
  private async createConfig(
    method: 'post' | 'get',
    route: string,
    options: RequestOptions,
    dataOrParams: Record<string, any> = {}
  ): Promise<AxiosRequestConfig> {
    const appSettings = await AppSettings.findOne(
      { 'deliveryData.userMetaData._id': options.appId },
      'deliveryData.token deliveryData.userMetaData._id deliveryData.baseUrl'
    ).lean();

    console.log('appSettings', JSON.stringify(appSettings))

    if (!appSettings || !appSettings.deliveryData) {
      throw new Error('Invalid app settings or delivery data');
    }

    const { token, userMetaData, baseUrl } = appSettings.deliveryData;
    if (!token || !userMetaData?._id || !baseUrl) {
      throw new Error('Incomplete delivery data in app settings');
    }

    const url = `${this.baseUrl}/api/v1${route}`;
    const config: AxiosRequestConfig = {
      method,
      url,
      headers: {
        Authorization: `Bearer ${token}`,
        appid: options.appId,
        'Content-Type': 'application/json'
      }
    };

    if (method === 'post') {
      config.data = dataOrParams; // POST body
    } else if (method === 'get') {
      config.params = dataOrParams; // GET query params
    }

    return config;
  }

  /**
   * Sends a POST request to the dispatcher service.
   * @param {string} route - The API route.
   * @param {Record<string, any>} body - The request body.
   * @param {RequestOptions} options - Request-specific options.
   * @returns {Promise<any>} - The response data.
   */
  async post(route: string, body: Record<string, any>, options: RequestOptions): Promise<any> {
    return this.sendRequest('post', route, options, body);
  }

  /**
   * Sends a GET request to the dispatcher service.
   * @param {string} route - The API route.
   * @param {Record<string, any>} queryParams - Query parameters for the request.
   * @param {RequestOptions} options - Request-specific options.
   * @returns {Promise<any>} - The response data.
   */
  async get(route: string, queryParams: Record<string, any>, options: RequestOptions): Promise<any> {
    return this.sendRequest('get', route, options, queryParams);
  }

  /**
   * Handles the actual request sending and response processing.
   * @param {'post' | 'get'} method - The HTTP method.
   * @param {string} route - The API route.
   * @param {RequestOptions} options - Request-specific options.
   * @param {Record<string, any>} [dataOrParams] - Request body or query parameters.
   * @returns {Promise<any>} - The response data.
   */
  private async sendRequest(
    method: 'post' | 'get',
    route: string,
    options: RequestOptions,
    dataOrParams: Record<string, any> = {}
  ): Promise<any> {
    try {
      const config = (await this.createConfig(method, route, options, dataOrParams)) as AxiosRequestConfig;
      const response: AxiosResponse = await axios(config);
      return response.data?.data; // Assume the response format contains `data` key
    } catch (error: any) {
      // Enhanced error handling for better debugging
      const errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;

      console.error(`Dispatcher ${method.toUpperCase()} request failed: ${errorMessage}`);
      console.error(error);
      throw new Error(`Dispatcher ${method.toUpperCase()} request failed: ${error.message}`);
    }
  }
}

// Export an instance of the DispatcherService
const dispatcherService = new DispatcherService();
export default dispatcherService;
