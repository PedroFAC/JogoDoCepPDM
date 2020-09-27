import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { RadioButton, Button, Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

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
  radio: {
    flexDirection: "row",
  },
  radioGroup: {
    alignSelf: "center",
  },
});
const Server = () => {
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
  const [checked, setChecked] = useState("Eloi");
  const { navigate } = useNavigation();
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
      <View style={styles.radioGroup}>
        <RadioButton.Group>
          <View style={styles.radio}>
            <RadioButton
              value="Eloi"
              status={checked === "Eloi" ? "checked" : "unchecked"}
              onPress={() => setChecked("Eloi")}
            />
            <Text>Eloi</Text>
          </View>
          <View style={styles.radio}>
            <RadioButton
              value="Morlock"
              status={checked === "Morlock" ? "checked" : "unchecked"}
              onPress={() => setChecked("Morlock")}
            />
            <Text>Morlock</Text>
          </View>
        </RadioButton.Group>
      </View>
      <Button
        style={styles.button}
        mode="contained"
        onPress={() => navigate("Match", { player: "server", ip, port })}
      >
        Entrar
      </Button>
    </View>
  );
};

export default Server;
