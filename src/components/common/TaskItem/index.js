import React from 'react';
import { LOCATION_TYPES } from '../../../constants/warehouseLocation';
import { useHistory } from 'react-router-dom';
import './style.scss';
import { TASK } from '../../../constants/pathNames';

const TaskItem = ({ item }) => {
  const history = useHistory();

  const getLocationName = (location) => {
    if (
      location.location_type_id === LOCATION_TYPES.DOCK
      || location.location_type_id.id === LOCATION_TYPES.UNLOAD_DOCK
    ) {
      return `${location.aisle}-${location.id}`;
    }

    return `${location.aisle}-${location.bay}-${location.level}`;
  };

  const getSupplyRelocationView = () => {
    const supplyPallet = item.task.supply_pallet[0];

    return (
      <>
        <div className="title">
          Перемещение {supplyPallet.product.name} в {getLocationName(supplyPallet.warehouse_location)}
        </div>
        <p>Тип: перемещение</p>
      </>
    );
  };

  const getAppropriateTaskView = () => {
    switch (item.task.type) {
      case 'supply_relocation': {
        return getSupplyRelocationView();
      }
      default: return null;
    }
  };

  const onTaskClick = () => {
    history.push(TASK.replace(':id', item.id));
  };

  return (
    <div className="mobile-task" onClick={onTaskClick}>
      <div className="link circle-with-arrow">&rarr;</div>
      {getAppropriateTaskView()}
    </div>
  );
};

export default TaskItem;
