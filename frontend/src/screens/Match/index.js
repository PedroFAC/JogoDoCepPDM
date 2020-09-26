import React, { useEffect, useState } from "react";
import { View, Text, Button, Modal } from "react-native";
import { TextInput } from "react-native-paper";
import io from "socket.io-client";
import viacep from "../../api/viacep";
import { useNavigation } from "@react-navigation/native";

const Match = ({ route }) => {
  const [cep, setCep] = useState("");
  const [shownCep, setShownCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [cidade, setCidade] = useState("");
  const [tentativas, setTentativas] = useState(0);
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [modalCep, setModalCep] = useState("");
  const [life, setLife] = useState(1000);
  const [victory, setVictory] = useState(false);
  const socket = io("http://192.168.15.3:8888");
  const { player } = route.params;
  const { navigate } = useNavigation();
  function sendCep(cep) {
    player === "server"
      ? socket.emit("sendServerCep", cep)
      : socket.emit("sendClientCep", cep);
  }
  async function validateCep() {
    try {
      const response = await viacep.get(`${modalCep}/json/`);
      response.status === 200
        ? (sendCep(modalCep), setShowModal(false))
        : alert("Cep inválido");
    } catch {
      alert("Cep inválido");
    }
  }
  function checkAnswer() {
    const digits = shownCep.slice(0, 3);
    socket.emit("message", cep);
    setTentativas(tentativas + 1);
    cep < digits ? setStatus("Maior") : setStatus("Menor");
    cep === digits
      ? (alert("Certa resposta"), setVictory(true), socket.emit("victory"))
      : (alert("Resposta errada"), setLife(life - 100));
  }
  useEffect(() => {
    async function fetchCep() {
      const response = await viacep.get(`${shownCep}/json/`);
      console.log(response.data);
      setLogradouro(response.data.logradouro);
      setCidade(response.data.localidade);
      setShownCep(response.data.cep);
    }
    fetchCep();
  }, [shownCep]);
  useEffect(() => {
    if (victory) {
      socket.emit("victory");
      alert("vitória");
      navigate("Home");
    } else {
      if (life === 0) {
        alert("derrota");
        navigate("Home");
      }
    }
  }, [victory, life]);
  useEffect(() => {
    socket.connect();
    socket.on("received", (receive) => {
      alert(receive);
    });
    socket.on("clientVictory", () => {
      if (player === "server") {
        alert("derrota");
      }
    });
    socket.on("serverVictory", () => {
      if (player === "client") {
        alert("derrota");
      }
    });
    socket.on("receiveServerCep", (serverCep) => {
      if (player === "client") {
        alert(serverCep)
        setShownCep(serverCep);
      }
    });
    socket.on("receiveClientCep", (clientCep) => {
      if (player === "server") {
        alert(clientCep)
        setShownCep(clientCep);
      }
    });
  }, []);
  return (
    <View>
      <Modal visible={showModal}>
        <View>
          <TextInput
            value={modalCep}
            onChangeText={(value) => setModalCep(value)}
          />
          <Button title="Confirmar CEP" onPress={() => validateCep()} />
        </View>
      </Modal>
      <View>
        <Text>CEP: {shownCep.replace(/^.{3}/g, "XXX")}</Text>
        <Text>Logradouro: {logradouro}</Text>
        <Text>Cidade: {cidade}</Text>
        <Text>Status: {status}</Text>
        <Text>Pontuação: {life}</Text>
        <Text>Tentativas: {tentativas}</Text>
        <TextInput
          maxLength={3}
          value={cep}
          onChangeText={(value) => setCep(value)}
        />
        <Button onPress={() => checkAnswer()} title={"Mandar"} />
      </View>
    </View>
  );
};

export default Match;
