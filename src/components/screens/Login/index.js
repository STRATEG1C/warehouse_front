import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchCurrentUser, login } from '../../../store/Auth/thunks';
import PageWrapper from '../../common/PageWrapper';
import TextInput from '../../common/TextInput';
import Button from '../../common/Button';
import Spinner from '../../common/Spinner';

import './style.scss';
import { userRoles } from '../../../constants/common';
import { LOCATIONS, LOGIN, SUPPLIES_IN_WAREHOUSE } from '../../../constants/pathNames';

const initialForm = {
  login: '',
  pincode: ''
};

const initialFormErrors = {
  login: '',
  pincode: ''
};

const Login = ({ match }) => {
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState(initialFormErrors);

  const history = useHistory();
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.auth.isLoading);
  const isErrorFromServer = useSelector(state => state.auth.isError);

  useEffect(() => {
    if (isErrorFromServer) {
      setFormErrors({
        login: 'Не верный логин',
        pincode: 'Не верный пароль'
      });
    }
  }, [isErrorFromServer]);

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

  const validate = () => {
    let loginError = false;
    let pincodeError = false;

    if (!form.login || form.login.length < 3) {
      setFormErrors(prev => ({
        ...prev,
        login: 'Не верный логин'
      }));
      loginError = true;
    }

    if (!form.pincode || form.pincode.length < 3) {
      setFormErrors(prev => ({
        ...prev,
        pincode: 'Не верный пароль'
      }));
      pincodeError = true;
    }

    return !loginError && !pincodeError;
  }

  const onLogin = () => {
    if (validate()) {
      dispatch(login(form))
        .then(() => {
          dispatch(fetchCurrentUser())
            .then(({ payload: user }) => {
              switch (user.role_id) {
                case userRoles.manager: {
                  return history.push(LOCATIONS);
                }
                case userRoles.warehouseManager: {
                  return history.push(SUPPLIES_IN_WAREHOUSE);
                }
                case userRoles.worker: {
                  return history.push(SUPPLIES_IN_WAREHOUSE);
                }
                default: {
                  history.push(LOGIN);
                }
              }
            });
        });
    }
  }

  return (
    <PageWrapper title="Login" match={match}>
      <div className="login-page">
        <div className="login-form">
          <div className="login-form__heading">
            <h1 className="text-center login-form__heading-title title-big">Вход</h1>
            <p className="text-center text-size-medium">Добро пожаловать в систему управления складом!</p>
          </div>
          <div className="login-form__box">
            <TextInput
              placeholder="Логин"
              onChange={onChangeForm}
              value={form.login}
              name="login"
              error={formErrors.login}
              className="login-form__input"
            />
            <TextInput
              placeholder="Пинкод"
              onChange={onChangeForm}
              value={form.pincode}
              name="pincode"
              error={formErrors.pincode}
              className="login-form__input"
            />
          </div>
          {isLoading
            ? (
              <Spinner className="spinner" />
            )
            : (
              <Button
                text="Вход"
                onClick={onLogin}
                className="login-form__btn"
              />
            )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Login;
