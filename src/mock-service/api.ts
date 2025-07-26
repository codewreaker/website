// ---

// Example API service functions
// services/api.js
const API_BASE = '/api'

export const portfolioAPI = {
  // Get bio information
  getBio: async () => {
    const response = await fetch(`${API_BASE}/bio`)
    const data = await response.json()
    return data
  },

  // Get all projects
  getProjects: async () => {
    const response = await fetch(`${API_BASE}/projects`)
    const data = await response.json()
    return data
  },

  // Get single project
  getProject: async (key:string) => {
    const response = await fetch(`${API_BASE}/projects/${key}`)
    const data = await response.json()
    return data
  },

  // Get experience
  getExperience: async () => {
    const response = await fetch(`${API_BASE}/experience`)
    const data = await response.json()
    return data
  },

  // Get blog posts with optional filters
  getBlogPosts: async (filters:any = {}) => {
    const params = new URLSearchParams()
    
    if (filters.category) params.append('category', filters.category)
    if (filters.featured) params.append('featured', 'true')
    if (filters.limit) params.append('limit', filters.limit.toString())

    const url = `${API_BASE}/blog${params.toString() ? '?' + params.toString() : ''}`
    const response = await fetch(url)
    const data = await response.json()
    return data
  },

  // Get single blog post
  getBlogPost: async (id:string) => {
    const response = await fetch(`${API_BASE}/blog/${id}`)
    const data = await response.json()
    return data
  },

  // Get blog categories
  getBlogCategories: async () => {
    const response = await fetch(`${API_BASE}/blog/categories`)
    const data = await response.json()
    return data
  },

  // Get featured blog posts
  getFeaturedPosts: async () => {
    const response = await fetch(`${API_BASE}/blog/featured`)
    const data = await response.json()
    return data
  },

  // Get portfolio stats
  getStats: async () => {
    const response = await fetch(`${API_BASE}/stats`)
    const data = await response.json()
    return data
  },
}

