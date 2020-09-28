import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { RadioButton, Button, Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import io from "socket.io-client";
import styles from "./styles";

const Server = () => {
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
  const [checked, setChecked] = useState("Eloi");
  const [waiting, setWaiting] = useState(false);
  const { navigate } = useNavigation();
  function connectToSocket() {
    const socket = io(`http://${ip}:${port}`);
    socket.connect();
    socket.emit("serverConnect");
    socket.on("waitingClient", () => {
      setWaiting(true);
      alert("Por favor espere seu oponente se juntar a sala");
    });
    socket.on("openRoom", () => {
      navigate("Match", { player: "server", ip, port, checked });
    });
  }
  return (
    <View style={styles.container}>
      <TextInput
        disabled={waiting}
        style={styles.input}
        mode="outlined"
        label="IP"
        value={ip}
        onChangeText={(value) => setIp(value)}
      />
      <TextInput
        disabled={waiting}
        style={styles.input}
        mode="outlined"
        label="Porta"
        value={port}
        onChangeText={(value) => setPort(value)}
      />
      <View style={styles.radioGroup}>
        <RadioButton.Group>
          <View style={styles.radio}>
            <RadioButton
              disabled={waiting}
              value="Eloi"
              status={checked === "Eloi" ? "checked" : "unchecked"}
              onPress={() => setChecked("Eloi")}
            />
            <Text>Eloi</Text>
          </View>
          <View style={styles.radio}>
            <RadioButton
              disabled={waiting}
              value="Morlock"
              status={checked === "Morlock" ? "checked" : "unchecked"}
              onPress={() => setChecked("Morlock")}
            />
            <Text>Morlock</Text>
          </View>
        </RadioButton.Group>
      </View>
      <Button
        disabled={waiting}
        style={styles.button}
        mode="contained"
        onPress={() => connectToSocket()}
      >
        Entrar
      </Button>
    </View>
  );
};

export default Server;
