import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TodoItem from './TodoItem';

export default function SortableTodoItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.todo.id });

  return (
    <TodoItem
      {...props}
      containerRef={setNodeRef}
      containerStyle={{ transform: CSS.Translate.toString(transform), transition }}
      isDragging={isDragging}
      dragHandleProps={{ ref: setActivatorNodeRef, ...attributes, ...listeners }}
    />
  );
}
