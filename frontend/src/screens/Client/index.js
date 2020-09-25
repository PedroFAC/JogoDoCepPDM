import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import io from 'socket.io-client'

const Client = () => {
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
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
      <Button onPress={()=>navigate('Match')} title="Entrar" />
    </View>
  );
};

export default Client;
