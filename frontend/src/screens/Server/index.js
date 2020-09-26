import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const Server = () => {
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
  const [checked, setChecked] = useState("Eloi");
  const { navigate } = useNavigation();
  return (
    <View>
      <TextInput
        placeholder="IP"
        value={ip}
        onChangeText={(value) => setIp(value)}
      />
      <TextInput
        placeholder="Porta"
        value={port}
        onChangeText={(value) => setPort(value)}
      />
      <View>
        <Text>Eloi</Text>
        <RadioButton
          value="Eloi"
          status={checked === "Eloi" ? "checked" : "unchecked"}
          onPress={() => setChecked("Eloi")}
        />
      </View>
      <View>
        <Text>Morlock</Text>
        <RadioButton
          value="Morlock"
          status={checked === "Morlock" ? "checked" : "unchecked"}
          onPress={() => setChecked("Morlock")}
        />
      </View>
      <Button onPress={() => navigate("Match",{player: 'server'})} title="Entrar" />
    </View>
  );
};

export default Server;
