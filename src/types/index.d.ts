// Type Definitions
interface Link {
  label: "GitHub" | "LinkedIn" | "Email" | "Instagram"
  url: string
}


interface EducationItem {
  period: string;
  title: string;
  school: string;
  description: string;
  fields: string[];
  subtitles: string[];
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


// TypeScript interfaces for HomeData structure

interface LinkItem {
  label: "GitHub" | "LinkedIn" | "Email" | "Instagram";
  url: string;
}

interface Bio {
  name: string;
  title: string;
  description: string;
  links: LinkItem[];
}

interface Project {
  name: string;
  description: string;
  path: string;
  key: string;
}

interface HomeData {
  bio: Bio;
  projects: Project[];
  experiences: ExperienceData;
  blogList: BlogLists[];
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

interface GithubFile {
  type: 'file' | 'dir' | 'symlink' | 'submodule' | 'blob';
  name: string;
  path: string;
  download_url: string;
  html_url: string;
  size: number;
  sha: string;
}

type BlogFrontMatter = Partial<{
  title: string;
  description: string;
  pageType: string;
  sidebar: boolean;
  category: string;
  image: {
    external: boolean;
    alt: string;
    url: string;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
  featured: boolean;
}>;
interface BlogLists {
  metadata: GithubFile;
  htmlUrl: string;
  title: string;
  extension: string;
  content: string;
  frontMatter: BlogFrontMatter;
}



type Results = [Bio, Project[], ExperienceData, BlogLists[]];