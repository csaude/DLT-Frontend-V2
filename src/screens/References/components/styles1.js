
import { Dimensions, StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
    containerForm: {
        padding: 10,
        paddingBottom: 10,
        // justifyContent: 'space-around',
        backgroundColor: '#f9f9fc',
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 5,
        margin: 5,
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 90,
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: '#17a2b8',
        borderRadius: 30,
        elevation: 8
    },
    container: {
        //flex: 1,
        //backgroundColor: '#ccfbf1',
    },
    heading: {
        
        height: 60,
        backgroundColor: '#f0fdfa',
        alignItems: 'center',
        justifyContent: 'center',
    },
    txtLabel:{
        color: 'black',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: '1%',
        color: '#002851',
    },
    txtLabelInfo:{
        marginTop: '2%',
        //marginBottom: '2%',
        color: '#134e4a',
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
});

export default styles;