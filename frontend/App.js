import { StyleSheet, View, Text, LogBox } from "react-native";
import AppNavigation from "./navigation/AppNavigation";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useEffect } from "react";


export default function App() {
  LogBox.ignoreAllLogs(true);
  return <AppNavigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
