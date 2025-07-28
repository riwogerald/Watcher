import React from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_CONFIG } from '../../constants';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

export function SEO({
  title,
  description = APP_CONFIG.description,
  keywords = ['incident', 'reporting', 'system', 'management'],
  image = '/og-image.png',
  url = window.location.href,
  type = 'website',
  noIndex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${APP_CONFIG.name}` : APP_CONFIG.name;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={APP_CONFIG.name} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional meta tags */}
      <meta name="application-name" content={APP_CONFIG.name} />
      <meta name="theme-color" content="#2563eb" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={APP_CONFIG.name} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
