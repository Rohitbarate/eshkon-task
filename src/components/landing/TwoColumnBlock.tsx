import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TwoColumnData } from '../../types/contentful';
import styles from './TwoColumnBlock.module.css';

interface TwoColumnBlockProps {
  data: TwoColumnData;
}

const TwoColumnBlock: React.FC<TwoColumnBlockProps> = ({ data }) => {
  return (
    <section className={styles.twoColumn}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.leftColumn}>
            <h2 className={styles.heading}>{data.leftHeading}</h2>
            <p className={styles.subtitle}>{data.leftSubtitle}</p>
            <Link href={data.leftCtaUrl} className={styles.button}>
              {data.leftCtaText}
            </Link>
          </div>
          
          <div className={styles.rightColumn}>
            <div className={styles.imageContainer}>
              <Image
                src={data.rightImage.url}
                alt={data.rightImage.title}
                width={data.rightImage.width}
                height={data.rightImage.height}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwoColumnBlock;