import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import io from "socket.io-client";
import styles from './styles'


const Client = () => {
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
  const { navigate } = useNavigation();

  function connectToSocket() {
    const socket = io(`http://${ip}:${port}`);
    socket.connect();
    socket.emit("clientConnect");
    socket.on("openRoom", () => {
      navigate("Match", { player: "client", ip, port });
    });
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        mode="outlined"
        label="IP"
        value={ip}
        onChangeText={(value) => setIp(value)}
      />
      <TextInput
        style={styles.input}
        mode="outlined"
        label="Porta"
        value={port}
        onChangeText={(value) => setPort(value)}
      />
      <Button
        style={styles.button}
        mode="contained"
        onPress={() => connectToSocket()}
      >
        Entrar
      </Button>
    </View>
  );
};

export default Client;
