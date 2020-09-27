import React, { useEffect, useState } from "react";
import { View, Modal, StyleSheet } from "react-native";
import { TextInput, Text, Button } from "react-native-paper";
import io from "socket.io-client";
import viacep from "../../api/viacep";
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
  cepInfo:{
    padding:10
  },
  cepText:{
    fontSize:28
  },
  text:{
    fontSize:18
  }
});

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
  const { navigate, addListener } = useNavigation();
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
      ? (alert("Certa resposta"),
        setVictory(true),
        player === "server"
          ? socket.emit("serverVictory")
          : socket.emit("clientVictory"))
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
    socket.on("clientDefeat", () => {
      if (player === "client") {
        alert("derrota");
        navigate("Home");
      }
    });
    socket.on("serverDefeat", () => {
      if (player === "server") {
        alert("derrota");
        navigate("Home");
      }
    });
    socket.on("receiveServerCep", (serverCep) => {
      if (player === "client") {
        alert(serverCep);
        setShownCep(serverCep);
      }
    });
    socket.on("receiveClientCep", (clientCep) => {
      if (player === "server") {
        alert(clientCep);
        setShownCep(clientCep);
      }
    });
  }, []);
  useEffect(()=>{
    addListener('beforeRemove', (e)=>{
      e.preventDefault();
    })
  },[])
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
          <Text style={styles.cepText}>CEP: {shownCep.replace(/^.{3}/g, "XXX")}</Text>
          <Text style={styles.text}>Logradouro: {logradouro}</Text>
          <Text style={styles.text}>Cidade: {cidade}</Text>
          <Text style={styles.text}>Status: {status}</Text>
          <Text style={styles.text}>Pontuação: {life}</Text>
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
        </View>
      </View>
    </View>
  );
};

export default Match;
