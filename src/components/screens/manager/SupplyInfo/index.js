import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SUPPLIES } from '../../../../constants/pathNames';
import { request } from '../../../../helpers/request';
import { API_SUPPLIES } from '../../../../constants/api';
import SidebarWrapper from '../../../common/SidebarWrapper';
import PageWrapper from '../../../common/PageWrapper';
import Spinner from '../../../common/Spinner';
import TextGroup from '../../../common/TextGroup';
import OptionChain from '../../../common/OptionChain';
import ConfirmModal from '../../../common/modals/ConfirmModal';

const statusOptions = [
  {
    value: 'sent',
    label: 'Отправлено',
  },
  {
    value: 'on way',
    label: 'В пути',
  },
  {
    value: 'arrived',
    label: 'Прибыло',
  },
  {
    value: 'unloading',
    label: 'Разгружается',
  },
]

const SupplyInfo = ({ match }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [supply, setSupply] = useState(null);
  const [newStatus, setNewStatus] = useState(null);

  const fetchSupplyInfo = useCallback(() => {
    request.get(`${API_SUPPLIES}/${match.params.id}`)
      .then(res => {
        setSupply(res.data.item);
        setNewStatus(res.data.item.status);
        setIsLoading(false);
      });
  }, [match]);

  useEffect(() => {
    if (!supply && !isLoading) {
      setSupply(null);
      setIsLoading(true);
      fetchSupplyInfo();
    }
  }, [fetchSupplyInfo, isLoading, supply]);

  const onSetNewStatus = (status) => {
    if (status === 'unloading') {
      setPendingStatus(status);
      return;
    }

    request.put(`${API_SUPPLIES}/${match.params.id}/status/${status}`)
      .then(() => {
        fetchSupplyInfo();
        toast('Статус обновлен');
      });
  };

  const onConfirmStatus = () => {
    request.put(`${API_SUPPLIES}/${match.params.id}/status/${pendingStatus}`)
      .then(() => {
        setPendingStatus(null);
        fetchSupplyInfo();
        toast('Статус обновлен');
      });
  }

  const onDeclineStatus = () => {
    setPendingStatus(null);
  }

  return (
    <PageWrapper title="Supplies" match={match}>
      <SidebarWrapper
        title="Поставка"
        subtitle="Полная информация о поставке"
      >
        {pendingStatus && (
          <ConfirmModal
            text="Отправить в разгрузку?"
            onConfirm={onConfirmStatus}
            onDecline={onDeclineStatus}
          />
        )}
        <div className="action-area">
          <div className="action-area__links">
            <Link to={SUPPLIES} className="link text-size-medium">&#9668; К списку поставок</Link>
          </div>
        </div>
        <div className="content-box">
          {(isLoading || !supply) ? (
            <div className="flex center">
              <Spinner className="spinner" />
            </div>
          ) : (
            <>
              <p className="text-size-medium content-box__title">Поставка "{supply.supplier_name}" от {supply.creation_date}</p>
              <OptionChain
                label="Статус"
                options={statusOptions}
                onChange={onSetNewStatus}
                value={newStatus}
              />
              <div className="create-location__form">
                <TextGroup
                  label="Поставщик"
                  value={supply.supplier_name}
                  className="create-location__input"
                />
                <TextGroup
                  label="Дата отправки"
                  value={supply.created_at}
                  className="create-location__input"
                />
                <TextGroup
                  label="Дата прибытия"
                  value={supply.arrival_date || '-'}
                  className="create-location__input"
                />
              </div>
            </>
          )}
        </div>
      </SidebarWrapper>
    </PageWrapper>
  )
};

export default SupplyInfo;
