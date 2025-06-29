import React from 'react';
import Image from 'next/image';
import { ImageGridData } from '../../types/contentful';
import styles from './ImageGridBlock.module.css';

interface ImageGridBlockProps {
  data: ImageGridData;
}

const ImageGridBlock: React.FC<ImageGridBlockProps> = ({ data }) => {
  return (
    <section className={styles.imageGrid}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {data.images.slice(0, 4).map((image, index) => (
            <div key={image.sys.id} className={styles.gridItem}>
              <Image
                src={image.url}
                alt={image.title}
                width={image.width}
                height={image.height}
                className={styles.image}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGridBlock;