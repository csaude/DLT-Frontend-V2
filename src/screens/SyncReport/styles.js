import { Dimensions, StyleSheet, Platform } from "react-native";

const { width, height } = Dimensions.get("screen");

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
  containerForm: {
    padding: 30,
    paddingBottom: 70,
    justifyContent: 'space-between',
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
  fabIcon: {
    fontSize: 40,
    color: "white",
  },
});

export default styles;
