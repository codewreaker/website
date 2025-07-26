import React, { useEffect, useState } from 'react';
import { portfolioAPI } from '../../mock-service/api.js';
import { formatDate } from '../../utils/formatDate.js';
import '../Home/home.css';

// Define BlogPost type (replace with import if available)
type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  category?: string;
  date?: string;
  readTime?: string;
  featured?: boolean;
};


// BlogList component logic from Home
const BlogList: React.FC<{ data: BlogPost[] }> = ({ data }) => {
  const featuredPost = data.find((post) => post.featured) || data[0];
  const allPosts = data.filter((post) => post.id !== featuredPost.id);



  return (
    <div id="blog" className="blog-container">
      <div className="blog-header">
        <h1 className="blog-title">Blog</h1>
      </div>
      <div className="blog-content">
        <article className="featured-post">
          <div className="featured-badge">Latest</div>
          <div className="featured-image">
            <img
              src={featuredPost?.image || './assets/placeholder.svg'}
              alt={featuredPost?.title}
            />
          </div>
          <div className="featured-content">
            <div className="post-meta">
              <span className="category">{featuredPost?.category}</span>
              <span className="date">
                {formatDate(featuredPost?.date || new Date().toISOString())}
              </span>
              <span className="read-time">{featuredPost?.readTime}</span>
            </div>
            <h2 className="featured-title">{featuredPost?.title}</h2>
            <p className="featured-excerpt">{featuredPost?.excerpt}</p>
            <button className="portfolio-btn">Read Article</button>
          </div>
        </article>
        <div className="related-posts">
          <div className="related-grid">
            <div className="featured-badge">Latest</div>
            {allPosts.map((post: BlogPost) => (
              <article key={post.id} className="related-post">
                <div className="related-image">
                  <img
                    src={post.image || './assets/placeholder.svg'}
                    alt={post.title}
                  />
                </div>
                <div className="related-content">
                  <div className="post-meta">
                    <span className="category">{post.category}</span>
                    <span className="read-time">{post.readTime}</span>
                  </div>
                  <h4 className="related-post-title">{post.title}</h4>
                  <p className="related-excerpt">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portfolioAPI.getBlogPosts({ limit: 7 }).then(({ data }) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading blog posts...</div>;
  if (!posts.length) return <div>No blog posts found.</div>;

  return <BlogList data={posts} />;
};

export default Blog; 