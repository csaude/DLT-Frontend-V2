import React from 'react';
import {Link} from 'react-router-dom';
import {ContentHeader, Button} from '@components';
import Select from 'react-select';

const UserForm = () => {
  return (
    <div>
      <ContentHeader title="Novo Utilizador do DLT" />
      <section className="content">
        <div className="container-fluid">
          <div className="card" >
            <div className="card-header">
              <h3 className="card-title">Registo de novo Utilizador</h3>
            </div>
            <div className="card-body">
                <form className="form-horizontal">
                    <div className="form-group row">
                    <label htmlFor="inputApelido" className="col-sm-2 col-form-label">
                        Apelido
                    </label>
                    <div className="col-sm-10">
                        <input
                        type="email"
                        className="form-control"
                        id="inputApelido"
                        placeholder="Apelido"
                        />
                    </div>
                    </div>
                    <div className="form-group row">
                    <label htmlFor="inputName" className="col-sm-2 col-form-label">
                        Nome
                    </label>
                    <div className="col-sm-10">
                        <input
                        type="email"
                        className="form-control"
                        id="inputName"
                        placeholder="Nome"
                        />
                    </div>
                    </div>
                    <div className="form-group row">
                    <label htmlFor="inputEmail" className="col-sm-2 col-form-label">
                        Email
                    </label>
                    <div className="col-sm-10">
                        <input
                        type="email"
                        className="form-control"
                        id="inputEmail"
                        placeholder="Email"
                        />
                    </div>
                    </div>
                    <div className="form-group row">
                    <label htmlFor="inputUsername" className="col-sm-2 col-form-label">
                        Username
                    </label>
                    <div className="col-sm-10">
                        <input
                        type="text"
                        className="form-control"
                        id="inputUsername"
                        placeholder="Username"
                        />
                    </div>
                    </div>
                    <div className="form-group row">
                    <label htmlFor="inputPassword" className="col-sm-2 col-form-label">
                    Password
                    </label>
                    <div className="col-sm-10">
                        <input
                        type="text"
                        className="form-control"
                        id="inputPassword"
                        placeholder="Password"
                        />
                    </div>
                    </div>
                    <div className="form-group row">
                    <label htmlFor="inputTelemovel" className="col-sm-2 col-form-label">
                        Telemóvel
                    </label>
                    <div className="col-sm-10">
                        <input
                        className="form-control"
                        id="inputTelemovel"
                        placeholder="Telemóvel"
                        />
                    </div>
                    </div>
                    <div className="form-group row">
                    <label htmlFor="selectPontoDeEntrada" className="col-sm-2 col-form-label">
                        Ponto De Entrada
                    </label>
                    <div className="col-sm-10">  
                        <Select id="selectPontoDeEntrada" name="selectPontoDeEntrada"
                            placeholder="Ponto De Entrada"
                            options={[{value: '1', label: 'One'},
                                        {value: '2', label: 'Two'}
                                    ]} />
                    </div>
                    </div>
                    <div className="form-group row">
                    <label htmlFor="selectParceiro" className="col-sm-2 col-form-label">
                        Parceiro
                    </label>
                    <div className="col-sm-10">  
                        <Select id="selectParceiro" name="selectParceiro"
                            placeholder="Parceiro"
                            options={[{value: '1', label: 'One'},
                                        {value: '2', label: 'Two'}
                                    ]} />
                    </div>
                    </div>
                    <div className="form-group row">
                    <label htmlFor="selectPerfil" className="col-sm-2 col-form-label">
                        Perfil
                    </label>
                    <div className="col-sm-10">  
                        <Select id="selectPerfil" name="selectPerfil"
                            placeholder="Perfil"
                            options={[{value: '1', label: 'One'},
                                        {value: '2', label: 'Two'}
                                    ]} />
                    </div>
                    </div>
                    <div className="form-group row">
                    <label htmlFor="selecLocalidade" className="col-sm-2 col-form-label">
                        Localidade
                    </label>
                    <div className="col-sm-10">  
                        <Select id="selectLocalidade" name="selectLocalidade"
                            placeholder="Localidade"
                            options={[{value: '1', label: 'One'},
                                        {value: '2', label: 'Two'}
                                    ]} />
                    </div>
                    </div>
                    <div className="form-group row">
                    <label htmlFor="selecUS" className="col-sm-2 col-form-label">
                        US
                    </label>
                    <div className="col-sm-10">  
                        <Select id="selectUS" name="selectUS"
                            placeholder="US"
                            options={[{value: '1', label: 'One'},
                                        {value: '2', label: 'Two'}
                                    ]} />
                    </div>
                    </div>
                    <div className="form-group row">
                    <label htmlFor="selecEstado" className="col-sm-2 col-form-label">
                        Estado
                    </label>
                    <div className="col-sm-10">  
                        <Select id="selectEstado" name="selectEstado"
                            placeholder="Estado"
                            options={[{value: '1', label: 'One'},
                                        {value: '2', label: 'Two'}
                                    ]} />
                    </div>
                    </div>
                    <div className="form-group row">
                    <div className="offset-sm-2 col-sm-10">
                        <div className="icheck-primary">
                        <input
                            type="checkbox"
                            id="agreeTerms"
                            name="terms"
                            defaultValue="agree"
                        />
                        <label htmlFor="agreeTerms">
                            <span>Eu aceito os </span>
                            <Link to="/">termos e condiçoes</Link>
                        </label>
                        </div>
                    </div>
                    </div>
                    <div className="form-group row">
                    <div className="offset-sm-2 col-sm-10">
                        <Button type="submit" theme="danger">
                            back
                        </Button>
                        <Button type="submit" theme="success">
                            Gravar
                        </Button>
                    </div>
                    </div>
                </form>
            </div>
            <div className="card-footer">Footer</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserForm;
