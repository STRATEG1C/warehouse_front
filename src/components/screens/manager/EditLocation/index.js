import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../../../../helpers/request';
import { API_LOCATIONS } from '../../../../constants/api';
import { LOCATIONS } from '../../../../constants/pathNames';
import {
  LOCATION_TYPES,
} from '../../../../constants/warehouseLocation';
import PageWrapper from '../../../common/PageWrapper';
import SidebarWrapper from '../../../common/SidebarWrapper';
import TextGroup from '../../../common/TextGroup';
import Spinner from '../../../common/Spinner';
import TextInput from '../../../common/TextInput';
import Button from '../../../common/Button';
import './style.scss';

const initialForm = {
  palletCapacity: ''
};

const initialFormErrors = {
  palletCapacity: '',
};

const EditLocation = ({ match }) => {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState(initialFormErrors);

  useEffect(() => {
    const id = match.params.id;
    request.get(`${API_LOCATIONS}/${id}`)
      .then(res => {
          setLocation(res.data.item);
          setForm({
            palletCapacity: res.data.item.palletCapacity?.toString()
          });
      });
  }, [match]);

  const onChangeForm = (field, value) => {
    if (field === 'palletCapacity') {
      setFormErrors({
        ...formErrors,
        [field]: '',
      });
      setForm({
        ...form,
        [field]: value
      });
    }
  };

  const onUpdate = () => {
    if (!form.palletCapacity) {
      setFormErrors({
        ...formErrors,
        palletCapacity: 'Поле не должно быть пустым',
      });
      return;
    }

    setIsLoading(true);

    request.put(`${API_LOCATIONS}/${location.id}`, {
      data: {
        ...form
      }
    })
      .then(() => {
        const id = match.params.id;
        request.get(`${API_LOCATIONS}/${id}`)
          .then(res => {
            setLocation(res.data.item);
            setIsLoading(false);
          });
      });
  }

  const getLocationName = () => {
    if (!location) {
      return '';
    }

    if (
      location.locationType.id === LOCATION_TYPES.DOCK
      || location.locationType.id === LOCATION_TYPES.UNLOAD_DOCK
    ) {
      return `${location.aisle}-${location.id}`;
    }

    return `${location.aisle}-${location.bay}-${location.level}`;
  };

  const isCapacityDisabled = location?.locationType?.id === LOCATION_TYPES.DOCK
    || location?.locationType?.id === LOCATION_TYPES.UNLOAD_DOCK;

  return (
    <PageWrapper title="Locations" match={match}>
      <SidebarWrapper
        title={`Локация ${getLocationName()}`}
        subtitle="Просмотр / редактирование локации"
      >
        <div className="action-area">
          <div className="action-area__links">
            <Link to={LOCATIONS} className="link text-size-medium">&#9668; К списку локаций</Link>
          </div>
        </div>
        <div className="content-box">
          <p className="text-size-medium content-box__title">Локация {getLocationName()}</p>
          {(!isLoading && location) ? (
            <>
              <div className="create-location__form">
                <TextGroup
                  label="Тип локации"
                  value={location.locationType?.name}
                  className="create-location__input"
                />
                <TextGroup
                  label="Тип хранения"
                  value={location.storageType?.name || '-'}
                  className="create-location__input"
                />
                <TextGroup
                  label="Проход"
                  value={location.aisle || '-'}
                  className="create-location__input"
                />
                <TextGroup
                  label="Ячейка"
                  value={(location.bay || '-').toString()}
                  className="create-location__input"
                />
                <TextGroup
                  label="Уровень"
                  value={(location.level || '-').toString()}
                  className="create-location__input"
                />
                {!isCapacityDisabled && (
                  <TextInput
                    onChange={onChangeForm}
                    name="palletCapacity"
                    label="Вместимость"
                    value={form.palletCapacity}
                    className="create-location__input"
                  />
                )}
              </div>
              {!isCapacityDisabled && (
                <div className="flex center">
                  <Button
                    text="Обновить"
                    onClick={onUpdate}
                    className="btn"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex center">
              <Spinner className="spinner" />
            </div>
          )}
        </div>
      </SidebarWrapper>
    </PageWrapper>
  );
};

export default EditLocation;
