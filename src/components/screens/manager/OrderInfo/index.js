import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ORDERS } from '../../../../constants/pathNames';
import { request } from '../../../../helpers/request';
import { API_ORDERS } from '../../../../constants/api';
import SidebarWrapper from '../../../common/SidebarWrapper';
import PageWrapper from '../../../common/PageWrapper';
import Spinner from '../../../common/Spinner';
import TextGroup from '../../../common/TextGroup';
import Table from '../../../common/Table';

const columns = [
  {
    header: '#',
    key: 'id',
    flex: '0.02'
  },
  {
    header: 'Название',
    key: 'name',
  },
  {
    header: 'Количество',
    key: 'quantity'
  },
];

const OrderInfo = ({ match }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const fetchSupplyInfo = useCallback(() => {
    request.get(`${API_ORDERS}/${match.params.id}`)
      .then(res => {
        setOrder(res.data.item);
        setIsLoading(false);
      });
  }, [match]);

  useEffect(() => {
    if (!order && !isLoading) {
      setOrder(null);
      setIsLoading(true);
      fetchSupplyInfo();
    }
  }, [fetchSupplyInfo, isLoading, order]);

  const getAppropriateStatus = (status) => {
    switch (status) {
      case 'created': return 'Создан';
      case 'in progress': return 'Обрабатывается';
      case 'completed': return 'Завершен';
      default: return "Не известно";
    }
  }

  const mapProductList = (productList) => {
    return productList.map((item, i) => ({
      id: i+1,
      name: item.name,
      quantity: item.quantity,
    }));
  };

  return (
    <PageWrapper title="Orders" match={match}>
      <SidebarWrapper
        title="Заказ"
        subtitle="Полная информация о заказе"
      >
        <div className="action-area">
          <div className="action-area__links">
            <Link to={ORDERS} className="link text-size-medium">&#9668; К списку заказов</Link>
          </div>
        </div>
        <div className="content-box">
          {(isLoading || !order) ? (
            <div className="flex center">
              <Spinner className="spinner" />
            </div>
          ) : (
            <>
              <p className="text-size-medium content-box__title">Заказ на {order.shipping_date} от {order.created_date}</p>
              <div className="create-location__form">
                <TextGroup
                  label="Дата создания"
                  value={order.created_date || '-'}
                  className="create-location__input"
                />
                <TextGroup
                  label="Дата отправки"
                  value={order.shipping_date}
                  className="create-location__input"
                />
                <TextGroup
                  label="Общее к-во"
                  value={order.products.reduce((acc, item) => item.quantity + acc, 0)}
                  className="create-location__input"
                />
                <TextGroup
                  label="Статус"
                  value={getAppropriateStatus(order.status)}
                  className="create-location__input"
                />
              </div>
              <p className="text-size-medium content-box__title">Заказанные продукты</p>
              <Table
                columns={columns}
                data={mapProductList(order.products)}
                loadingState={isLoading}
              />
            </>
          )}
        </div>
      </SidebarWrapper>
    </PageWrapper>
  )
};

export default OrderInfo;
