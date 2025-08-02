

// Cache for loaded data to avoid re-importing
const dataCache = new Map<string, any>();

// Helper function to get cached data or load it dynamically
const getCachedData = async <T>(key: string, loader: () => Promise<T>): Promise<T> => {
  console.log(`Fetching data for key: ${key}`, dataCache);
  if (dataCache.has(key)) {
    return dataCache.get(key);
  }
  
  const data = await loader();
  dataCache.set(key, data);
  return data;
};

// Dynamic import wrapper with error handling
const loadData = async () => {
  try {
    const dataModule = await import('./data.js');
    return dataModule;
  } catch (error) {
    console.error('Failed to load data module:', error);
    throw new Error('Portfolio data could not be loaded');
  }
};

export const portfolioAPI = {
  // Get bio information
  getBio: async (): Promise<Bio> => {
    return getCachedData('bio', async () => {
      const { bio } = await loadData();
      return bio;
    });
  },

  // Get all projects
  getProjects: async (): Promise<Project[]> => {
    return getCachedData('projects', async () => {
      const { tabProjects } = await loadData();
      return tabProjects || [];
    });
  },

  // Get single project by key
  getProject: async (key: string): Promise<Project | null> => {
    const cacheKey = `project_${key}`;
    return getCachedData(cacheKey, async () => {
      const { tabProjects } = await loadData();
      const project = tabProjects.find((p: Project) => p.key === key);
      return project || null;
    });
  },

  // Get experience data (both education and work experience)
  getExperience: async (): Promise<ExperienceData> => {
    return getCachedData('experience', async () => {
      const { experienceData } = await loadData();
      return experienceData;
    });
  },

  // Get education only
  getEducation: async (): Promise<ExperienceItem[]> => {
    return getCachedData('education', async () => {
      const { experienceData } = await loadData();
      return experienceData.education || [];
    });
  },

  // Get work experience only
  getWorkExperience: async (): Promise<ExperienceItem[]> => {
    return getCachedData('workExperience', async () => {
      const { experienceData } = await loadData();
      return experienceData.experience || [];
    });
  },

  // Get all blog posts
  getBlogPosts: async (): Promise<BlogPost[]> => {
    //@todo implement an actual API call to fetch blog posts from github
    // For now, we will use the static data from the data module
    return getCachedData('blogPosts', async () => {
      const { blogPosts } = await loadData();
      return blogPosts || [{id:0},{id:1},{id:2},{id:3},{id:4},{id:5},{id:6}];
    });
  },

  // Get portfolio stats (calculated from data)
  getStats: async (): Promise<PortfolioStats> => {
    return getCachedData('stats', async () => {
      const [projects, experience, blogPosts] = await Promise.all([
        portfolioAPI.getProjects(),
        portfolioAPI.getWorkExperience(),
        portfolioAPI.getBlogPosts(),
      ]);

      // Calculate years of experience from work history
      const yearsExperience = experience.length > 0 
        ? new Date().getFullYear() - new Date(experience[experience.length - 1].period.split(' — ')[0]).getFullYear()
        : 0;

      return {
        totalProjects: projects.length,
        yearsExperience,
        totalBlogPosts: blogPosts.length,
        githubRepos: projects.length, // Assuming each project is a repo
      };
    });
  },


  // Get all tech stack items (from experience)
  getTechStack: async (): Promise<string[]> => {
    return getCachedData('techStack', async () => {
      const { experienceData } = await loadData();
      const allTech = experienceData.experience
        .flatMap((exp: ExperienceItem) => exp.techStack || []);
      return [...new Set(allTech)].sort();
    });
  },

  // Preload all data for SSR/SSG optimization
  preloadAll: async (): Promise<void> => {
    try {
      await Promise.all([
        portfolioAPI.getBio(),
        portfolioAPI.getProjects(),
        portfolioAPI.getExperience(),
        portfolioAPI.getBlogPosts(),
        portfolioAPI.getStats(),
      ]);
    } catch (error) {
      console.error('Failed to preload portfolio data:', error);
    }
  },

  // Clear cache (useful for development or data updates)
  clearCache: (): void => {
    dataCache.clear();
  },

  // Get data freshness (for cache invalidation)
  getDataTimestamp: (): number => {
    return Date.now();
  }
};


// Utility functions for SEO optimization
export const seoUtils = {
  // Generate meta description from bio
  generateMetaDescription: async (): Promise<string> => {
    const bio = await portfolioAPI.getBio();
    return bio.description.slice(0, 160) + (bio.description.length > 160 ? '...' : '');
  },

  // Generate structured data for person
  generatePersonStructuredData: async () => {
    const [bio, experience] = await Promise.all([
      portfolioAPI.getBio(),
      portfolioAPI.getWorkExperience(),
    ]);

    return {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": bio.name,
      "jobTitle": bio.title,
      "description": bio.description,
      "url": bio.links.find(link => link.label === 'GitHub')?.url,
      "sameAs": bio.links.map(link => link.url),
      "worksFor": experience[0]?.company,
    };
  },
};

export default portfolioAPI;