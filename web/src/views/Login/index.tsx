
import React, { useState, Component} from "react";
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { View, KeyboardAvoidingView, 
        Image, TextInput, TouchableOpacity, 
        Text, Platform, ScrollView} 
        from 'react-native';
import { AuthModelState, Loading } from '../../models/Auth'

// import { Form } from '@unform/mobile';
// import { FormHandles } from '@unform/core'

import Input from "../../components/Inputs";

import styles from "./styles";
import { login } from "../../services/auth";

interface LoginProps {
    dispatch: Dispatch<AnyAction>;
}

interface LoginState {
    username: string;
    password: string;
}

@connect(({ logged }: AuthModelState) => ({
    submitting: logged,
  }))
export default class Login extends Component<LoginProps, LoginState>{

    state: LoginState = {
        username: "",
        password: ""
    };    

    validate_field=()=>{
        const { username, password} = this.state
/*
        if(username == ""){
            alert("Preencha o username!!!")
            return false
        }else if(password == ""){
            alert("Preencha a password!!!")
            return false
        }*/
        return true
    }

    handlerLogin=()=>{
        const { username, password } = this.state;
        const { dispatch } = this.props;

        if(this.validate_field() && dispatch){
            // login();
           // alert("Login efectuado com sucesso!!!")~
            //console.log(username, password);
            dispatch({
                type: 'auth/login',
                payload: {
                    username,
                    password
                },
            });

        }
        // console.log('Logar');
    }

    render(){
        return(
            <View style={styles.background}>
                <View style={styles.header}>
                    
                </View>
                <KeyboardAvoidingView>
                    <ScrollView  contentContainerStyle={styles.scrollView}>
                <View style={styles.containerPage}>
                    <View style={styles.containerLogo}>
                        <Text>Sign in</Text>
                    </View>
                    <View style={styles.containerLogin}>
                        <Text 
                            style={styles.txtLabel}>Login
                        </Text>
    
                        {/* <TextInput style={styles.input} placeholder="" autoCorrect={false} onChangeText={(value)=> { this.setState({ username: value }) }}/> */}
                 
                        <Input 
                            autoCorrect={false} 
                            autoCapitalize='none' 
                            keyboardType='default'
                            name="username"
                            returnKeyType="send"
                            onChangeText={(text : string)=> { this.setState({ username: text }) }} 
                        />
    
                        <Text style={styles.txtLabel}> Password (<Text style={styles.txtLink}>Forgot password?</Text>)</Text>
                       
                        {/* <TextInput style={styles.input} placeholder="" autoCorrect={false} onChangeText={()=> {}} secureTextEntry/> */}
                        
                        <Input 
                            autoCorrect={false} 
                            autoCapitalize='none' 
                            keyboardType='default'
                            name="password"
                            returnKeyType="send"
                            onChangeText={(text: string)=> { this.setState({ password: text }) }} 
                            secureTextEntry 
                        />
    
                        <View style={styles.checkboxContainer}>
                            {/* <CheckBox
                                disabled={false}
                                value={toggleCheckBox}
                                onValueChange={(newValue) => setToggleCheckBox(newValue)}
                                // style={styles.checkbox}
                            /> */}
                            <Text style={styles.txtLabel}>Remember me next time</Text>
                        </View>
    
                        <TouchableOpacity style={styles.btnSubmit} onPress={()=> this.handlerLogin()}>
                            <Text style={styles.txtSubmit}>SIGN IN</Text>
                        </TouchableOpacity>
                        {/* <Button style={styles.btnSubmit} title='SIGN IN' /> */}
                        <Text>{"Username:"+this.state.username}</Text>
                        <Text>{"Password:"+this.state.password}</Text>
                    </View>
                </View>
                </ScrollView>
                
                <View style={styles.container}>
                    <Text></Text>
                    <Image source={require('../../../assets/partners/Dreams_moz_icap_logo.png')}  style={styles.partners}/>
                    <Image source={require('../../../assets/partners/Dreams_moz_Jhpiego_logo.png')}  style={styles.partners}/>
                    <Image source={require('../../../assets/partners/DREAMS_MOZ_FHI360_LOGO.png')}  style={styles.partners}/>
                    <Image source={require('../../../assets/partners/Dreams_mz_wei-combined_logo.png')}  style={styles.partners}/>
                    <Image source={require('../../../assets/partners/dreams_moz_FGH_Logo.png')}  style={styles.partners}/>
                    <Image source={require('../../../assets/partners/Dreams_moz_NWETI_logo.png')}  style={styles.partners}/>
                    <Image source={require('../../../assets/partners/Dreams_mz_World_Vision_logo.png')}  style={styles.partners}/>
                    <Image source={require('../../../assets/partners/DREAMS_moz_elizabethglaser_logo.png')}  style={styles.partners}/>                   
    
                </View>
                
                </KeyboardAvoidingView>
                {/* // { </ScrollView> */}
             </View> 
        )
    }

    // //const { signed, loginData,user, login } = useAuth();
    // console.log(signed);
    // console.log(user);

    // async function handlerLogin(user1: String, pass: String){

    //     login();
    //     // console.log('Logar');
    // }

    // const [username, setUsername] = useState('');
    // const [password, setPassword] = useState('');

    // // const [isSelected, setSelection] = useState(false);
    // const [toggleCheckBox, setToggleCheckBox] = useState(false)

    
}

// export default Login;