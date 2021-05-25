import React, { useEffect, useState } from 'react';
import QRScanner from 'react-qr-reader';
import MobileViewWrapper from '../../../common/MobileViewWrapper';
import Spinner from '../../../common/Spinner';
import { request } from '../../../../helpers/request';
import { API_TASKS } from '../../../../constants/api';
import { LOCATION_TYPES } from '../../../../constants/warehouseLocation';
import Button from '../../../common/Button';
import { TASK_LIST } from '../../../../constants/pathNames';
import './style.scss';
import { useHistory } from 'react-router-dom';

const TaskPage = ({ match }) => {
  const [taskAssignment, setTaskAssignment] = useState(null);
  const [productBarcode, setProductBarcode] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const history = useHistory();

  useEffect(() => {
    request.get(`${API_TASKS}/${match.params.id}`)
      .then((res) => {
        setTaskAssignment(res.data.item);
      });
  }, []);

  useEffect(() => {
    if (productBarcode) {
      setCurrentStep(2);
    }
  }, [productBarcode]);

  if (!taskAssignment) {
    return (
      <MobileViewWrapper title="Задача">
        <Spinner className="spinner" />
      </MobileViewWrapper>
    );
  }

  const getLocationName = (location) => {
    if (
      location.location_type_id === LOCATION_TYPES.DOCK
      || location.location_type_id.id === LOCATION_TYPES.UNLOAD_DOCK
    ) {
      return `${location.aisle}-${location.id}`;
    }

    return `${location.aisle}-${location.bay}-${location.level}`;
  };

  const getTaskTitle = () => {
    switch (taskAssignment.task.type) {
      case 'supply_relocation': {
        return 'Перемещение';
      }
      default: return '';
    }
  }

  const onEndTask = () => {
    request.put(`${API_TASKS}/${match.params.id}/finish`)
      .then(() => history.push(TASK_LIST));
  }

  const pallet = taskAssignment.task.supply_pallet[0];
  const location = pallet.warehouse_location;
  const product = pallet.product;
  const quantity = pallet.quantity;

  return (
    <MobileViewWrapper title={getTaskTitle()}>
      <div className="task-page">
        {currentStep === 1 ? (
          <div className="task-view">
            <p>Сканируйте продукт</p>
            <h2 className="location-title title-big">{product.name}</h2>
            <QRScanner
              delay={300}
              onScan={setProductBarcode}
              style={{ width: '100%' }}
            />
            <Button className="btn-small" onClick={() => setProductBarcode('111')} text="Сканировать" />
          </div>
        ) : (
          <div className="task-view">
            <p>Отнесите на</p>
            <h2 className="location-title title-big">{getLocationName(location)}</h2>
            <QRScanner
              delay={300}
              onScan={setProductBarcode}
              style={{ width: '100%' }}
            />
            <Button className="btn-small task-scanner" onClick={() => onEndTask()} text="Сканировать" />
          </div>
        )}
        <div className="task-pallet">
          Поддон {product.name}&nbsp;-&nbsp;{quantity}&nbsp;штук
        </div>
      </div>
    </MobileViewWrapper>
  )
};

export default TaskPage;
