//import * as matter from 'gray-matter';
import grayMatter from 'gray-matter';
import { parse } from 'path';

// Cache for loaded data to avoid re-importing
const dataCache = new Map<string, any>();

// Helper function to get cached data or load it dynamically
const getCachedData = async <T>(key: string, loader: () => Promise<T>): Promise<T> => {
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
      return blogPosts || [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];
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


  // Usage example for your specific repository
  getBlogList: async (): Promise<BlogLists[]> => {
    return getCachedData('blogList', async () => {
      const blogs = await blogHandler(
        'codewreaker',     // owner
        'blogs',           // repo
        'docs/blog'        // path
      );

      console.log('Found blog files:', blogs);
      return blogs;
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
        portfolioAPI.getBlogList(),
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

const parseFrontMatter = (fileContent: string) => {
  try {
    const { data, content } = grayMatter(fileContent);
    return { frontMatter: data, content };
  } catch (error) {
    console.error('Error parsing front matter:', error);
    return { frontMatter: {}, content: fileContent };
  }
};
/**
 * Fetches a list of Markdown and MDX files from a GitHub repository
 * @param {string} owner - GitHub username/organization
 * @param {string} repo - Repository name
 * @param {string} path - Path to the directory containing the files
 * @param {string} [branch='main'] - Branch name (defaults to 'main')
 * @returns {Promise<Array>} Array of file objects with metadata
 */
async function blogHandler(owner: string, repo: string, path: string, branch = 'main'): Promise<BlogLists[]> {
  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Add your GitHub token here if you need higher rate limits
        // 'Authorization': 'token YOUR_GITHUB_TOKEN'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const files: GithubFile[] = await response.json();
    // Filter for .md and .mdx files only
    const blogFiles = files
      .filter(file =>
        file.type === 'file' &&
        (file.name.endsWith('.md') || file.name.endsWith('.mdx'))
      )
      .map(async(file) => {
        // File extension
        const extension = `.${file.name.split('.').pop()}`;
        // Extract title from filename (remove extension)
        const preContent = await fetchBlogContent(file.download_url);
        const {content, frontMatter} = parseFrontMatter(preContent);
        const title = frontMatter?.title || parse(file.name).name.replace(/-/g, ' ');

        return {
          metadata: {
            type: file.type,
            name: file.name,
            path: file.path,
            download_url: file.download_url,
            html_url: file.html_url,
            size: file.size,
            sha: file.sha,
          },
          htmlUrl: `https://blog.israelprempeh.com/blog/${title}`,
          title,
          content,
          frontMatter
        }
      });

    return await Promise.all(blogFiles);
  } catch (error) {
    console.error('Error fetching blog files:', error);
    throw error;
  }
}

/**
 * Fetches the content of a specific blog file
 * @param {string} downloadUrl - The download URL of the file from GitHub
 * @returns {Promise<string>} The file content as text
 */
export async function fetchBlogContent(downloadUrl: string): Promise<string> {
  try {
    const response = await fetch(downloadUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch file content: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Error fetching blog content:', error);
    throw error;
  }
}



// Example: Get blog list and fetch content of first blog
// async function exampleUsage() {
//     try {
//         // Get list of blog files
//         const blogFiles = await getBlogList();

//         if (blogFiles.length > 0) {
//             console.log(`Found ${blogFiles.length} blog files`);

//             // Fetch content of the first blog
//             const firstBlog = blogFiles[0];
//             console.log(`Fetching content for: ${firstBlog.name}`);

//             const content = await fetchBlogContent(firstBlog.downloadUrl);
//             console.log('Blog content preview:', content.substring(0, 200) + '...');
//         } else {
//             console.log('No blog files found');
//         }
//     } catch (error) {
//         console.error('Example usage failed:', error);
//     }
// }

// Export functions for use in modules
// export { fetchBlogFiles, fetchBlogContent, getBlogList };

// Uncomment the line below to run the example
// exampleUsage();

export default portfolioAPI;