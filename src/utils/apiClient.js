// API Client with rate limiting, retry logic, and caching
class ApiClient {
  constructor() {
    this.cache = new Map()
    this.retryAttempts = 3
    this.retryDelay = 1000 // 1 second base delay
    this.rateLimitDelay = 5000 // 5 seconds for rate limiting
  }

  // Generate cache key
  getCacheKey(url) {
    return `api_${url}`
  }

  // Check if cache is valid (5 minutes for breeds, 10 minutes for images)
  isCacheValid(key, type = 'breeds') {
    const cached = this.cache.get(key)
    if (!cached) return false
    
    const now = Date.now()
    const maxAge = type === 'breeds' ? 5 * 60 * 1000 : 10 * 60 * 1000 // 5min or 10min
    return (now - cached.timestamp) < maxAge
  }

  // Get from cache
  getFromCache(url, type = 'breeds') {
    const key = this.getCacheKey(url)
    if (this.isCacheValid(key, type)) {
      console.log(`Cache hit for ${url}`)
      return this.cache.get(key).data
    }
    return null
  }

  // Set cache
  setCache(url, data, type = 'breeds') {
    const key = this.getCacheKey(url)
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      type
    })
    console.log(`Cached ${url}`)
  }

  // Sleep utility
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Exponential backoff retry
  async retryWithBackoff(fn, attempt = 1) {
    try {
      return await fn()
    } catch (error) {
      if (attempt >= this.retryAttempts) {
        throw error
      }

      // Check if it's a rate limiting error
      if (error.status === 429 || error.message.includes('rate limit')) {
        console.log(`Rate limited. Waiting ${this.rateLimitDelay}ms before retry ${attempt}`)
        await this.sleep(this.rateLimitDelay)
      } else {
        // Exponential backoff for other errors
        const delay = this.retryDelay * Math.pow(2, attempt - 1)
        console.log(`Retry attempt ${attempt} after ${delay}ms`)
        await this.sleep(delay)
      }

      return this.retryWithBackoff(fn, attempt + 1)
    }
  }

  // Enhanced fetch with retry and rate limiting
  async fetchWithRetry(url, options = {}) {
    const fetchFn = async () => {
      console.log(`Fetching: ${url}`)
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        ...options
      })

      console.log(`Response status: ${response.status}`)
      
      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`)
        error.status = response.status
        throw error
      }

      return response
    }

    return this.retryWithBackoff(fetchFn)
  }

  // Get breeds with caching
  async getBreeds() {
    const url = 'https://dog.ceo/api/breeds/list/all'
    
    // Check cache first
    const cached = this.getFromCache(url, 'breeds')
    if (cached) {
      return cached
    }

    try {
      console.log('Fetching breeds from API...')
      const response = await fetch(url)
      console.log('Response received:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Data parsed successfully:', data.status)
      
      if (data.status === 'success') {
        // Process breeds data
        const allBreeds = []
        Object.keys(data.message).forEach(breed => {
          allBreeds.push(breed)
          if (data.message[breed].length > 0) {
            data.message[breed].forEach(subBreed => {
              allBreeds.push(`${subBreed} ${breed}`)
            })
          }
        })
        
        // Cache the result
        this.setCache(url, allBreeds, 'breeds')
        console.log(`Successfully loaded ${allBreeds.length} breeds`)
        return allBreeds
      } else {
        throw new Error(data.message || 'Failed to fetch breeds')
      }
    } catch (error) {
      console.error('Error fetching breeds:', error)
      throw error
    }
  }

  // Get images with caching
  async getImages(breed) {
    // Handle sub-breed format
    let apiBreed = breed
    if (breed.includes(' ')) {
      const parts = breed.split(' ')
      apiBreed = `${parts[1]}/${parts[0]}`
    }
    
    const url = `https://dog.ceo/api/breed/${apiBreed}/images/random/3`
    
    // Check cache first
    const cached = this.getFromCache(url, 'images')
    if (cached) {
      return cached
    }

    try {
      console.log(`Fetching images for ${breed} from API...`)
      const response = await fetch(url)
      console.log('Image response received:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Image data parsed successfully:', data.status)
      
      if (data.status === 'success') {
        // Cache the result
        this.setCache(url, data.message, 'images')
        console.log(`Successfully loaded ${data.message.length} images`)
        return data.message
      } else {
        throw new Error(data.message || 'Failed to fetch images')
      }
    } catch (error) {
      console.error('Error fetching images:', error)
      throw error
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
    console.log('Cache cleared')
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// Export singleton instance
export default new ApiClient()
