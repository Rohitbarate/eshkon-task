"use client";

import React from "react";
import styles from "./ComponentPalette.module.css";
import { Draggable } from "../Draggable";

const ComponentPalette: React.FC = () => {
  const componentTypes = [
    {
      id: "hero",
      name: "Hero Block",
      description: "Large banner with heading, subtitle, and CTA",
      icon: "🦸",
    },
    {
      id: "twoColumn",
      name: "Two Column Row",
      description: "Content on left, image on right",
      icon: "📦",
    },
    {
      id: "imageGrid",
      name: "2x2 Image Grid",
      description: "Four images in a grid layout",
      icon: "🖼️",
    },
  ];

  return (
    <div className={styles.blockPalette}>
      {componentTypes.map((component, index) => (
        <Draggable
          key={component.id}
          id={component.id}
          index={index}
          sortable={false}
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`${styles.paletteItem} ${
                snapshot.isDragging ? styles.paletteItemDragging : ""
              }`}
            >
              <div className={styles.componentIcon}>{component.icon}</div>
              <div className={styles.componentInfo}>
                <h4 className={styles.componentName}>{component.name}</h4>
                <p className={styles.componentDescription}>
                  {component.description}
                </p>
              </div>
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};

export default ComponentPalette;
