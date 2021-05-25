import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { request } from '../../../../helpers/request';
import { API_SUPPLIES, API_UNLOAD_PRODUCT } from '../../../../constants/api';
import MobileViewWrapper from '../../../common/MobileViewWrapper';
import Spinner from '../../../common/Spinner';
import Button from '../../../common/Button';
import { TASK_LIST } from '../../../../constants/pathNames';
import './style.scss';

const QuantityModal = ({ text, onConfirm, onClose }) => {
  const [quantity, setQuantity] = useState(0);

  const decrease = () => {
    setQuantity(quantity-1);
  }

  const increase = () => {
    setQuantity(quantity+1);
  }

  const onConfirmHandler = () => {
    onConfirm(quantity);
  }

  return (
    <div className="modal__overlay">
      <div className="modal__box">
        <p className="text-size-big">{text}</p>
        <div className="modal-quantity-area">
          <div className="modal-quantity-button" onClick={decrease}>-</div>
          <div className="modal-quantity-number">{quantity}</div>
          <div className="modal-quantity-button" onClick={increase}>+</div>
        </div>
        <div className="modal__action-buttons">
          <Button text="Подтвердить" onClick={onConfirmHandler} className="modal__confirm btn" />
          <Button text="Закрыть" onClick={onClose} className="modal__decline btn"  />
        </div>
      </div>
    </div>
  )
}

const SupplyPallet = ({ item, onUnloading }) => {
  const isUnloaded = item.loaded_quantity === item.quantity;
  return (
    <div className={`supply-pallet ${isUnloaded ? 'unloaded' : ''}`}>
      <p>{item.product.name}</p>
      <p>Разгружено {item.loaded_quantity}/{item.quantity}</p>
      {!isUnloaded && <Button text="Разгрузить" onClick={() => onUnloading(item.id)} className="btn btn-small" /> }
    </div>
  )
}

const SupplyUnloading = ({ match }) => {
  const [supply, setSupply] = useState(null);
  const [unloadingPallet, setUnloadingPallet] = useState(null);

  const history = useHistory();

  useEffect(() => {
    request.get(`${API_SUPPLIES}/${match.params.id}`)
      .then((res) => {
        setSupply(res.data.item);
      });
  }, []);

  useEffect(() => {
    if (!supply) {
      return;
    }

    const supplyPallets = supply.supply_pallets;
    let isFullyUnloaded = false;
    supplyPallets.forEach(item => {
      isFullyUnloaded = item.quantity === item.loaded_quantity
    });

    if (isFullyUnloaded) {
      history.push(TASK_LIST);
    }
  }, [supply]);

  if (!supply) {
    return (
      <MobileViewWrapper title="Загрузка...">
        <Spinner className="spinner" />
      </MobileViewWrapper>
    )
  }

  const selectUnloadingPallet = (palletId) => {
    setUnloadingPallet(palletId);
  }

  const onUnloadProduct = (quantity) => {
    request.post(
      API_UNLOAD_PRODUCT.replace(':supplyId', supply.id).replace(':palletId', unloadingPallet),
      { quantity }
    )
      .then(() => {
        request.get(`${API_SUPPLIES}/${match.params.id}`)
          .then((res) => {
            setSupply(res.data.item);
          });
      });

    setUnloadingPallet(null);
  }

  const supplyPallets = supply.supply_pallets || [];

  return (
    <MobileViewWrapper title={`Разгрузка контейнера ${supply.id} в D-${supply.warehouse_location.id}`}>
      {unloadingPallet && (
        <QuantityModal
          text="Разгрузка"
          onClose={() => setUnloadingPallet(null)}
          onConfirm={onUnloadProduct}
        />
      )}
      {supplyPallets.map(item => <SupplyPallet item={item} key={item.id} onUnloading={selectUnloadingPallet} />)}
    </MobileViewWrapper>
  );
};

export default SupplyUnloading;
