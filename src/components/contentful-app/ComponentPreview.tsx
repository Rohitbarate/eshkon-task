'use client';

import React from 'react';
import { LayoutComponent } from '../../types/contentful';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { removeComponent } from '../../store/slices/layoutSlice';
import styles from './ComponentPreview.module.css';

interface ComponentPreviewProps {
  component: LayoutComponent;
}

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ component }) => {
  const dispatch = useAppDispatch();

  const handleRemove = () => {
    dispatch(removeComponent(component.id));
  };

  const renderPreview = () => {
    switch (component.type) {
      case 'hero':
        const heroData = component.data as any;
        return (
          <div className={styles.heroPreview}>
            <div className={styles.heroContent}>
              <h3>{heroData.heading}</h3>
              <p>{heroData.subtitle}</p>
              <button className={styles.previewButton}>{heroData.ctaText}</button>
            </div>
            <div className={styles.heroImage}>
              <img src={heroData.backgroundImage.url} alt={heroData.backgroundImage.title} />
            </div>
          </div>
        );

      case 'twoColumn':
        const twoColData = component.data as any;
        return (
          <div className={styles.twoColumnPreview}>
            <div className={styles.twoColumnLeft}>
              <h4>{twoColData.leftHeading}</h4>
              <p>{twoColData.leftSubtitle}</p>
              <button className={styles.previewButton}>{twoColData.leftCtaText}</button>
            </div>
            <div className={styles.twoColumnRight}>
              <img src={twoColData.rightImage.url} alt={twoColData.rightImage.title} />
            </div>
          </div>
        );

      case 'imageGrid':
        const gridData = component.data as any;
        return (
          <div className={styles.imageGridPreview}>
            {gridData.images.slice(0, 4).map((image: any, index: number) => (
              <div key={index} className={styles.gridItem}>
                <img src={image.url} alt={image.title} />
              </div>
            ))}
          </div>
        );

      default:
        return <div className={styles.unknownPreview}>Unknown component type</div>;
    }
  };

  return (
    <div className={styles.componentPreview}>
      <div className={styles.previewHeader}>
        <span className={styles.componentType}>{component.type}</span>
        <button
          onClick={handleRemove}
          className={styles.removeButton}
          title="Remove component"
        >
          ×
        </button>
      </div>
      <div className={styles.previewContent}>
        {renderPreview()}
      </div>
    </div>
  );
};

export default ComponentPreview;