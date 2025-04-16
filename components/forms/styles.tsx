import { StyleSheet } from "react-native";

export const formStyles = StyleSheet.create({
  input: {
    height: 40,
    paddingVertical: 0,
    borderWidth: 0,
    fontSize: 14,
    color: "darkgrey",
    backgroundColor: "lightgrey",
    justifyContent: "center",
  },

  multiLine: {
    paddingVertical: 10,
    borderWidth: 0,
    fontSize: 14,
    color: "darkgrey",
    backgroundColor: "lightgrey",
    justifyContent: "center",
  },

  currencyInput: {
    height: 40,
    paddingVertical: 0,
    borderWidth: 0,
    fontSize: 14,
    color: "darkgrey",
    backgroundColor: "lightgrey",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "black",
  },
  pickerContainer: {
    backgroundColor: "white",
    paddingBottom: 20,
    color: "black",
  },
  pickerBtn: {
    backgroundColor: "lightgrey",
    borderRadius: 10,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 10,
  },
  calendarModalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
});
