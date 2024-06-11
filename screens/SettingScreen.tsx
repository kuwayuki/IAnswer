import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { AppContextState, RootStackParamList } from "../App";
import PurchaseOptions from "./PurchaseOptions";

const { width: screenWidth } = Dimensions.get("window");
const SettingScreen: React.FC = () => {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Setting">>();
  const appContextState = useContext(AppContextState);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <PurchaseOptions />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  preview: {
    width: screenWidth,
    height: 500,
  },
  headerContainer: {
    position: "absolute",
  },
  toogleContainer: {
    top: 50,
    left: 5,
    backgroundColor: "rgba(255, 255, 255, 0)",
    alignSelf: "flex-start",
  },
  toogle: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  resultItem: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    marginBottom: 8,
  },
  answer: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "green",
  },
  answer_failed: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "red",
  },
  explanation: {
    fontSize: 14,
    marginBottom: 8,
    color: "#555",
  },
  result: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
  },
});
export default SettingScreen;
