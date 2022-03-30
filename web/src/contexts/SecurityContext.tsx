import { Dispatch } from 'redux';
import React, { Component } from 'react';
import { connect } from 'dva';
import { View, ActivityIndicator, Platform} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Users, UsersModelState } from '../models/Users';
import { AuthModelState } from '../models/Auth';
//import AuthRoutes from '../routes/auth.routes';
import AppRoutes from '../routes';


interface SecurityLayoutProps {
    dispatch?: Dispatch;
    loading: boolean;
    currentUser: Users;
    logged: boolean;
}

export interface Loading {
    effects: { [key: string]: boolean | undefined };
    models: {
      menu?: boolean;
      setting?: boolean;
      users?: boolean;
      login?: boolean;
    };
}

interface SecurityState {
    isReady: boolean;
}

class SecurityContext extends Component<SecurityLayoutProps, SecurityState> {
    state: SecurityState = {
        isReady: false,
    };

  

    render() {
        const { isReady } = this.state;
        const { loading, currentUser, logged } = this.props;

        const isLogged = logged && currentUser !== undefined;

       /* if ((!isLogged && loading) || !isReady) {
            return(
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color="blue" />
                </View>
            );
        }*/
        
        return <AppRoutes />
       
    }

}
export default connect(({ loggedUser, logged }: AuthModelState) => ({
    currentUser: loggedUser,
    logged: logged,
}))(SecurityContext);
