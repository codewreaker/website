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
    return data || []
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



  // Get portfolio stats
  getStats: async () => {
    const response = await fetch(`${API_BASE}/stats`)
    const data = await response.json()
    return data
  },
}

