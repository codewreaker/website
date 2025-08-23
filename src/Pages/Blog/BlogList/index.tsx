import { useState } from "react";
import isValidDate from "../../../utils/isValidDate.js";

const BlogLists = ({ data = [] }: { data: BlogLists[] }) => {
  const [focus, setFocus] = useState<boolean>(false);
  return (
    <ul>
      {data.map(({
        title,
        htmlUrl,
        frontMatter,
        content
      }, index) => (
        <li key={title} onMouseEnter={() => setFocus(true)} onMouseLeave={() => setFocus(false)}>
            <span>{isValidDate(frontMatter?.createdAt) ? new Date(frontMatter?.createdAt).toDateString() : ''}</span>
            <h6>{title}</h6>
            <p>{title} ({frontMatter?.category}) - {frontMatter?.tags} </p>
            <p>{frontMatter?.description}</p>
            <p>{content?.substring(0, 200)}</p>
        </li>
      ))}
    </ul>);
}
export default BlogLists;