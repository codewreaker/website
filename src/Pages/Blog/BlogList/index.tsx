import { useState, useRef, UIEvent } from "react";
import isValidDate from "../../../utils/isValidDate.js";
import { motion, useInView } from "framer-motion";
import "./blog-list.css";

const BlogListItem: React.FC<{
  createdAt?: Date;
  title: string;
  description: string;
  tags?: string[];
  subtitle?: string;
  url?: string;
  delay?: number;
}> = ({
  createdAt,
  title,
  description,
  tags,
  subtitle,
  url,
  delay = 0
}) => {
    const ref = useRef<HTMLLIElement>(null);
    const inView = useInView(ref, { amount: 0.5, once: true });

    return (
      <motion.li
        ref={ref}
        className="blog-liist-item"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
        transition={{ duration: 0.3, delay }}
      >
        <a href={url} target="_blank" rel="noopener noreferrer" className="blog-list-link">
          <div className="blog-list-header">
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
              {/* <span className="experience-subtitle">{subtitle}</span> */}
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
      </motion.li>
    )
  };

const BlogLists = ({ data = [] }: { data: BlogLists[] }) => {
  const listRef = useRef<HTMLUListElement>(null);
  const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);

  const handleScroll = (e: UIEvent<HTMLUListElement>) => {
    const target = e.target as HTMLUListElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(
      scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1)
    );
  };

  return (
    <div className="blog-list-container">
      <motion.ul
        ref={listRef}
        className="blog-list gradient-bg"
        onScroll={handleScroll}
      >
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
      </motion.ul>
      {<>
        <div
          className="top-gradient"
          style={{ opacity: topGradientOpacity }}
        ></div>
        <div
          className="bottom-gradient"
          style={{ opacity: bottomGradientOpacity }}
        ></div>
      </>}
    </div>
  );
}

export default BlogLists;