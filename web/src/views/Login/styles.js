
import { Dimensions, StyleSheet} from 'react-native';

const { width, height} = Dimensions.get("screen");

const styles = StyleSheet.create({
    background:{       
        width: '100%',
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EEEEEE',
    },
    scrollView:{
        // flex:1,       
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EEEEEE',
    },
    header:{             
        width: '100%',     
        // width: 2000,
        // flex:1,
        height: 80,
        // marginTop: -200,
        backgroundColor: '#009587',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    containerPage:{
        // flex:1,
        // backgroundColor: '#009587',
        margin: 10,
        marginTop: 20,   
        // width: '32%', 
        width: 380,
        shadowColor: '#000',
        shadowOffset:{
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 4,
    },
    containerLogo:{           
        // width: '100%',
        borderTopStartRadius: 2,
        borderTopEndRadius: 2,
        padding:10,
        backgroundColor: '#ECECEC',
        justifyContent: 'center',
    },
    containerLogin:{
        flex:1,           
        // width: '35%',
        padding: 20,
        justifyContent: 'space-around',
        backgroundColor: '#fff',
    },
    container:{           
        width: '100%',        
        // flex: 0.2,
        padding: 2,
        // marginTop: 200,
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
        flexDirection: "row",

    },
    input:{
        color: '#222',
        // fontSize: 13,
        // padding:10,
        // borderEndColor: '#009587',
        borderColor:'#222',
        // borderBottomWidth:1,
    },
    btnSubmit:{
        backgroundColor:'#009587',
        marginTop: 15,
        width: '98%',
        height: '15%',
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '1%',
    },
    txtSubmit:{
        color: '#fff',
    },
    txtLabel:{
        color: 'black',
        fontSize: 14,
        fontWeight: '700',
    },
    txtLink:{
        color: '#009587',
        fontSize: 14,
    },
    checkboxContainer: {
        flexDirection: "row",
        marginTop: 8,
    },
    checkbox: {
        alignSelf: "center",
        marginRight: 3,
    },
    partners:{
        width: 140, 
        height: 65, 
        resizeMode: 'contain',
    }

});

export default styles;