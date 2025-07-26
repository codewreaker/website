import { http, HttpResponse } from 'msw';
import  {
    bio,
    tabProjects,
    experienceData,
    blogPosts
} from './mock-data.js'

// MSW Handlers
export const handlers = [
  // http.all('*', async () => {
  //   await delay(500);
  // }),
  // Get bio/profile information
  http.get('/api/bio', () => {
    return HttpResponse.json({
      success: true,
      data: bio,
    });
  }),

  // Get tab projects
  http.get('/api/projects', () => {
    return HttpResponse.json({
      success: true,
      data: tabProjects,
    });
  }),

  // Get single project by key
  http.get('/api/projects/:key', ({ params }) => {
    const { key } = params;
    const project = tabProjects.find((p) => p.key === key);

    if (!project) {
      return HttpResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: project,
    });
  }),

  // Get experience/work history
  http.get('/api/experience', () => {
    return HttpResponse.json({
      success: true,
      data: experienceData,
    });
  }),

  // Get all blog posts
  http.get('/api/blog', ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const featured = url.searchParams.get('featured');
    const limit = url.searchParams.get('limit');

    let filteredPosts = [...blogPosts];

    // Filter by category
    if (category) {
      filteredPosts = filteredPosts.filter(
        (post) => post.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by featured status
    if (featured === 'true') {
      filteredPosts = filteredPosts.filter((post) => post.featured === true);
    }

    // Limit results
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredPosts = filteredPosts.slice(0, limitNum);
      }
    }

    return HttpResponse.json({
      success: true,
      data: filteredPosts,
      meta: {
        total: blogPosts.length,
        filtered: filteredPosts.length,
        categories: [...new Set(blogPosts.map((post) => post.category))],
      },
    });
  }),

  // Get single blog post by ID
  http.get('/api/blog/:id', ({ params }) => {
    const { id } = params;
    const postId = parseInt(id as string, 10);
    const post = blogPosts.find((p) => p.id === postId);

    if (!post) {
      return HttpResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: post,
    });
  }),

  // Get blog categories
  http.get('/api/blog/categories', () => {
    const categories = [...new Set(blogPosts.map((post) => post.category))];
    return HttpResponse.json({
      success: true,
      data: categories,
    });
  }),

  // Get featured blog posts
  http.get('/api/blog/featured', () => {
    const featuredPosts = blogPosts.filter((post) => post.featured === true);
    return HttpResponse.json({
      success: true,
      data: featuredPosts,
    });
  }),

  // Get portfolio summary/stats
  http.get('/api/stats', () => {
    const stats = {
      totalProjects: tabProjects.length,
      totalBlogPosts: blogPosts.length,
      totalExperience: experienceData.experience.length,
      categories: [...new Set(blogPosts.map((post) => post.category))].length,
      techStack: [...new Set(experienceData.experience.flatMap((exp) => exp.techStack))],
    };

    return HttpResponse.json({
      success: true,
      data: stats,
    });
  }),
];
