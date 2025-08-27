import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  noIndex?: boolean;
  canonical?: string;
}

export const SEOHead: React.FC<SEOProps> = ({
  title = 'Watcher - Incident Reporting System',
  description = 'A comprehensive incident reporting system for modern organizations. Streamline communication and resolution workflows across different departments.',
  keywords = ['incident reporting', 'business management', 'workflow', 'enterprise software', 'security', 'IT management'],
  image = '/og-image.png',
  url = '',
  type = 'website',
  author = 'Watcher Team',
  publishedTime,
  modifiedTime,
  section,
  noIndex = false,
  canonical
}) => {
  const fullTitle = title === 'Watcher - Incident Reporting System' ? title : `${title} | Watcher`;
  const siteUrl = window.location.origin;
  const fullUrl = url ? `${siteUrl}${url}` : window.location.href;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      
      {/* Viewport and Character Set */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical || fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Watcher" />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {keywords.map((keyword, index) => (
            <meta key={index} property="article:tag" content={keyword} />
          ))}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:creator" content="@WatcherApp" />
      <meta name="twitter:site" content="@WatcherApp" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="application-name" content="Watcher" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': 'Watcher',
          'description': description,
          'url': fullUrl,
          'applicationCategory': 'BusinessApplication',
          'operatingSystem': 'Web',
          'author': {
            '@type': 'Organization',
            'name': 'Watcher Team'
          },
          'offers': {
            '@type': 'Offer',
            'category': 'Enterprise Software'
          },
          'featureList': [
            'Incident Reporting',
            'Real-time Dashboard',
            'Multi-Role Authentication',
            'Analytics and Reporting',
            'Notification System'
          ],
          'screenshot': fullImageUrl
        })}
      </script>
    </Helmet>
  );
};

// Pre-configured SEO components for common pages
export const DashboardSEO = () => (
  <SEOHead
    title="Dashboard"
    description="Monitor and track incidents across your organization with real-time analytics and insights."
    url="/dashboard"
    keywords={['dashboard', 'analytics', 'incident monitoring', 'real-time']}
  />
);

export const IncidentsSEO = () => (
  <SEOHead
    title="Incidents"
    description="View and manage all incident reports. Filter, search, and track incident resolution across departments."
    url="/incidents"
    keywords={['incidents', 'incident management', 'reports', 'tracking']}
  />
);

export const AnalyticsSEO = () => (
  <SEOHead
    title="Analytics"
    description="Comprehensive insights into incident patterns and performance metrics with detailed analytics and reporting."
    url="/analytics"
    keywords={['analytics', 'insights', 'performance metrics', 'incident trends']}
  />
);

export const ReportsSEO = () => (
  <SEOHead
    title="Reports"
    description="Generate and export detailed incident reports with filtering and export capabilities."
    url="/reports"
    keywords={['reports', 'export', 'incident data', 'business intelligence']}
  />
);

export const ReportIncidentSEO = () => (
  <SEOHead
    title="Report Incident"
    description="Submit a new incident report quickly and efficiently with our streamlined reporting system."
    url="/report"
    keywords={['report incident', 'submit report', 'incident reporting', 'new incident']}
  />
);
