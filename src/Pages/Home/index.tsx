'use client';

import { useMemo, useEffect, useState } from 'react';
import type React from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { SpeechBubble } from '../../Components/SpeechBubble/index.js';
import Terminal from '../../Components/Terminal/index.js';
import GeometricCard from '../../Components/GeometricCard/index.js';
import { scrollToSection } from '../../utils/scrollToSection.js';
import { formatDate } from '../../utils/formatDate.js';

import { portfolioAPI } from '../../mock-service/api.js';

import useProgressLoader, {
  ProgressLoaderState,
  ProgressStep,
} from '../../Components/Loader/useProgressLoader.js';
import ProgressLoader from '../../Components/Loader/ProgressLoader.js';

import './home.css';
import { useAnimation } from '../../context/AnimationContext.js';

// Icon Components
const GitHubIcon = ({
  width = 20,
  height = 20,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInIcon = ({
  width = 20,
  height = 20,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const InstagramIcon = ({
  width = 20,
  height = 20,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

// Social Links Component
interface SocialLinksProps {
  links: Link[];
}

const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => {
  const iconMap: Record<Link['label'], React.ElementType> = {
    GitHub: GitHubIcon,
    LinkedIn: LinkedInIcon,
    Email: EnvelopeIcon,
    Instagram: InstagramIcon,
  };

  return (
    <div className="social-links">
      {links.map((link) => {
        const Icon = iconMap[link.label];
        return (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {Icon && (
              <Icon
                width={22}
                height={22}
                style={{ verticalAlign: 'middle', marginRight: 6 }}
              />
            )}
            <SpeechBubble className="social-tooltip" direction="top">
              {link.label}
            </SpeechBubble>
          </a>
        );
      })}
    </div>
  );
};

// Animation Toggle Component

// Hero Section Component
const Hero: React.FC<{ data: Bio }> = ({ data }) => {
  const { skipAnimations } = useAnimation();

  const animClx = (baseClass: string) => {
    return skipAnimations
      ? baseClass.replace(/animate-|fade-in/g, '')
      : baseClass;
  };

  return (
    <div className="portfolio-hero">
      <div className="portfolio-intro">
        <SpeechBubble direction="bottom">Hello I'm</SpeechBubble>
        <h1 className="portfolio-name">{data?.name}</h1>
      </div>

      <div
        className={`portfolio-hero-content gradient-bg ${animClx('fade-in')}`}
      >
        <div className="portfolio-hero-main">
          <div className="portfolio-title">{data?.title}</div>
          <div className="portfolio-description">{data?.description}</div>
          <SocialLinks links={data?.links} />
          <div className="portfolio-hero-actions">
            <button
              className="portfolio-btn"
              onClick={() => (window.location.href = '#projects')}
            >
              Projects
            </button>
            <div className="signature-container">
              <img src="./assets/signature.png" alt="signature" />
            </div>
          </div>
        </div>

        <div className="portfolio-avatar">
          <div className="electrons">
            <img
              src="assets/python.png"
              alt="Python Icon"
              className={`portfolio-asset asset-python ${animClx(
                'animate-float-x'
              )}`}
            />
            <img
              src="assets/typescript.png"
              alt="TypeScript"
              className={`portfolio-asset asset-typescript ${animClx(
                'animate-float-y-rotate'
              )}`}
            />
            <img
              src="assets/rust.png"
              alt="Rust"
              className={`portfolio-asset asset-rust ${animClx(
                'animate-float-y'
              )}`}
            />
          </div>
          <div className="circular-mask">
            <img
              src="assets/bandw.jpeg"
              alt="avatar"
              height={'100%'}
              className={animClx('animate-float-y-scale')}
            />
          </div>
        </div>
      </div>
      <div
        className="scroll-indicator"
        onClick={scrollToSection('projects', null, 100)}
      >
        <img src="./assets/scroll-lottie.gif" alt="scroll" />
      </div>
    </div>
  );
};

// Projects Section Component
const Projects: React.FC<{ data: Project[] }> = ({ data }) => {
  const { skipAnimations } = useAnimation();

  return (
    <div
      id="projects"
      className={`portfolio-projects gradient-bg ${
        skipAnimations ? '' : 'fade-in-up'
      }`}
    >
      <GeometricCard
        heading={'Developer'}
        title={'Projects'}
        action={'See All'}
        tagline={'by Me'}
        customStyle={{ width: 360 }}
        onClick={() => window.open('https://github.com/codewreaker/', '_blank')}
      />
      <Terminal tabProjects={data} />
    </div>
  );
};

const ExperienceItemComponent: React.FC<ExperienceItem> = ({
  period,
  title,
  company,
  description,
  techStack,
  subtitles,
}) => (
  <div className="experience-item">
    <div className="experience-header">
      <div className="experience-period">{period}</div>
      <div className="experience-details">
        <h3 className="experience-title">
          {title} · {company}
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
        {subtitles?.map((subtitle, index) => (
          <div key={index} className="experience-subtitle">
            {subtitle}
          </div>
        ))}
        <p className="experience-description">{description}</p>
        <div className="tech-stack">
          {techStack.map((tech, index) => (
            <span key={index} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// CV Section Component
const CVSection: React.FC<{ data: ResumeProps }> = ({ data }) => {
  const { education, experience } = data;
  const [activeSection, setActiveSection] = useState('about');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [seeMore, setSeeMore] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 430);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Helper to render subtitle with See More
  const renderSubtitle = () => (
    <>
      <p className={`subtitle${seeMore ? ' see-more' : ''}`}>
        Versatile <span className="highlight">full-stack developer</span>{' '}
        specialising in <span className="highlight">front-end</span>{' '}
        technologies with added skill in{' '}
        <span className="highlight">UI/UX</span> design. I have over{' '}
        <span className="highlight">{calculateYearsOfExperience()} years</span>{' '}
        experience in <span className="highlight">FinTech</span>,{' '}
        <span className="highlight">Architecting</span> UIs that handle
        extensive, <span className="highlight">high-frequency</span> data. Most
        of my work is in <span className="highlight">JavaScript</span>,{' '}
        <span className="highlight">Typescript</span>,{' '}
        <span className="highlight">React</span> for the front-end and{' '}
        <span className="highlight">Python</span> for the backend. A curious
        learner willing to take on new challenges, and work within
        high-functioning teams while bringing on my garnered expertise and
        delivering <br />
        high-performance products to fulfil{' '}
        <span className="highlight">business</span> needs.
        <br />I am currently learning <span className="highlight">Rust</span> to
        expand my skill set in <span className="highlight">WebAssembly</span>
      </p>
      {isMobile && (
        <button
          className="see-more-btn"
          onClick={() => setSeeMore((v) => !v)}
          aria-expanded={seeMore}
        >
          {seeMore ? 'See Less' : 'See More'}
        </button>
      )}
    </>
  );

  return (
    <div id="cv" className="cv-container">
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}>
          <div className="sidebar open" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-content">
              <div className="header-section">
                <h1 className="name">Curriculum Vitae</h1>
                <h2 className="title">Front End Engineer</h2>
                {renderSubtitle()}
              </div>

              <nav className="navigation">
                <ul>
                  <li>
                    <button
                      className={`nav-link ${
                        activeSection === 'experience' ? 'active' : ''
                      }`}
                      onClick={scrollToSection('experience', setActiveSection)}
                    >
                      <span className="nav-indicator"></span>
                      <span className="nav-text">EXPERIENCE</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`nav-link ${
                        activeSection === 'education' ? 'active' : ''
                      }`}
                      onClick={scrollToSection('education', setActiveSection)}
                    >
                      <span className="nav-indicator"></span>
                      <span className="nav-text">EDUCATION</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`nav-link ${
                        activeSection === 'volunteering' ? 'active' : ''
                      }`}
                      onClick={scrollToSection(
                        'volunteering',
                        setActiveSection
                      )}
                    >
                      <span className="nav-indicator"></span>
                      <span className="nav-text">Volunteering</span>
                    </button>
                  </li>
                </ul>
              </nav>
              <a className="portfolio-btn" href="/cv-2025.pdf" download>
                Download CV
              </a>
            </div>
          </div>
        </div>
      )}
      {(!isMobile || !sidebarOpen) && (
        <div className="sidebar">
          <div className="sidebar-content">
            <div className="header-section">
              <h1 className="name">Curriculum Vitae</h1>
              <h2 className="title">Front End Engineer</h2>
              {renderSubtitle()}
            </div>

            <nav className="navigation">
              <ul>
                <li>
                  <button
                    className={`nav-link ${
                      activeSection === 'experience' ? 'active' : ''
                    }`}
                    onClick={scrollToSection('experience', setActiveSection)}
                  >
                    <span className="nav-indicator"></span>
                    <span className="nav-text">EXPERIENCE</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`nav-link ${
                      activeSection === 'education' ? 'active' : ''
                    }`}
                    onClick={scrollToSection('education', setActiveSection)}
                  >
                    <span className="nav-indicator"></span>
                    <span className="nav-text">EDUCATION</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`nav-link ${
                      activeSection === 'volunteering' ? 'active' : ''
                    }`}
                    onClick={scrollToSection('volunteering', setActiveSection)}
                  >
                    <span className="nav-indicator"></span>
                    <span className="nav-text">Volunteering</span>
                  </button>
                </li>
              </ul>
            </nav>
            <a
              href="/cv-2025.pdf"
              style={{ alignSelf: 'center' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="portfolio-btn">Download CV</button>
            </a>
          </div>
        </div>
      )}

      <div className="main-content">
        <section id="experience" className="content-section">
          {experience.map((item, index) => (
            <ExperienceItemComponent
              key={index}
              period={item.period}
              title={item.title}
              company={item.company}
              description={item.description}
              techStack={item.techStack}
              subtitles={item.subtitles}
            />
          ))}
        </section>

        <section id="education" className="content-section">
          <h2 className="experience-title">Education</h2>
          {education?.map((item, index) => (
            <ExperienceItemComponent
              key={index}
              period={item.period}
              title={item.title}
              company={item.school}
              description={item.description}
              techStack={item.fields}
              subtitles={item.subtitles}
            />
          ))}
        </section>

        <section id="volunteering" className="content-section">
          <h2 className="experience-title">Volunteering</h2>
          <ExperienceItemComponent
            key={0}
            period={''}
            title={'Africa and Campus Recruitment Program - Bank of America'}
            company={''}
            description={`
Mentored and helped coordinate campus recruitment efforts within Bank of America technology with a focus on
African and London university candidates. This program was overseen by the CTO.
`}
            techStack={['Ghana', 'London', 'Nigeria']}
            subtitles={[]}
          />
        </section>
      </div>
    </div>
  );
};

// Blog Section Component
const BlogList: React.FC<{ data: BlogPost[] }> = ({ data }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 480);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const featuredPost = data.find((post) => post.featured) || data[0];
  const allPosts = data.filter((post) => post.id !== featuredPost.id);
  const previewPosts = allPosts.slice(0, 4);

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
            {isMobile && (
              <div className="blog-preview-scroll">
                {previewPosts.map((post) => (
                  <div className="blog-preview-item" key={post.id}>
                    <div className="blog-preview-image">
                      <img
                        src={post.image || './assets/placeholder.svg'}
                        alt={post.title}
                      />
                    </div>
                    <div className="blog-preview-title">{post.title}</div>
                  </div>
                ))}
                <button className="see-more-blogs-btn">
                  <span className="see-more-icon">→</span>
                </button>
              </div>
            )}
            {!isMobile && (
              <button className="portfolio-btn">Read Article</button>
            )}
          </div>
        </article>

        {!isMobile && (
          <div className="related-posts">
            <div className="related-grid">
              <div className="featured-badge">Latest</div>
              {allPosts.map((post) => (
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
        )}
      </div>
    </div>
  );
};

// Calculate years of experience since July 2015
const calculateYearsOfExperience = (start = '2015-07-01') => {
  const startDate = new Date(start);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
  return diffYears;
};

type Results = [Bio, Project[], BlogPost[], ResumeProps];

const getLocalState = () => {
  const stored = localStorage.getItem('isLoading');
  if (stored === null) return false;
  if (stored === 'true') return true;
  if (stored === 'false') return false;
  return false;
};

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(getLocalState());
  const [homePage, setHomePage] = useState<HomeData>({
    bio: { name: 'loading', description: '...', links: [], title: '...' },
    blogPosts: [],
    experiences: { education: [], experience: [] },
    projects: [],
  });

  // Memoize steps to prevent recreation on every render
  const steps = useMemo<ProgressStep<Results>[]>(
    () => [
      {
        name: 'Loading bio...',
        action: () => portfolioAPI.getBio().then(({ data }) => data),
      },
      {
        name: 'Fetching projects...',
        action: () => portfolioAPI.getProjects().then(({ data }) => data),
      },
      {
        name: 'Getting blog posts...',
        action: () =>
          portfolioAPI.getBlogPosts({ limit: 7 }).then(({ data }) => data),
      },
      {
        name: 'Loading experience...',
        action: () => portfolioAPI.getExperience().then(({ data }) => data),
      },
    ],
    []
  );

  const handleComplete = (results: Results, state: ProgressLoaderState) => {
    // Safely destructure results with fallbacks
    const [bio, projects, blogPosts, experiences] = results;
    setHomePage({ bio, projects, blogPosts, experiences });
    setTimeout(() => {
      localStorage.setItem('isLoading', JSON.stringify(false));
      setIsLoading(false);
    }, 0);
  };

  const handleStep = (index: number, step: ProgressStep, result: any) => {
    console.log(`Step ${index + 1} completed:`, step.name, result);
  };

  // Use the custom hook
  const progressState = useProgressLoader({
    steps,
    onComplete: handleComplete,
    onStep: handleStep,
    autoStart: true,
    delay: 40,
  });

  // Show loader while loading
  if (isLoading) {
    return (
      <ProgressLoader
        state={progressState}
        title="Loading Portfolio"
        subtitle="Fetching your content..."
      />
    );
  }

  // Show error state if there's an error
  if (progressState.error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          color: '#ef474a',
          textAlign: 'center',
        }}
      >
        <h2>Something went wrong</h2>
        <p>{progressState.error?.message}</p>
        <button
          onClick={progressState.reset}
          style={{
            padding: '10px 20px',
            background: '#ff6a1a',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '1rem',
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <Hero data={homePage.bio} />
      <Projects data={homePage.projects} />
      <CVSection data={homePage.experiences} />
      <p className="quote">
        The only way to do great work is to love what you do.{' '}
        <span className="highlight"> — Steve Jobs</span>
      </p>
      <BlogList data={homePage.blogPosts} />
    </>
  );
};

export default Home;
