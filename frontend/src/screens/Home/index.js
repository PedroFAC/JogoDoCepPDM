import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems:"center"
  },
  button: {
    margin:10,
    padding:15,
    width: "75%",
  },
});

const Home = () => {
  const { navigate } = useNavigation();
  return (
    <View style={styles.container}>
      <Button style={styles.button} mode="contained" onPress={() => navigate("Client")}>
        Jogar
      </Button>
      <Button style={styles.button} mode="contained" onPress={() => navigate("Server")}>
        Iniciar sessão
      </Button>
    </View>
  );
};

export default Home;
