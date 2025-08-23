import './blog.css';
import GeometricCard from '../../Components/GeometricCard/index.js';
import useIsMobile from '../../utils/hooks/useIsMobile.js';

import BlogLists from './BlogList/index.js';
// Blog Section Component
const Blog = ({ data = [] }: { data: BlogLists[] }) => {
  const isMobile = useIsMobile();

  // Featured blog post 
  const fp = data.find(({ frontMatter }) => frontMatter?.featured) || data[0];


  return (
    <div id="blog" className="blog-container">
      <div className="blog-header">
        <h1 className="blog-title">Blog</h1>
      </div>
      <div className="blog-content">
        <article className="blog-posts">
          <div className="featured-blog-post">
            <div className="featured-blog-content">
              {fp && <div className="featured-blog-header">
                <div className="featured-blog-meta">
                  <span className="featured-date">Featured Post • {new Date(fp.frontMatter?.createdAt || '').toDateString()}</span>
                </div>
                <h2 className="featured-blog-title">{fp.title}</h2>
                <p className="featured-blog-description">
                  {fp.frontMatter?.description}
                </p>
              </div>}
              <div className="featured-blog-footer">
                <a
                  href={fp?.htmlUrl || "https://blog.israelprempeh.com/blog/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="featured-blog-link"
                >
                  Read More
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </article>
        <GeometricCard
          heading={''}
          title={'All Posts 🖋️'}
          action={'Go to Blog'}
          tagline={[
            `Hey there! This is where I document my adventures in the world of technology.`,
            'Exploring the intersection of code, creativity, and problem-solving. I write about software development, emerging technologies, and the lessons learned from building things that matter'
          ].join('\n')}
          //customStyle={{ width: 360 }}
          onClick={() => window.open('https://blog.israelprempeh.com', '_blank')}
        />
      </div>
      <BlogLists data={data} />
    </div>
  );
};

export default Blog;