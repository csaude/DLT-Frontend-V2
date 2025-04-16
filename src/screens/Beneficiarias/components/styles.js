import { Dimensions, StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  textBlack: {
    color: "#212121",
  },
  webStyle: {
    ...Platform.select({
      web: {
        paddingLeft: "25%",
        paddingRight: "25%",
        backgroundColor: "#CCCCCC",
      },
    }),
  },
  containerForm: {
    padding: 10,
    paddingBottom: 10,
    // justifyContent: 'space-around',
    backgroundColor: "#f9f9fc",
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
  },
  formTitle: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#D9EDF7",
    borderColor: "#BCE8F1",
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
  },
  textTitle: {
    color: "#517E96",
  },
  input: {
    color: "#222",
    height: 40,
    fontSize: 14,
    backgroundColor: "#fff",
    borderColor: "#CCCCCC",
    borderWidth: 1,
    marginHorizontal: 5,
    paddingLeft: 10,
  },
  rowFront: {
    alignItems: "center",
    backgroundColor: "white",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 90,
  },
  dropDownPicker: {
    width: '100%',
    color: "#222",
    height: 40,
    fontSize: 14,
    backgroundColor: "#fff",
    borderColor: "#CCCCCC",
    borderWidth: 1,
    marginHorizontal: 5,
  },
  dropDownPickerDisabled: {
    color: "#222",
    height: 40,
    fontSize: 14,
    backgroundColor: "#ddd",
    borderColor: "#CCCCCC",
    borderWidth: 1,
    marginHorizontal: 5,
  },
  btnDiv: {
    height: 50,
    marginTop: 20,
    alignItems: "center",
  },
  btnSubmit: {
    backgroundColor: "#008D4C",
    // marginTop: 15,
    width: "40%",
    height: "100%",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "1%",
  },
  txtSubmit: {
    color: "#fff",
    fontWeight: "500",
  },
  txtLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: "1%",
    color: "white",
  },
  txtLabelInfo: {
    marginTop: "2%",
    //marginBottom: '2%',
    color: "white",
  },

  user: {
    width: Dimensions.get("window").width,
    marginTop: 100,
  },
  userLogo: {
    alignItems: "center",
    marginTop: -100,
  },
  userText: {
    marginTop: 12,
    alignItems: "center",
  },
  username: {
    fontSize: 25,
    fontWeight: "600",
  },
  nui: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: "8%",
    color: "#008D4C",
  },
  formNUI: {
    fontSize: 15,
    fontWeight: "800",
    color: "#008D4C",
  },
  subServices: {
    color: "white",
    //marginTop: '2%',
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#0c4a6e",
    borderRadius: 30,
    elevation: 8,
  },
  fab1: {
    position: "absolute",
    width: 66,
    height: 66,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 40,
    backgroundColor: "#e0f2fe",
    borderRadius: 40,
    elevation: 8,
  },
  fabStagger: {
    position: "absolute",
    width: 56,
    height: 256,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    borderRadius: 40,
  },
  fabPrincipal: {
    position: "absolute",
    width: 76,
    height: 226,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    borderRadius: 40,
  },
  fabIcon: {
    fontSize: 40,
    color: "white",
  },
  buttonStyle: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 25,
    margin: 0,
    borderRadius: 4,
    backgroundColor: "#d1fae5",
  },
  buttonSaveStyle: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 25,
    margin: 0,
    borderRadius: 4,
    backgroundColor: "#0e7490",
  },
  buttonTextStyle: {
    color: "#34d399",
  },
  buttonTextSaveStyle: {
    color: "white",
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
  },
  inputText: {
    color: "#333",
  },
  selectedItemText: {
    fontSize: 16,
    color: '#333',
  },
  
  myDropDownPicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
  },
  
  item: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  itemText: {
    fontSize: 16,
    marginLeft: 8,
  },
  
});

export default styles;
