import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import io from "socket.io-client";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  button: {
    margin: 10,
    padding: 10,
    width: "60%",
    alignSelf: "center",
  },
  input: {
    width: "80%",
    alignSelf: "center",
    margin: 10,
  },
});

const Client = () => {
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
  const { navigate } = useNavigation();

  function connectToSocket() {
    console.log(ip);
    const socket = io(`http://${ip}:${port}`);
    socket.connect();
    socket.on("connect", () => {
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
