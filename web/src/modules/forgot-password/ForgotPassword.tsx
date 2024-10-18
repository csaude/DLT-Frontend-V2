import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button } from "@components";
import { faEye, faEyeSlash, faUser } from "@fortawesome/free-solid-svg-icons";
import { setWindowClass } from "@app/utils/helpers";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as AuthService from "../../services/auth";
import { verifyUserByUsername } from "../../utils/login";
import { Alert } from "antd";

const ForgotPassword = () => {
  const [isAuthLoading, setAuthLoading] = useState(false);
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

  const { handleChange, values, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      username: "",
      password: "",
      rePassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(5, "Deve conter 5 caracter ou mais")
        .required("Obrigatório"),
      password: Yup.string()
        .required("Obrigatório")
        .max(25, "Deve conter 25 caracteres ou menos")
        .matches(/(?=.*\d)/, "Deve conter número")
        .matches(/(?=.*[a-z])/, "Deve conter minúscula")
        .matches(/(?=.*[A-Z])/, "Deve conter Maiúscula")
        .matches(/(?=.*[@$!%*#?&])/, "Deve conter caracter especial")
        .min(8, "Deve conter 8 caracter ou mais"),
      rePassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "As senhas devem corresponder")
        .required("Obrigatório"),
    }),
    onSubmit: async (values) => {
      try {
        await verifyUserByUsername(values.username);
        setAuthLoading(true);
        await AuthService.updatePassword(values.username, values.password);
        toast.success("Redefinição de senha submetida com sucesso!");
        navigate("/");
        toast.success("Um email de confirmação foi enviado!");
      } catch (error) {
        const errSt = JSON.stringify(error);
        const errObj = JSON.parse(errSt);
        setAuthLoading(false);
        if (errObj.status == 401) {
          toast.error(
            "A password foi usada recentimente, escolha uma password diferente!"
          );
        } else {
          toast.error(getMessage(errObj.status));
        }
      }
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
    <div className="login-box">
      <div className="card card-outline card-primary">
        <div style={{ alignItems: "center", width: "50%" }}>
          <img
            style={{ width: "100%", marginLeft: "50%", marginTop: "10%" }}
            src={"img/dreams.png"}
          />
        </div>
        <div className="card-header text-center">
          <Link to="/" className="h4">
            <p className="login-box-msg">
              <b>Dreams</b>
              <span> Layering Tool</span>
            </p>
          </Link>
        </div>
        <div className="card-body">
          <p className="login-box-msg">Redefinir a senha</p>
          <div className="row alert">
            <Alert
              message="Todas as senhas inseridas devem ter pelo menos 8 caracteres alfanuméricos contendo: 1 letra maiúscula, 1 letra minúscula, 1 símbolo e 1 número."
              type="warning"
              showIcon
              closable
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <InputGroup id="username-group" className="mb-3">
                <Form.Control
                  id="username-control"
                  name="username"
                  type=""
                  placeholder="Insira o Utilizador"
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
              <InputGroup id="password-group" className="mb-3">
                <Form.Control
                  id="password-control"
                  name="password"
                  type={passwordType}
                  placeholder="Insira a nova Password"
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

            <div className="mb-3">
              <InputGroup id="rePassword-group" className="mb-3">
                <Form.Control
                  id="rePassword-control"
                  name="rePassword"
                  type={passwordType}
                  placeholder="Repita a nova password"
                  onChange={handleChange}
                  value={values.rePassword}
                  isValid={touched.rePassword && !errors.rePassword}
                  isInvalid={touched.rePassword && !!errors.rePassword}
                  onPaste={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                  onCopy={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                />
                {touched.rePassword && errors.rePassword ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.rePassword}
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
                  Solicitar
                </Button>
              </div>
            </div>
          </form>
          <p className="mt-3 mb-1">
            <Link to="/login">
              {/* {t('login.button.signIn.label')} */}
              Voltar a Página Principal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
