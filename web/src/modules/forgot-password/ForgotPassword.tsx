import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {Button} from '@components';
import {faEnvelope, faEye, faEyeSlash, faLock, faUser} from '@fortawesome/free-solid-svg-icons';
import {setWindowClass} from '@app/utils/helpers';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {Form, InputGroup} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import * as AuthService from '../../services/auth';

const ForgotPassword = () => {
  const [isAuthLoading, setAuthLoading] = useState(false);
  const [t] = useTranslation();
  const [passwordType, setPasswordType] = useState("password");
  // .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\[email protected]$!%*#?&]{8,}$/, "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character")

  const navigate = useNavigate();

  const updatePassword = async (username: string, password: string) => {
    try {
      setAuthLoading(true);
      const data = await AuthService.updatePassword(username, password);
      toast.success('Redefinição de senha submetida com sucesso!');
      navigate('/');
    } catch ( error ) {
      toast.error( 'Failed');
    }
  };

  
  const {handleChange, values, handleSubmit, touched, errors} = useFormik({
    initialValues: {
      username: '',
      password: '',
      rePassword: ''
    },    
    validationSchema: Yup.object({
      username: Yup.string()
        .min(5, 'Deve conter 5 caracter ou mais')
        .required('Obrigatório'),
      password: Yup.string()
        .required('Obrigatório')
        .max(25, 'Deve conter 25 caracteres ou menos')
        .matches(/(?=.*\d)/,'Deve conter número')
        .matches(/(?=.*[a-z])/,'Deve conter minúscula')
        .matches(/(?=.*[A-Z])/, 'Deve conter Maiúscula')
        .matches(/(?=.*[@$!%*#?&])/,'Deve conter caracter especial')
        .min(8, 'Deve conter 8 caracter ou mais'),
      rePassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'As senhas devem corresponder')
        .required('Obrigatório')
    }),
    onSubmit: (values) => {
      updatePassword(values.username, values.password);
      toast.success('Um email de confirmação foi enviado!');
    }
  });

  const togglePassword =()=>{

    if(passwordType==="password")
    {
     setPasswordType("")
     return;
    }
    setPasswordType("password")
  };

  setWindowClass('hold-transition login-page');

  return (
    <div className="login-box">
      <div className="card card-outline card-primary">
        <div style={{alignItems  : 'center', width:'50%' }}>
          <img  style={{  width: "100%", marginLeft: "50%", marginTop:"10%"}}  src={'/img/dreams.png'} />
        </div>
        <div className="card-header text-center">
          <Link to="/" className="h4">
            <p className="login-box-msg">
              <b>Dreams</b><span> Layering Tool</span>
            </p>
          </Link>
        </div>
        <div className="card-body">
          <p className="login-box-msg">Redefinir a senha</p>
          <form onSubmit={handleSubmit}>
           
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="username"
                  name="username"
                  type=""
                  placeholder="Username"
                  onChange={handleChange}
                  value={values.username}
                  isValid={touched.username && !errors.username}
                  isInvalid={touched.username && !!errors.username}
                />
                {touched.username && errors.username ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faUser} />
                      {/* <i onClick={clickHandler} class={showPass ? 'fas fa-eye-slash' : 'fas fa-eye'}></i> */}
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="password"
                  name="password"
                  type={passwordType}
                  placeholder="New Password"
                  onChange={handleChange}
                  value={values.password}
                  isValid={touched.password && !errors.password}
                  isInvalid={touched.password && !!errors.password}
                />
                {touched.password && errors.password ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      { 
                        passwordType==="password"? 
                          <FontAwesomeIcon icon={faEyeSlash} onClick={togglePassword} />
                        :
                          <FontAwesomeIcon icon={faEye} onClick={togglePassword} />
                      }
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>

            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="rePassword"
                  name="rePassword"
                  type={passwordType}
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  value={values.rePassword}
                  isValid={touched.rePassword && !errors.rePassword}
                  isInvalid={touched.rePassword && !!errors.rePassword}
                />
                {touched.rePassword && errors.rePassword ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.rePassword}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>{ 
                        passwordType==="password"? 
                          <FontAwesomeIcon icon={faEyeSlash} onClick={togglePassword} />
                        :
                          <FontAwesomeIcon icon={faEye} onClick={togglePassword} />
                      }
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>
            <div className="row">
              <div className="col-12">
                <Button 
                  block 
                  type="submit"
                  isLoading={isAuthLoading}
                  style={{background:"#0C4A6E"}} 
                > 
                  Solicitar
                </Button>
              </div>
            </div>
          </form>
          <p className="mt-3 mb-1">
            <Link to="/login">{t('login.button.signIn.label')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
