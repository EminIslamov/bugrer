import classNames from 'classnames';

import { Modal } from '@/components/ui/modal/modal';

import styles from './ingredients-detail-modal.module.css';

export const IngredientsDetailModal = ({
  imageLarge,
  name,
  calories,
  proteins,
  fat,
  carbohydrates,
  onClose,
}) => {
  return (
    <Modal onClose={onClose}>
      <div className="pb-15">
        <h2
          className={classNames(
            styles.ingredient_modal_title,
            'p-10 text text_type_main-large'
          )}
        >
          Детали ингредиента
        </h2>
        <div className={styles.ingredient_modal_content}>
          <img src={imageLarge} alt={name} />
          <p className="text text_type_main-medium">{name}</p>

          <div
            className={classNames(
              styles.cpfc_details,
              'text text_type_main-default text_color_inactive '
            )}
          >
            <div className={styles.cpfc_details_item}>
              <p>Калории,ккал</p>
              <p>{calories}</p>
            </div>
            <div className={styles.cpfc_details_item}>
              <p>Белки, г</p>
              <p>{proteins}</p>
            </div>
            <div className={styles.cpfc_details_item}>
              <p>Жиры, г</p>
              <p>{fat}</p>
            </div>
            <div className={styles.cpfc_details_item}>
              <p>Углеводы, г</p>
              <p>{carbohydrates}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
