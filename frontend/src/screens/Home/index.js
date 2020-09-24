import React from "react";
import { View, Button, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const {navigate} = useNavigation()
  return (
    <View>
      <Button title="Jogar" onPress={() => navigate("Client")}/>
      <Button title="Iniciar Sessão" onPress={() => navigate("Server")}/>
    </View>
  );
};

export default Home;
