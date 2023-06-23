import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Button } from "@components";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { setWindowClass } from "@app/utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Alert } from "antd";

import * as Yup from "yup";

import { Form, InputGroup } from "react-bootstrap";
import * as AuthService from "../../services/auth";
import "./index.css";

const RenewPassword = () => {
  let username = localStorage.getItem("username");
  const [isAuthLoading, setAuthLoading] = useState(false);
  const [passwordType, setPasswordType] = useState("password");

  const navigate = useNavigate();
  const [t] = useTranslation();

  const setNewPassword = async (username: string, newPassword: string) => {
    try {
      setAuthLoading(true);
      const data = await AuthService.newPassword(username, newPassword);
      toast.success("Password alterado com sucesso!");
      setAuthLoading(false);
      navigate("/");
    } catch (error) {
      setAuthLoading(false);
      toast.error("Failed");
      console.log(error);
    }
  };

  const { handleChange, values, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      userName: localStorage.getItem("username"),
      password: "",
      rePassword: "",
    },
    validationSchema: Yup.object({
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
    onSubmit: async (values: any) => {
      setNewPassword(values.userName, values.password);
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
    <div>
      {username !== undefined ? (
        <div className="login-box">
          <div className="card card-outline card-primary">
            <div style={{ alignItems: "center", width: "50%" }}>
              <img
                style={{ width: "100%", marginLeft: "50%", marginTop: "10%" }}
                src={"img/dreams.png"}
              />
            </div>
            <div className="card-header text-center">
              <div className="h3">
                <p className="login-box-msg">
                  <b>Bem vindo</b>
                </p>
              </div>
              <h3>ao</h3>
              <Link to="/" className="h4">
                <p className="login-box-msg">
                  <b>Dreams</b>
                  <span> Layering Tool</span>
                </p>
              </Link>
            </div>
            <div className="card-body">
              <div className="row alert">
                <Alert
                  message="A alteração da password é obrigatória a cada 6 meses, Todas as senhas inseridas devem ter pelo menos 8 caracteres alfanuméricos contendo: 1 letra maiúscula, 1 letra minúscula, 1 símbolo e 1 número."
                  type="warning"
                  showIcon
                  closable
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <InputGroup className="mb-3">
                    <Form.Control
                      id="password"
                      name="password"
                      type={passwordType}
                      placeholder="Insira a nova password"
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
                  <InputGroup className="mb-3">
                    <Form.Control
                      id="rePassword"
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
                    <Button type="submit" block isLoading={isAuthLoading}>
                      Submeter
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </div>
  );
};

export default RenewPassword;
