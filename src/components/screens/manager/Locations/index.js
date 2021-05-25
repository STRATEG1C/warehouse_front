import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { request } from '../../../../helpers/request';
import { API_LOCATIONS } from '../../../../constants/api';
import { CREATE_LOCATIONS } from '../../../../constants/pathNames';
import PageWrapper from '../../../common/PageWrapper';
import SidebarWrapper from '../../../common/SidebarWrapper';
import Table from '../../../common/Table';
import ConfirmModal from '../../../common/modals/ConfirmModal';
import './style.scss';

const columns = [
  {
    header: 'Тип локации',
    key: 'locationType',
  },
  {
    header: 'Тип хранения',
    key: 'storageType',
  },
  {
    header: 'Проход',
    key: 'aisle'
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
  },
  {
    header: '',
    key: 'edit',
    flex: '0.2'
  },
  {
    header: '',
    key: 'delete',
    flex: '0.2'
  },
];

const Locations = ({ match }) => {
  const [locationList, setLocationList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalShown, setIsModalShown] = useState(false);
  const [deletedLocationIds, setDeletedLocationIds] = useState([]);

  const history = useHistory();

  const onDeleteLocation = (locationId) => {
    setDeletedLocationIds([locationId]);
    setIsModalShown(true);
  };

  const mapLocations = (locations) => {
    return locations.map(location => {
      return {
        ...location,
        aisle: location.aisle || '-',
        bay: location.bay || '-',
        level: location.level || '-',
        warehouse: location.warehouse?.name || '-',
        storageType: location.storageType?.name || '-',
        palletCapacity: location.palletCapacity || '-',
        locationType: location.locationType?.name || '-',
        barcode: location.barcode || '-',
        edit: <Link to={`/location/${location.id}`} className="link">&#128396;</Link>,
        delete: <div className="link" onClick={onDeleteLocation.bind(this, location.id)}>&#10060;</div>
      }
    });
  };

  useEffect(() => {
    setLocationList([]);
    setIsLoading(true);
    request.get(API_LOCATIONS)
      .then(res => {
        setIsLoading(false);
        setLocationList(res.data.items);
      });
  }, []);

  const onConfirmDelete = () => {
    request.delete(API_LOCATIONS, {
      data: {
        ids: deletedLocationIds
      }
    })
      .then(() => {
        request.get(API_LOCATIONS)
          .then(res => {
            setIsLoading(false);
            setLocationList(res.data.items);
          });
        toast('Локация удалена');
      });

    setIsModalShown(false);
    setDeletedLocationIds([]);
  };

  const onDeclineDelete = () => {
    setIsModalShown(false);
  }

  return (
    <PageWrapper title="Locations" match={match}>
      {isModalShown && <ConfirmModal onConfirm={onConfirmDelete} onDecline={onDeclineDelete} />}
      <SidebarWrapper
        title="Локации"
        subtitle="Доступные на складе локации"
      >
        <div className="action-area">
          <div className="action-area__filters">

          </div>
          <div className="action-area__links">
            <Link to={CREATE_LOCATIONS} className="btn">+ Добавить локацию</Link>
          </div>
        </div>
        <div className="content-box">
          <Table
            columns={columns}
            data={mapLocations(locationList)}
            loadingState={isLoading}
            onFirstAdd={() => history.push(CREATE_LOCATIONS)}
          />
        </div>
      </SidebarWrapper>
    </PageWrapper>
  );
};

export default Locations;
