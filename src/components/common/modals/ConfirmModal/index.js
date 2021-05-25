import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../Button';
import './style.scss';

const ConfirmModal = ({ text, onConfirm, onDecline }) => {
  const onConfirmHandler = () => {
    onConfirm && onConfirm();
  }

  const onDeclineHandler = () => {
    onDecline && onDecline();
  }

  return (
    <div className="modal__overlay">
      <div className="modal__box">
        <p className="text-size-big">{text}</p>
        <div className="modal__action-buttons">
          <Button text="Да" onClick={onConfirmHandler} className="modal__confirm btn" />
          <Button text="Нет" onClick={onDeclineHandler} className="modal__decline btn"  />
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  text: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired
};

ConfirmModal.defaultProps = {
  text: 'Вы подтверждаете?'
};

export default ConfirmModal;
