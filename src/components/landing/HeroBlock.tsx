import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeroData } from '../../types/contentful';
import styles from './HeroBlock.module.css';

interface HeroBlockProps {
  data: HeroData;
}

const HeroBlock: React.FC<HeroBlockProps> = ({ data }) => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground}>
        <Image
          src={data.backgroundImage.url}
          alt={data.backgroundImage.title}
          fill
          className={styles.heroImage}
          priority
          sizes="100vw"
        />
        <div className={styles.heroOverlay} />
      </div>
      
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroHeading}>{data.heading}</h1>
          <p className={styles.heroSubtitle}>{data.subtitle}</p>
          <Link href={data.ctaUrl} className={styles.heroButton}>
            {data.ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroBlock;