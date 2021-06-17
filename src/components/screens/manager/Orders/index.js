import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Table from '../../../common/Table';
import PageWrapper from '../../../common/PageWrapper';
import SidebarWrapper from '../../../common/SidebarWrapper';
import { request } from '../../../../helpers/request';
import { API_ORDERS } from '../../../../constants/api';

const columns = [
  {
    header: 'ID',
    key: 'id',
    flex: '0.02'
  },
  {
    header: 'Статус',
    key: 'status',
  },
  {
    header: 'Дата создания',
    key: 'created_date'
  },
  {
    header: 'Дата отправки',
    key: 'shipping_date',
  },
  {
    header: 'К-во продуктов',
    key: 'quantity',
  },
  {
    header: '',
    key: 'linkTo',
    flex: '0.2'
  },
];

const Orders = ({ match }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    setOrderList([]);
    setIsLoading(true);
    request.get(API_ORDERS)
      .then(res => {
        setOrderList(res.data.items);
        setIsLoading(false);
      });
  }, []);

  const mapOrderList = (orderList) => {
    return orderList.map(item => ({
      id: item.id,
      status: item.status,
      created_date: item.created_date,
      shipping_date: item.shipping_date,
      quantity: item.products.reduce((acc, item) => item.quantity + acc, 0),
      linkTo: <Link to={`/orders/${item.id}`} className="link circle-with-arrow">&rarr;</Link>,
    }));
  };

  return (
    <PageWrapper title="Locations" match={match}>
      <SidebarWrapper
        title="Заказы"
        subtitle="Заказы, требующие обработки"
      >
        <div className="action-area">
          <div className="action-area__filters">

          </div>
        </div>
        <div className="content-box">
          <Table
            columns={columns}
            data={mapOrderList(orderList)}
            loadingState={isLoading}
          />
        </div>
      </SidebarWrapper>
    </PageWrapper>
  )
};

export default Orders;
