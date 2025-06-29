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
        </div>
      </main>
    </>
  );
}