// Type Definitions
interface Link {
  label: "GitHub" | "LinkedIn" | "Email" | "Instagram"
  url: string
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

interface ResumeProps {
  education: EducationItem[];
  experience: ExperienceItem[];
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
  company: string;
  description: string;
  techStack: string[];
  subtitles: string[];
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
  experiences: ResumeProps;
  blogPosts: BlogPost[];
}