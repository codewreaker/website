import { useState } from "react";
import isValidDate from "../../../utils/isValidDate.js";

const BlogListItem: React.FC<{
  createdAt?: Date;
  title: string;
  description: string;
  tags?: string[];
  subtitle?: string;
  url?: string;
}> = ({
  createdAt,
  title,
  description,
  tags,
  subtitle,
  url
}) => {
    return (
      <li className="blog-liist-item">
        <a href={url} target="_blank" rel="noopener noreferrer" className="blog-list-link">
          <div className="blog-list-header">
             {/* <span className="experience-subtitle">{subtitle}</span> */}
            <h3 className="blog-list-title">
              {title}
              <svg
                className="external-link"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15,3 21,3 21,9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </h3>
            <div className="right-section">
              <span className="blog-list-date">{isValidDate(createdAt) ? createdAt.toDateString() : new Date('2025-08-17').toDateString()}</span>
              <div className="tech-stack">
                ——
                {tags?.map((tech, index) => (
                  <span key={index} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="blog-list-details">
            <p className="blog-list-description">{description}</p>
          </div>
        </a>
      </li>
    )
  };

const BlogLists = ({ data = [] }: { data: BlogLists[] }) => {
  return (
    <ul className="blog-list gradient-bg">
      {data.map(({
        title,
        htmlUrl,
        frontMatter,
        content
      }, index) => (
        <BlogListItem
          key={title}
          url={htmlUrl}
          createdAt={frontMatter?.createdAt}
          title={title}
          description={frontMatter?.description || content?.substring(2, content.length) || ''}
          tags={frontMatter?.tags}
          subtitle={frontMatter?.category}
        />
      ))}
    </ul>);
}
export default BlogLists;