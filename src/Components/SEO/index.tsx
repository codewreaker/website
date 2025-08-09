import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  author?: string;
  type?: string;
  published?: string;
  modified?: string;
}

export default function SEO({
  title = 'Israel Prempeh | Full Stack Developer',
  description = 'Portfolio of Israel Prempeh, a Full Stack Developer specializing in React, TypeScript, and modern web technologies. Explore his projects, experience, and blog.',
  image = 'https://www.israelagyeman.com/assets/bandw.jpeg',
  url = 'https://www.israelagyeman.com/',
  author = 'Israel Prempeh',
  type = 'website',
  published,
  modified,
}: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      metaDescription.content = description;
      document.head.appendChild(metaDescription);
    }

    // Update or create meta tags
    const metaTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: type },
      { property: 'twitter:title', content: title },
      { property: 'twitter:description', content: description },
      { property: 'twitter:image', content: image },
      { name: 'author', content: author },
    ];

    metaTags.forEach(tagData => {
      const selector = tagData.property 
        ? `meta[property="${tagData.property}"]` 
        : `meta[name="${tagData.name}"]`;
      let element = document.querySelector(selector);
      
      if (element) {
        const key = tagData.property ? 'content' : 'content';
        element.setAttribute(key, tagData.content);
      } else {
        element = document.createElement('meta');
        if (tagData.property) {
          element.setAttribute('property', tagData.property);
        } else {
          element.setAttribute('name', tagData?.name || 'author');
        }
        element.setAttribute('content', tagData.content);
        document.head.appendChild(element);
      }
    });

    // Add structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Israel Prempeh",
      "url": "https://www.israelagyeman.com/",
      "image": "https://www.israelagyeman.com/assets/bandw.jpeg",
      "sameAs": [
        "https://github.com/codewreaker",
        "https://linkedin.com/in/israelprempeh",
        "https://instagram.com/israel.prempeh"
      ],
      "jobTitle": "Full Stack Developer",
      "worksFor": {
        "@type": "Organization",
        "name": "RBC Capital Markets"
      },
      "description": "Full Stack Developer specializing in React, TypeScript, and modern web technologies"
    };

    // Add structured data to head
    let structuredDataScript = document.querySelector('#structured-data') as HTMLScriptElement;
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.id = 'structured-data';
      structuredDataScript.type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData);
  }, [title, description, image, url, author, type]);

  return null;
}