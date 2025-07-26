import { useState, useEffect } from 'react';
import ColorPicker from '../../Components/ColorPicker/index.js';
import {
  MoonIcon as DarkIcon,
  SunIcon as LightIcon,
  PauseIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import './header.css';
import ThemeToggle from './ThemeToggle.js';
import { useAnimation } from '../../context/AnimationContext.js';
import { Link } from '@tanstack/react-router';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}

const navConfig: NavItem[] = [
  { label: 'Projects', href: '#projects' },
  { label: 'CV', href: '#cv' },
  { label: 'Blog', href: '/blog' },
  { label: 'Dev', href: '/playground' },
  {
    label: 'GitHub',
    href: 'https://github.com/codewreaker',
    external: true,
    icon: (
      <svg className="github-icon" viewBox="0 0 24 24" width="20" height="20">
        <path
          fill="currentColor"
          d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"
        />
      </svg>
    ),
  },
  { label: 'Admin', href: '/admin' },
];

const AnimationToggle: React.FC = () => {
  const { skipAnimations, setSkipAnimations } = useAnimation();

  return (
    <ThemeToggle
      onToggle={() => setSkipAnimations(!skipAnimations)}
      isPrimary={skipAnimations}
      primaryIcon={PlayIcon}
      secondaryIcon={PauseIcon}
      tooltip={skipAnimations ? 'Enable animations' : 'Disable animations'}
    />
  );
};

const Header = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check system preference initially
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    setIsDark(prefersDark);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDark ? 'dark' : 'light'
    );
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header" data-theme={isDark ? 'dark' : 'light'}>
      <div className="header-content">
        <a href="/" style={{textDecoration: 'none'}}>
          <div className="logo">
            <span>IP</span>
          </div>
        </a>
        <button
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span
            className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
          ></span>
        </button>

        <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul>
            {navConfig.map((item) => (
              <li key={item.label}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.icon && <span className="nav-icon">{item.icon}</span>}
                    <span className="nav-label">{item.label}</span>
                  </a>
                ) : (
                  <Link to={item.href} className="nav-label">
                    {item.icon && <span className="nav-icon">{item.icon}</span>}
                    <span className="nav-label">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
            <li className="utility-toggle-container">
              <ThemeToggle
                onToggle={toggleTheme}
                isPrimary={isDark}
                primaryIcon={DarkIcon}
                secondaryIcon={LightIcon}
              />
              <ColorPicker
                onChange={(colors: any) => {
                  try {
                    localStorage.setItem('theme-color', JSON.stringify(colors));
                  } catch (error) {
                    console.warn(
                      'Failed to save theme color preference:',
                      error
                    );
                  }
                }}
              />
              <AnimationToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
