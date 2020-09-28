import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import styles from './styles'



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
