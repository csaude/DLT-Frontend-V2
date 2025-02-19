import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { loginUser } from "@store/reducers/auth";
import { Button } from "@components";
import { faEye, faEyeSlash, faUser } from "@fortawesome/free-solid-svg-icons";
import { setWindowClass } from "@app/utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as Yup from "yup";

import { Form, InputGroup } from "react-bootstrap";
import * as AuthService from "../../services/auth";
import { verifyUserByUsername } from "../../utils/login";
import { edit } from "@app/utils/users";

const Login = () => {
  const [isAuthLoading, setAuthLoading] = useState(false);
  const dispatch = useDispatch();
  const [passwordType, setPasswordType] = useState("password");

  const navigate = useNavigate();

  const getMessage = (status) => {
    if (status == 404) {
      return "O utilizador informado não está cadastrado no sistema, para autenticar precisa estar cadastrado no sistema";
    } else if (status == 423) {
      return "O utilizador informado encontra-se inactivo, por favor contacte a equipe de suporte para activação do utilizador";
    } else if (status == 401) {
      return "A password informada não está correcta, por favor corrija a password e tente novamente";
    } else if (status == 500) {
      return "Ocorreu um Erro na autenticação do seu utilizador, por favor contacte a equipe de suporte para mais detalhes!";
    } else if (status == undefined) {
      return "Do momento o sistema encontra-se em manutenção, por favor aguarde a disponibilidade do sistema e tente novamente";
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setAuthLoading(true);
      const user = await verifyUserByUsername(email);
      const data = await AuthService.loginByAuth(email, password);
      toast.success("Autenticação efectuada com sucesso!");
      setAuthLoading(false);
      dispatch(loginUser(data));
      localStorage.setItem("dateCreated", user?.dateCreated);
      user.lastLoginDate = new Date();
      navigate("/");
    } catch (error) {
      const errSt = JSON.stringify(error);
      const errObj = JSON.parse(errSt);
      setAuthLoading(false);
      toast.error(getMessage(errObj.status));
    }
  };

  const { handleChange, values, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Obrigatório"),
      password: Yup.string().required("Obrigatório"),
    }),
    onSubmit: (values) => {
      login(values.email, values.password);
    },
  });

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("");
      return;
    }
    setPasswordType("password");
  };

  setWindowClass("hold-transition login-page");

  return (
    <div id="login-panel" className="login-box">
      <div className="card card-outline card-primary" style={{}}>
        <div style={{ alignItems: "center", width: "50%" }}>
          <img
            style={{ width: "100%", marginLeft: "50%", marginTop: "10%" }}
            src={"img/dreams.png"}
          />
        </div>
        <div className="card-header text-center">
          <p className="login-box-msg">
            {/* {t('login.label.signIn')} */}
            Dreams Layering Tool
          </p>
        </div>
        <div className="card-body">
          <p className="h1 text-center">
            <b>Autenticação</b>
          </p>
          <p className="login-box-msg"></p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <InputGroup id="email-group" className="mb-3">
                <Form.Control
                  id="email-fom"
                  name="email"
                  placeholder="Insira o Utilizador"
                  onChange={handleChange}
                  value={values.email}
                  isValid={touched.email && !errors.email}
                  isInvalid={touched.email && !!errors.email}
                />
                {touched.email && errors.email ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faUser} />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>
            <div className="mb-3">
              <InputGroup id="password-group" className="mb-3">
                <Form.Control
                  id="password-control"
                  name="password"
                  type={passwordType}
                  placeholder="Insira a Senha"
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
                      {passwordType === "password" ? (
                        <FontAwesomeIcon
                          icon={faEyeSlash}
                          onClick={togglePassword}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faEye}
                          onClick={togglePassword}
                        />
                      )}
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>

            <div className="row">
              <div className="col-12">
                <Button
                  id="submit-button"
                  block
                  type="submit"
                  isLoading={isAuthLoading}
                  style={{ background: "#0C4A6E" }}
                >
                  {/* @ts-ignore */}
                  {/* {t('login.button.signIn.label')} */}
                  Autenticar
                </Button>
              </div>
            </div>
          </form>
          <p className="mb-1">
            <Link to="/forgot-password">Esqueceu a password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
