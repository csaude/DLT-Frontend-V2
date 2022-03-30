import React, { Component } from 'react';
import AdminLTE, { Sidebar, Navbar, Content, Row, Col, Box, Button, Alert } from 'adminlte-2-react';

const { Item, Header } = Sidebar;
const {
  MessageItem, Entry, NotificationItem, TaskItem,
} = Navbar;

class HelloWorld extends Component {
  state = {}

  render() {
    return (<Content title="Hello World" subTitle="Getting started with adminlte-2-react" browserTitle="DLT WEB">
      <Row>
        <Col xs={6}>
          <Box title="My first box" type="primary" closable collapsable footer={<Button type="danger" text="Danger Button" />}>
            Hello World
          </Box>
        </Col>
        <Col xs={6}>
          <Box title="Another box" type="success">
            Content goes here
          </Box>
        </Col>
      </Row>
    </Content>);
  }
}

class Dashboard extends Component {
  state = {}

  render() {
    return (<Content title="Dashboard" subTitle="Primeira pagina usado o React e o AdmiLte" browserTitle="DLT WEB">
      <Row>
        <Col  xs={12}>
          <Box solid title="BEM VINDO AO SISTEMA DREAMS" type="info">
            <Row>
              <Col xs={12}>
                <Box >
                  <Button type="default" text="PRINCIPAIS INDICADORES"/>
                </Box>           
              </Col>
            </Row>
            <Row>
              <Col xs={8}> 
              <Box solid title=" CADASTROS POR PROVINCIA" type="success" footer={ <div> <Button type="default" text="Go Back" pullRight/> <Button type="warning" text="Ver mais" pullRight/></div>}>
                Dashboard  
              </Box>            
              </Col>
              <Col xs={4}> 
              <Box solid title="10 NOVOS BENEFICIÁRIOS" type="info" >
                /Lista de novos Beneficiarios 
              </Box>             
              </Col>
            </Row>
          </Box>
        </Col> 
      </Row>
      
    </Content>);
  }
}

class App extends Component {

  sidebar = [
    <Item icon="fas-pencil-ruler" text="Component Builder" to="/component-builder" />,
    <Item icon="fas-code" text="Examples with JSX" to="/examples-with-jsx" />,
    <Header text="MAIN NAVIGATION" />,
    <Item key="dashboard" text="Dashboard" to="/Dashboard" icon="fa-tachometer-alt" />,
    <Item key="hello" text="Beneficiários" to="/hello-world" icon="fa-users" labels={{ type: 'success', text: 451850 }}/>,
    <Item  text="Referências" icon="fa-tachometer-alt">
      <Item key="" text="Gestão de Referências" to="/" />
      <Item key="" text="Cancelamento de Referências Pendentes" to="/" />
    </Item>,
    <Item text="Configuraçoes" icon="" >
      <Item text="Provincias" to="/"  labels={{ type: 'default', text: 11 }} />
      <Item text="Distritos" to="/"  labels={{ type: 'default', text:  ''}} />
      <Item text="Postos Administrativos" to="/"  labels={{ type: 'default', text: '' }} />
      <Item text="Unidades Sanitárias" to="/"  labels={{ type: 'default', text: '' }} />
      <Item text="Bairros DREAMS" to="/"  labels={{ type: 'default', text: '' }} />
      <Item text="Escolas DREAMS" to="/"  labels={{ type: 'default', text: '' }} />
      <Item text="Serviços DREAMS" to="/"  labels={{ type: 'default', text:  129 }} />
      <Item text="Sub-Serviços DREAMS" to="/"  labels={{ type: 'default', text: 129 }} />
      <Item text="Parceiros DREAMS" to="/"  labels={{ type: 'default', text: 123 }} />
      <Item text="Nivel de Intervenção" to="/"  labels={{ type: 'default', text: 4 }} />
      <Item text="Faixa Etária" to="/"  labels={{ type: 'default', text: 12 }} />
      <Item text="Faixa Etária-Serviços" to="/"  labels={{ type: 'default', text: 93 }} />
      <Item text="Tipos de Serviços" to="/"  labels={{ type: 'default', text: 2 }} />
      <Item text="Tipos de Parceiros" to="/"  labels={{ type: 'default', text: 4 }} />
      <Item text="Tipos de US" to="/"  labels={{ type: 'default', text: 10 }} />
      <Item text="Curriculum" to="/"  labels={{ type: 'default', text: 0 }} />
      <Item text="Curriculum-Serviço" to="/"  labels={{ type: 'default', text: 0 }} />
    </Item>,
    <Item text="Caixa de Mensagens" to="/" icon="fa-envelope" labels={{ type: 'warning', text: '0' }} />,
    <Item text="Documentos Diversos" icon="fa-folder">
      <Item text="Manuais de Formação" to="/" />
      <Item text="Manual de Utilizador" to="/" />
      <Item text="Galeria de Fotos" to="/" />
    </Item>,
    <Item text="Utilizadores" icon="fa-user">
      <Item text="Criar Utilizadores" to="/" />
      <Item text="Actualizar Utilizadores" to="/" />
      <Item text="Listar Utilizadores" to="/" />
    </Item>,
    <Item text="RELATORIOS DREAMS" icon="fa-edit">
      <Item text="GERAL" to="" />
      <Item text="FILTROS DREAMS" to="" />
      <Item text="FILTRO MENSAL" to="" />
      <Item text="FILTROS UTILIZADORES" to="/" />
      <Item text="PEPFAR MER 2.6 AGYW_PREV" to="/" />
      <Item text="FY19" to="/" />
      <Item text="FY20" to="/" />
    </Item>,
  ]

  render() {
    return (
      <AdminLTE title={["DREAMS", ""]} titleShort={["D","LT"]} theme="purple" sidebar={this.sidebar}>
        <Navbar.Core>
          <Entry
            icon="fas-envelope"
          >
            {/* {this.messageMenu.map(p => <MessageItem {...p} />)}
            {this.notificationMenu.map(p => <NotificationItem {...p} />)} */}
          </Entry>
          <Entry
            icon="fas-bell"
            className="notifications-menu"
            labelType="warning"
          >
            {/* {this.notificationMenu.map(p => <NotificationItem {...p} />)} */}
          </Entry>
          <Entry
            icon="far-flag"
            className="tasks-menu"
            labelType="danger"
            headerText="You have #value# tasks"
            footerText="View all tasks"
          >
            {/* {this.taskMenu.map(p => <TaskItem {...p} />)} */}
          </Entry>
          <Entry
            icon="fas-power-off"
          />
        </Navbar.Core>
        <Dashboard path="/Dashboard" />
        <HelloWorld path="/hello-world" />
      </AdminLTE>
    );
  }
}

export default App;