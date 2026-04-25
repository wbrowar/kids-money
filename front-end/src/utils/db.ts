import { ServerRoute } from '@server/constants/constants.ts'

class DbHandler {
  #apiUrl = import.meta.env.VITE_PUBLIC_API_URL

  /**
   * =========================================================================
   * PRIVATE METHODS
   * =========================================================================
   */
  private formatUri(uri: keyof typeof ServerRoute) {
    return this.#apiUrl + uri
  }

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
  async getJson(uri: keyof typeof ServerRoute) {
    const response = await window.fetch(this.formatUri(uri))
    return await this.getResponseJson(response)
  }

  async postRequest(uri: keyof typeof ServerRoute, data: object) {
    const response = await window.fetch(this.formatUri(uri), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return await this.getResponseJson(response)
  }
}

export const Db = new DbHandler()
