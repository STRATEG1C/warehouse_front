import React, { useEffect, useState } from 'react';
import SupplyItem from '../../../common/SupplyItem';
import MobileViewWrapper from '../../../common/MobileViewWrapper';
import { request } from '../../../../helpers/request';
import { API_STAFF, API_SUPPLIES } from '../../../../constants/api';
import { supplyStatuses, userRoles } from '../../../../constants/common';

const SupplyList = () => {
  const [supplyList, setSupplyList] = useState([]);
  const [unloadedSupplyList, setUnloadedSupplyList] = useState([]);
  const [workerList, setWorkerList] = useState([]);

  useEffect(() => {
    request.get(`${API_SUPPLIES}?status=${supplyStatuses.arrived}`)
      .then((res) => {
        setSupplyList(res.data.items);
      });

    request.get(`${API_SUPPLIES}?status=${supplyStatuses.unloading}`)
      .then((res) => {
        setUnloadedSupplyList(res.data.items);
      });

    request.get(`${API_STAFF}?role_id=${userRoles.worker}`)
      .then((res) => {
        setWorkerList(res.data.items);
      });
  }, []);

  return (
    <MobileViewWrapper title="Прибывшие поставки">
      <div className="mobile-list">
        <h2 className="text-size-medium mb-20">Ждут разгрузки</h2>
        {supplyList.map(item => <SupplyItem item={item} workers={workerList} key={item.id} />)}
        <h2 className="text-size-medium mb-20">Разгружаются</h2>
        {unloadedSupplyList.map(item => <SupplyItem item={item} workers={workerList} key={item.id} redirect={true} />)}
        {!supplyList.length && <p className="mobile-list__empty">Сейчас поставок нет, загляните сюда позже :);</p>}
      </div>
    </MobileViewWrapper>
  );
};

export default SupplyList;
