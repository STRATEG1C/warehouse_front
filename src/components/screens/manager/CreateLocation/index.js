import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../../../../helpers/request';
import { API_LOCATIONS } from '../../../../constants/api';
import { LOCATIONS } from '../../../../constants/pathNames';
import {
  LOCATION_TYPES,
  STORAGE_TYPES
} from '../../../../constants/warehouseLocation';
import PageWrapper from '../../../common/PageWrapper';
import SidebarWrapper from '../../../common/SidebarWrapper';
import TextInput from '../../../common/TextInput';
import SelectInput from '../../../common/SelectInput';
import Button from '../../../common/Button';
import Spinner from '../../../common/Spinner';
import './style.scss';
import { toast } from 'react-toastify';

const fields = [
  {
    header: 'Тип локации',
    key: 'locationType',
    type: 'select',
  },
  {
    header: 'Тип хранения',
    key: 'storageType',
    type: 'select',
  },
  {
    header: 'Проход',
    key: 'aisle',
    type: 'select',
  },
  {
    header: 'Ячейка',
    key: 'bay',
  },
  {
    header: 'Уровень',
    key: 'level',
  },
  {
    header: 'Вместимость',
    key: 'palletCapacity',
  }
];

const options = {
  aisle: [
    {
      title: 'A',
      value: 'A',
    },
    {
      title: 'B',
      value: 'B',
    },
    {
      title: 'C',
      value: 'C',
    },
    {
      title: 'D',
      value: 'D',
    },
    {
      title: 'UD',
      value: 'UD',
    },
  ],
  locationType: [
    {
      title: 'Док',
      value: LOCATION_TYPES.DOCK,
    },
    {
      title: 'Хранилище',
      value: LOCATION_TYPES.STORAGE,
    },
    {
      title: 'Разгрузка',
      value: LOCATION_TYPES.UNLOAD_DOCK,
    },
  ],
  storageType: [
    {
      title: 'Пол',
      value: STORAGE_TYPES.FLOOR,
    },
    {
      title: 'Стелаж',
      value: STORAGE_TYPES.SHELF,
    },
  ]
}

const initialForm = {
  warehouse: '1',
  aisle: 'A',
  bay: '',
  level: '',
  locationType: `${LOCATION_TYPES.DOCK}`,
  storageType: `${STORAGE_TYPES.FLOOR}`,
  palletCapacity: '',
  quantity: '',
  bayFrom: '',
  bayTo: '',
};

const initialFormErrors = {
  aisle: '',
  bay: '',
  level: '',
  locationType: '',
  storageType: '',
  palletCapacity: '',
  quantity: '',
  bayFrom: '',
  bayTo: '',
}

const CreateLocation = ({ match }) => {
  const [form, setForm] = useState(initialForm);
  const [addingMode, setAddingMode] = useState('single');
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (addingMode === 'single') {
    }
    if (addingMode === 'many') {
    }
  }, [addingMode]);

  const onChangeForm = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));

    setFormErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  }

  const getIsFieldDisabled = (fieldName) => {
    if (fieldName === 'bay' && addingMode === 'many') {
      return true;
    }

    if (
      fieldName === 'bay'
      || fieldName === 'level'
      || fieldName === 'storageType'
      || fieldName === 'palletCapacity'
    ) {
      return parseInt(form.locationType) === LOCATION_TYPES.DOCK
        || parseInt(form.locationType) === LOCATION_TYPES.UNLOAD_DOCK;
    }
  };

  const onCreateLocations = () => {
    setIsLoading(true);
    request.post(API_LOCATIONS, {
      data: {
        ...form
      }
    })
      .then(() => {
        setIsLoading(false);
        toast(addingMode === 'single' ? 'Локация успешно создана' : 'Локации успешно созданы')
      });
  };

  return (
    <PageWrapper title="Locations" match={match}>
      <SidebarWrapper
        title="Добавление локации"
        subtitle="Создание локации на складе"
      >
        <div className="action-area">
          <div className="action-area__links">
            <Link to={LOCATIONS} className="link text-size-medium">&#9668; К списку локаций</Link>
          </div>
        </div>
        <div className="content-box">
          <SelectInput
            onChange={(field, val) => setAddingMode(val)}
            name="is-add-many"
            label="Режим добавления"
            value={addingMode}
            options={[
              {
                title: 'Одна',
                value: 'single',
              },
              {
                title: 'Много',
                value: 'many',
              },
            ]}
            className="create-location__input"
          />
          <div className="create-location__form">
            {fields.map(field => {
              if (field.type === 'select') {
                return (
                  <SelectInput
                    onChange={onChangeForm}
                    name={field.key}
                    label={field.header}
                    value={form[field.key]}
                    className="create-location__input"
                    options={options[field.key]}
                    disabled={getIsFieldDisabled(field.key)}
                    error={formErrors[field.key]}
                    key={field.key}
                  />
                )
              }

              return (
                <TextInput
                  onChange={onChangeForm}
                  name={field.key}
                  label={field.header}
                  value={form[field.key]}
                  className="create-location__input"
                  disabled={getIsFieldDisabled(field.key)}
                  error={formErrors[field.key]}
                  key={field.key}
                />
              );
            })}
          </div>
          {addingMode === 'many' && (
            <div className="locations-quantity-area">
              {(parseInt(form.locationType) === LOCATION_TYPES.DOCK
                || parseInt(form.locationType) === LOCATION_TYPES.UNLOAD_DOCK)
              && (
                <TextInput
                  onChange={onChangeForm}
                  name="quantity"
                  label="Количество"
                  value={form.quantity}
                  className="create-location__input"
                  error={formErrors.quantity}
                />
              )}
              {(parseInt(form.locationType) === LOCATION_TYPES.STORAGE) && (
                <>
                  <TextInput
                    onChange={onChangeForm}
                    name="bayFrom"
                    label="Ячейка от"
                    value={form.bayFrom}
                    className="create-location__input"
                    error={formErrors.bayFrom}
                  />
                  <TextInput
                    onChange={onChangeForm}
                    name="bayTo"
                    label="Ячейка до"
                    value={form.bayTo}
                    className="create-location__input"
                    error={formErrors.bayTo}
                  />
                </>
              )}
            </div>
          )}
          <div className="flex center">
            {isLoading ? (
              <Spinner className="spinner" />
            ) : (
              <Button
                text="Создать"
                onClick={onCreateLocations}
                className="btn"
              />
            )}
          </div>
        </div>
      </SidebarWrapper>
    </PageWrapper>
  );
};

export default CreateLocation;
