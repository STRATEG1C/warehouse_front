import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Table from '../../../common/Table';
import PageWrapper from '../../../common/PageWrapper';
import SidebarWrapper from '../../../common/SidebarWrapper';
import { request } from '../../../../helpers/request';
import { API_SUPPLIES } from '../../../../constants/api';

const columns = [
  {
    header: 'Поставщик',
    key: 'supplierName',
  },
  {
    header: 'Отправлено',
    key: 'creationDate',
  },
  {
    header: 'Статус',
    key: 'status'
  },
  {
    header: 'Дата прибытия',
    key: 'arrivalDate',
  },
  {
    header: '',
    key: 'linkTo',
    flex: '0.2'
  },
];

const Supplies = ({ match }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [supplyList, setSupplyList] = useState([]);

  useEffect(() => {
    setSupplyList([]);
    setIsLoading(true);
    request.get(API_SUPPLIES)
      .then(res => {
        setSupplyList(res.data.items);
        setIsLoading(false);
      });
  }, []);

  const mapSupplyList = (supplyList) => {
    return supplyList.map(item => ({
      ...item,
      supplierName: item.supplier_name,
      creationDate: item.creation_date,
      status: item.status,
      arrivalDate: item.arrival_date || '-',
      linkTo: <Link to={`/supplies/${item.id}`} className="link circle-with-arrow">&rarr;</Link>,
    }));
  };

  return (
    <PageWrapper title="Locations" match={match}>
      <SidebarWrapper
        title="Поставки"
        subtitle="Поставки, идущие на склад"
      >
        <div className="action-area">
          <div className="action-area__filters">

          </div>
        </div>
        <div className="content-box">
          <Table
            columns={columns}
            data={mapSupplyList(supplyList)}
            loadingState={isLoading}
          />
        </div>
      </SidebarWrapper>
    </PageWrapper>
  )
};

export default Supplies;
