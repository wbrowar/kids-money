import { ServerRouteValue } from '@types'

/**
 * A class that handles database interactions.
 */
class DbHandler {
  #apiUrl = import.meta.env.VITE_PUBLIC_API_URL

  /**
   * =========================================================================
   * PRIVATE METHODS
   * =========================================================================
   */
  /**
   * Constructs a URI used to make API requests.
   *
   * @param {ServerRouteValue} uri - The route key to be appended to the base API URL.
   * @return {string} The fully formatted URI.
   */
  private formatUri(uri: ServerRouteValue) {
    return this.#apiUrl + uri
  }

  /**
   * Processes a fetch response and extracts its JSON content. Throws an error if the response status is not OK.
   *
   * @param {Response} response The fetch API Response object to process.
   * @return {Promise<object>} A promise that resolves to the parsed JSON content of the response.
   * @throws {Error} If the response status is not OK, an error is thrown containing the error message from the JSON or a default error message.
   */
  private async getResponseJson(response: Response) {
    const json = await response.json()
    if (!response.ok) {
      throw new Error(json.error ?? 'Failed to fetch data')
    }
    return json
  }

  /**
   * =========================================================================
   * PUBLIC METHODS
   * =========================================================================
   */
  /**
   * Sends a GET request to the specified URI and retrieves a JSON response.
   *
   * @param {ServerRouteValue} uri - The URI of the server route to fetch data from.
   * @return {Promise<any>} A promise that resolves to the parsed JSON response.
   */
  async getJson(uri: ServerRouteValue) {
    const response = await window.fetch(this.formatUri(uri), {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
    return await this.getResponseJson(response)
  }

  /**
   * Sends a POST request to the specified server route with the provided data.
   *
   * @param {ServerRouteValue} uri - The server route to which the POST request is sent.
   * @param {object} data - The payload to be sent in the body of the POST request.
   * @return {Promise<any>} A promise that resolves with the JSON-parsed response from the server.
   */
  async postRequest(uri: ServerRouteValue, data: object) {
    const response = await window.fetch(this.formatUri(uri), {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    return await this.getResponseJson(response)
  }
}

export const Db = new DbHandler()
