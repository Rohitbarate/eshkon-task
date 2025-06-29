import React from 'react';
import Link from 'next/link';
import Navigation from '../components/layout/Navigation';
import styles from './HomePage.module.css';

export default function Home() {
  return (
    <>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.hero}>
            <h1 className={styles.title}>
              Contentful Page Builder
            </h1>
            <p className={styles.subtitle}>
              Build beautiful landing pages with our drag-and-drop interface.
              Create, customize, and publish content visually.
            </p>
            
            <div className={styles.buttons}>
              <Link href="/contentful-app" className={styles.primaryButton}>
                Open Page Builder
              </Link>
              <Link href="/landing/page-1" className={styles.secondaryButton}>
                View Demo Page
              </Link>
            </div>
          </div>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>Drag & Drop</h3>
              <p>Intuitive visual editor with drag-and-drop functionality</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚡</div>
              <h3>Fast & Responsive</h3>
              <p>Optimized for performance with responsive design</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔧</div>
              <h3>Contentful Integration</h3>
              <p>Seamlessly integrates with your Contentful workflow</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}