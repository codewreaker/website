// api/send-email.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import setCors from '../src/utils/set-cors';


export default async function handler(req: VercelRequest, res: VercelResponse) {
    //HANDLE CORS
    setCors(req, res);
    console.log('req');
    console.dir(req);
    console.log('res');
    console.dir(res);
    return res.status(200).json({ message: 'Request received' });
}


/**
 * Fetches a list of Markdown and MDX files from a GitHub repository
 * @param {string} owner - GitHub username/organization
 * @param {string} repo - Repository name
 * @param {string} path - Path to the directory containing the files
 * @param {string} [branch='main'] - Branch name (defaults to 'main')
 * @returns {Promise<Array>} Array of file objects with metadata
 */
async function fetchBlogFiles(owner, repo, path, branch = 'main') {
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

        const files = await response.json();

        // Filter for .md and .mdx files only
        const blogFiles = files
            .filter(file =>
                file.type === 'file' &&
                (file.name.endsWith('.md') || file.name.endsWith('.mdx'))
            )
            .map(file => ({
                name: file.name,
                path: file.path,
                downloadUrl: file.download_url,
                htmlUrl: file.html_url,
                size: file.size,
                sha: file.sha,
                lastModified: file.last_modified || null,
                // Extract title from filename (remove extension)
                title: file.name.replace(/\.(md|mdx)$/, ''),
                // File extension
                extension: file.name.split('.').pop()
            }));

        return blogFiles;
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
async function fetchBlogContent(downloadUrl) {
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

// Usage example for your specific repository
async function getBlogList() {
    try {
        const blogs = await fetchBlogFiles(
            'codewreaker',     // owner
            'blogs',           // repo
            'docs/blog'        // path
        );

        console.log('Found blog files:', blogs);
        return blogs;
    } catch (error) {
        console.error('Failed to get blog list:', error);
        return [];
    }
}

// Example: Get blog list and fetch content of first blog
async function exampleUsage() {
    try {
        // Get list of blog files
        const blogFiles = await getBlogList();

        if (blogFiles.length > 0) {
            console.log(`Found ${blogFiles.length} blog files`);

            // Fetch content of the first blog
            const firstBlog = blogFiles[0];
            console.log(`Fetching content for: ${firstBlog.name}`);

            const content = await fetchBlogContent(firstBlog.downloadUrl);
            console.log('Blog content preview:', content.substring(0, 200) + '...');
        } else {
            console.log('No blog files found');
        }
    } catch (error) {
        console.error('Example usage failed:', error);
    }
}

// Export functions for use in modules
// export { fetchBlogFiles, fetchBlogContent, getBlogList };

// Uncomment the line below to run the example
// exampleUsage();