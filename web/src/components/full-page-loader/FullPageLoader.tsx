import React, {Component} from 'react';
import { Spinner } from 'react-bootstrap';

class FullPageLoader extends Component {
    state = { }

    render() {
        return (
            <div className="loader-container">
                <div className="loader">
                    <Spinner animation="border" variant="primary" />
                    <span className="visually-hidden">Carregando. Aguarde Por Favor.</span>
                </div>
            </div>
        );
    }
}

export default FullPageLoader;