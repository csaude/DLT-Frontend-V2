import { Dimensions, StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
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
  webStyle1: {
    ...Platform.select({
      web: {
        paddingLeft: "5%",
        paddingRight: "5%",
        backgroundColor: "#CCCCCC",
      },
    }),
  },
  containerForm: {
    padding: 30,
    paddingBottom: 70,
    // justifyContent: 'space-around',
    backgroundColor: "#fff",
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 5,
    margin: 15,
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
  dropDownPicker: {
    color: "#222",
    height: 40,
    fontSize: 14,
    backgroundColor: "#fff",
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
    color: "black",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: "1%",
    marginTop: 15,
    marginBottom: 5,
  },

  user: {
    width: Dimensions.get("window").width,
    marginTop: 85,
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
  fab: {
    marginTop: 35,
    marginLeft: 10,
    backgroundColor: "#0c4a6e",
    width: 46,
    height: 46,
    alignItems: "center",
    color: "#fff",
    fontSize: 30,
  },
});

export default styles;
