import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '../Button';
import { request } from '../../../helpers/request';
import { API_START_UNLOADING } from '../../../constants/api';
import { SUPPLY_UNLOADING } from '../../../constants/pathNames';
import './style.scss';

const SupplyItem = ({ item, workers, redirect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedWorkers, setSelectedWorkers] = useState([]);

  const history = useHistory();

  const expandHandler = () => {
    setIsExpanded(!isExpanded);
  }

  const checkIfSelected = (id) => {
    return selectedWorkers.find(item => item === id);
  }

  const onSelectWorker = (e, id) => {
    e.stopPropagation();
    if (!!selectedWorkers.find(item => item === id)) {
      return setSelectedWorkers(prev => ([
        ...prev.filter(item => item !== id),
      ]));
    }

    setSelectedWorkers(prev => ([...prev, id]));
  }

  const onStartUnloading = () => {
    if (redirect) {
      history.push(SUPPLY_UNLOADING.replace(':id', item.id));
      return;
    }

    request.post(`${API_START_UNLOADING}/${item.id}`, { workers: selectedWorkers })
      .then(() => {
        history.push(SUPPLY_UNLOADING.replace(':id', item.id));
      });
  }

  return (
    <div className="task" onClick={expandHandler}>
      Контейнер {item.id} в D-{item.warehouse_location.id}
      <div className={`link circle-with-arrow ${isExpanded ? 'expanded' : ''}`}>&rarr;</div>
      {isExpanded && (
        <div className="task-info">
          {!redirect && <div className="workers-list">
            {workers.map(worker => (
              <div
                key={worker.id}
                className={`workers-list-item ${checkIfSelected(worker.id) ? 'selected' : ''}`}
                onClick={(e) => onSelectWorker(e, worker.id)}
              >
                {worker.first_name}
                &nbsp;
                {worker.last_name}
              </div>
            ))}
          </div>}
          <Button text={redirect ? "Продолжить разгрузку" : "Начать разгрузку"} onClick={onStartUnloading} className="btn" />
        </div>
      )}
    </div>
  );
};

export default SupplyItem;
