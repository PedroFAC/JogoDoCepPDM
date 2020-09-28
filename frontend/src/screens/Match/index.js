import React, { useEffect, useState } from "react";
import { View, Modal, StyleSheet } from "react-native";
import { TextInput, Text, Button } from "react-native-paper";
import io from "socket.io-client";
import viacep from "../../api/viacep";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";

const Match = ({ route }) => {
  const { player, ip, port, checked } = route.params;
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
  const [lockBack, setLockBack] = useState(true);
  const [race, setRace] =
    player === "server" ? useState(checked) : useState("");
  const socket = io(`http://${ip}:${port}`);
  const { navigate, addListener, dispatch } = useNavigation();
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
    setTentativas(tentativas + 1);
    cep < digits ? setStatus("Maior") : setStatus("Menor");
    cep === digits
      ? (alert("Certa resposta"),
        setVictory(true),
        player === "server"
          ? socket.emit("serverVictory")
          : socket.emit("clientVictory"))
      : (alert("Resposta errada"), setLife(life - 50));
  }

  async function getCep(cep) {
    const response = await viacep.get(`${cep}/json/`);
    console.log(response.data);
    setLogradouro(response.data.logradouro);
    setCidade(response.data.localidade);
    setShownCep(response.data.cep);
  }
  useEffect(() => {
    if (victory) {
      player === "server"
        ? socket.emit("serverVictory")
        : socket.emit("clientVictory");
      alert("Vitória!");
      setLockBack(false);
      navigate("Home");
    } else {
      if (life === 0) {
        player === "server"
          ? socket.emit("clientVictory")
          : socket.emit("serverVictory");
        alert("Derrota!");
        setLockBack(false);
        navigate("Home");
      }
    }
  }, [victory, life]);
  useEffect(() => {
    socket.connect();
    if (player === "server") {
      socket.emit("sendRace", race);
    }
    socket.on("clientDefeat", () => {
      if (player === "server") {
        alert("Vitória!");
        setLockBack(false);
        navigate("Home");
      } else {
        alert("Derrota!");
        setLockBack(false);
        navigate("Home");
      }
    });
    socket.on("serverDefeat", () => {
      if (player === "client") {
        alert("Vitória!");
        setLockBack(false);
        navigate("Home");
      } else {
        alert("Derrota!");
        setLockBack(false);
        navigate("Home");
      }
    });
    socket.on("receiveServerCep", (serverCep) => {
      if (player === "client") {
        getCep(serverCep);
      }
    });
    socket.on("receiveClientCep", (clientCep) => {
      if (player === "server") {
        getCep(clientCep);
      }
    });
    socket.on("receiveRace", (race) => {
      if (player === "client") {
        race === "Morlock" ? setRace("Eloi") : setRace("Morlock");
      }
    });
  }, []);
  useEffect(() => {
    addListener("blur", () => {
      socket.emit("end");
    });
  }, []);
  
  return (
    <View>
      <Modal visible={showModal}>
        <View style={styles.container}>
          <TextInput
            label="CEP do oponente"
            style={styles.input}
            mode="outlined"
            value={modalCep}
            onChangeText={(value) => setModalCep(value)}
          />
          <Button
            style={styles.button}
            mode="contained"
            onPress={() => validateCep()}
          >
            Confirmar CEP
          </Button>
        </View>
      </Modal>
      <View>
        <View style={styles.cepInfo}>
          <Text style={styles.cepText}>
            CEP: {shownCep.replace(/^.{3}/g, "XXX")}
          </Text>
          <Text style={styles.text}>Logradouro: {logradouro}</Text>
          <Text style={styles.text}>Cidade: {cidade}</Text>
          <Text style={styles.text}>Status: {status}</Text>
          <Text style={styles.text}>Pontos de vida: {life}</Text>
          <Text style={styles.text}>Tentativas: {tentativas}</Text>
        </View>
        <View>
          <TextInput
            label="Dígitos"
            style={styles.input}
            mode="outlined"
            maxLength={3}
            value={cep}
            onChangeText={(value) => setCep(value)}
          />
          <Button
            style={styles.button}
            mode="contained"
            onPress={() => checkAnswer()}
          >
            Mandar
          </Button>
          <Text style={styles.race}>Jogando como {race}</Text>
        </View>
      </View>
    </View>
  );
};

export default Match;
