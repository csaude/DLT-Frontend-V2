import React, {Component} from 'react';
import { Spinner } from 'react-bootstrap';

class FullPageLoader extends Component {
    state = { }

    render() {
        return (
            <div className="loader-container">
                <div className="loader">
                    <Spinner animation="border" variant="primary" />
                </div>
            </div>
        );
    }
}

export default FullPageLoader;