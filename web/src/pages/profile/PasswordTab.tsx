import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@components";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, InputGroup } from "react-bootstrap";
import * as AuthService from "../../services/auth";
import { useDispatch } from "react-redux";
import { logoutUser } from "@app/store/reducers/auth";

const PasswordTab = ({ isActive }: { isActive: boolean }) => {
  const [isAuthLoading, setAuthLoading] = useState(false);
  const [passwordType, setPasswordType] = useState("password");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const setNewPassword = async (username: string, newPassword: string) => {
    try {
      setAuthLoading(true);
      await AuthService.newPassword(username, newPassword);
      toast.success("Password alterado com sucesso!");
      setAuthLoading(false);
      dispatch(logoutUser());
      navigate("/login");
    } catch (error) {
      setAuthLoading(false);
      toast.error("Erro na alteração da password!");
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

  return (
    <div className={`tab-pane ${isActive ? "active" : ""}`}>
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="form-group row">
          <div className="offset-sm-1 col-sm-10">
            <div className="mb-3">
              <label htmlFor="rePassword">
                <span>Password</span>
              </label>
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
              <label htmlFor="rePassword">
                <span>Confirmar a Password</span>
              </label>
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
            <div className="form-group row">
              <div className="col-12">
                <span className="float-right">
                  <Button type="submit" block isLoading={isAuthLoading}>
                    Salvar
                  </Button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PasswordTab;
