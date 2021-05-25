import React from 'react';
import PropTypes from 'prop-types';
import Spinner from '../Spinner';
import './style.scss';
import Button from '../Button';

// const columns = [
//   {
//     header: 'Col 1',
//     key: 'col1',
//   },
//   {
//     header: 'Col 2',
//     key: 'col2',
//   }
// ];
//
// const data = [
//   {
//     col1: 'data',
//     col2: 'data'
//   }
// ];

// const Table = ({ columns, data, editable, deletable, onEdit, onDelete }) => {
const Table = ({ columns, data, loadingState, onFirstAdd }) => {
  return (
    <div className="table">
      <div className="table__row table__header" key="header">
        {columns.map((col, i) => (
          <div className="table__cell" key={col.key} style={{width: col.width, flex: col.flex}}>
            {col.header}
          </div>
        ))}
      </div>
      {loadingState && <Spinner className="spinner" />}
      {!data.length && !loadingState && (
        <div className="table__row">
          <div className="table__cell table__empty-state">
            Нет локаций
            {onFirstAdd && (
              <Button
                className="btn"
                text="+ Добавить"
                onClick={onFirstAdd}
              />
            )}
          </div>
        </div>
      )}
      {data.map((row, i) => (
        <div className="table__row" key={i}>
          {columns.map((col, i) => (
            <div className="table__cell" key={i} style={{width: col.width, flex: col.flex}}>
              { row[col.key] }
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    header: PropTypes.string,
    key: PropTypes.string
  })),
  data: PropTypes.array,
  onFirstAdd: PropTypes.func
  // editable: PropTypes.bool,
  // deletable: PropTypes.bool,
  // onEdit: PropTypes.func,
  // onDelete: PropTypes.func,
};

Table.defaultProps = {
  columns: [],
  data: [],
  // editable: false,
  // deletable: false,
};

export default Table;
