import { Dimensions, StyleSheet} from 'react-native';

const { width, height} = Dimensions.get("screen");

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    heading: {
      height: 60,
      backgroundColor: '#e0f2fe',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headingTest: {
      fontSize: 20,
      color: '#0c4a6e',
      fontWeight: 'bold',
    },
    list: {
      margin: 5,
      backgroundColor: 'white',
      height:80,
      justifyContent: 'space-around',
      paddingLeft: 10,
      elevation: 1
    },
    fab: {
      position: 'absolute',
      width: 66,
      height: 66,
      alignItems: 'center',
      justifyContent: 'center',
      right: 20,
      bottom: 20,
      backgroundColor: '#0c4a6e',
      borderRadius: 40,
      elevation: 8,
    },
    fabIcon: {
      fontSize: 40,
      color: '#FFF',
    },
    
  backTextWhite: {
      color: '#FFF',
  },
  rowFront: {
      alignItems: 'center',
      backgroundColor: 'white',
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      justifyContent: 'center',
      height: 90,
  },
  rowBack: {
      alignItems: 'center',
      backgroundColor: 'white',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 15,
  },
  backRightBtn: {
      alignItems: 'center',
      bottom: 0,
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      width: 75,
  },
  backRightBtnLeft: {
      backgroundColor: 'blue',
      right: 75,
  },
  backRightBtnRight: {
      backgroundColor: 'red',
      right: 0,
  },
  });

  export default styles;