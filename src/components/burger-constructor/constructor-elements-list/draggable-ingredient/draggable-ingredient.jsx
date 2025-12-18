import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';

import { ConstructorIngredientType } from '@/utils/types';
import {
  moveIngredient,
  removeIngredient,
} from '@services/slices/burgerConstructorSlice';

import styles from './draggable-ingredient.module.css';

export const DraggableIngredient = ({ ingredient, index }) => {
  const dispatch = useDispatch();
  const ref = useRef(null);

  // useDrop для определения позиции куда бросить
  const [{ handlerId }, drop] = useDrop({
    accept: 'constructor-ingredient',
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Не заменяем элемент сам на себя
      if (dragIndex === hoverIndex) {
        return;
      }

      // Определяем границы элемента
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Получаем середину элемента по вертикали
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Позиция курсора
      const clientOffset = monitor.getClientOffset();

      // Позиция курсора относительно верха элемента
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Перемещаем только когда курсор пересёк половину высоты элемента
      // При перетаскивании вниз — только когда курсор ниже 50%
      // При перетаскивании вверх — только когда курсор выше 50%
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Выполняем перемещение
      dispatch(moveIngredient({ fromIndex: dragIndex, toIndex: hoverIndex }));

      // Важно: мутируем item.index для оптимизации
      // чтобы избежать повторных перемещений
      item.index = hoverIndex;
    },
  });

  // useDrag для перетаскивания
  const [{ isDragging }, drag] = useDrag({
    type: 'constructor-ingredient',
    item: () => {
      return { uniqueId: ingredient.uniqueId, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Объединяем drag и drop ref
  drag(drop(ref));

  const handleRemove = () => {
    dispatch(removeIngredient(ingredient.uniqueId));
  };

  return (
    <li
      ref={ref}
      className={classNames(styles.draggable_item, {
        [styles.dragging]: isDragging,
      })}
      data-handler-id={handlerId}
    >
      <DragIcon type="primary" />
      <span className={styles.constructor_element}>
        <ConstructorElement
          price={ingredient.price}
          text={ingredient.name}
          thumbnail={ingredient.image}
          handleClose={handleRemove}
        />
      </span>
    </li>
  );
};

DraggableIngredient.propTypes = {
  index: PropTypes.number.isRequired,
  ingredient: ConstructorIngredientType.isRequired,
};
