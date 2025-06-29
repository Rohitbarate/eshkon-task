import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableProps {
  id: string;
  children: (provided: {
    innerRef: (element: HTMLElement | null) => void;
    droppableProps: Record<string, any>;
    placeholder?: React.ReactNode;
  }, snapshot: { isDraggingOver: boolean }) => React.ReactNode;
  isDropDisabled?: boolean;
}

export function Droppable({ id, children, isDropDisabled = false }: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled: isDropDisabled,
  });

  const provided = {
    innerRef: setNodeRef,
    droppableProps: {
      'data-droppable-id': id,
    },
    placeholder: null,
  };

  const snapshot = {
    isDraggingOver: isOver,
  };

  return <>{children(provided, snapshot)}</>;
}