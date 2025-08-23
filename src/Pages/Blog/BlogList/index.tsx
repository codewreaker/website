import isValidDate from "../../../utils/isValidDate.js";

const BlogLists = ({ data = [] }: { data: BlogLists[] }) => {
  return (
      <ul>
        {data.map(({
          title,
          htmlUrl,
          frontMatter,
          content
        }, index) => (
          <li key={title}>
            <a href={htmlUrl} target="_blank" rel="noopener noreferrer">
              <span>{isValidDate(frontMatter?.createdAt) ? new Date(frontMatter?.createdAt).toDateString():''}</span>
              <p>{title} ({frontMatter?.category}) - {frontMatter?.tags} </p>
              <p>{frontMatter?.description}</p>
              <p>{content?.substring(0, 200)}</p>
            </a>
          </li>
        ))}
      </ul>);
}
export default BlogLists;