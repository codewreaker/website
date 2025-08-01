// services/api.ts
// Optimized API service using dynamic imports for better performance and SEO

// Type definitions for better TypeScript support
interface Bio {
  name: string;
  title: string;
  description: string;
  links: Array<{ label: string; url: string }>;
}

interface Project {
  name: string;
  description: string;
  path: string;
  key: string;
}

interface ExperienceItem {
  period: string;
  title: string;
  company?: string;
  school?: string;
  description: string;
  techStack?: string[];
  fields?: string[];
  subtitles?: string[];
}

interface ExperienceData {
  education: ExperienceItem[];
  experience: ExperienceItem[];
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured?: boolean;
}

interface PortfolioStats {
  totalProjects: number;
  yearsExperience: number;
  totalBlogPosts: number;
  githubRepos: number;
}

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
      console.log('Bio data loaded:', bio);
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
    return getCachedData('blogPosts', async () => {
      const { blogPosts } = await loadData();
      return blogPosts || [];
    });
  },

  // Get featured blog posts
  getFeaturedBlogPosts: async (): Promise<BlogPost[]> => {
    return getCachedData('featuredBlogPosts', async () => {
      const { blogPosts } = await loadData();
      return blogPosts.filter((post: BlogPost) => post.featured) || [];
    });
  },

  // Get blog posts by category
  getBlogPostsByCategory: async (category: string): Promise<BlogPost[]> => {
    const cacheKey = `blogPosts_${category}`;
    return getCachedData(cacheKey, async () => {
      const { blogPosts } = await loadData();
      return blogPosts.filter((post: BlogPost) => 
        post.category.toLowerCase() === category.toLowerCase()
      ) || [];
    });
  },

  // Get recent blog posts (last N posts)
  getRecentBlogPosts: async (limit: number = 3): Promise<BlogPost[]> => {
    const cacheKey = `recentBlogPosts_${limit}`;
    return getCachedData(cacheKey, async () => {
      const { blogPosts } = await loadData();
      return blogPosts
        .sort((a: BlogPost, b: BlogPost) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit) || [];
    });
  },

  // Get single blog post by ID
  getBlogPost: async (id: number): Promise<BlogPost | null> => {
    const cacheKey = `blogPost_${id}`;
    return getCachedData(cacheKey, async () => {
      const { blogPosts } = await loadData();
      const post = blogPosts.find((post: BlogPost) => post.id === id);
      return post || null;
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

  // Get all unique blog categories
  getBlogCategories: async (): Promise<string[]> => {
    return getCachedData('blogCategories', async () => {
      const { blogPosts } = await loadData();
      const categories = [...new Set(blogPosts.map((post: BlogPost) => post.category))];
      return categories.sort();
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
  },
};

// Export individual data loaders for specific use cases
export const dataLoaders = {
  // Synchronous data access (for SSR/SSG)
  loadBioSync: () => loadData().then(({ bio }) => bio),
  loadProjectsSync: () => loadData().then(({ tabProjects }) => tabProjects),
  loadExperienceSync: () => loadData().then(({ experienceData }) => experienceData),
  loadBlogPostsSync: () => loadData().then(({ blogPosts }) => blogPosts),
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

  // Generate structured data for blog posts
  generateBlogStructuredData: async () => {
    const blogPosts = await portfolioAPI.getBlogPosts();
    const bio = await portfolioAPI.getBio();

    return blogPosts.map(post => ({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "author": {
        "@type": "Person",
        "name": bio.name,
      },
      "category": post.category,
    }));
  },
};

export default portfolioAPI;