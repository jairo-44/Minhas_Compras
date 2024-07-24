import React, { useState } from "react";
import { KeyboardAvoidingView, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import firebase from "../config/firebaseconfig";
import 'firebase/compat/auth';

import { MaterialCommunityIcons } from "@expo/vector-icons";

const NovoUsuario = ({ navigation }) => {  
  const [nome, setNome] = useState(""); // Adiciona estado para armazenar o nome
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errorRegister, setErrorRegister] = useState(false);

  const register = () => {
    firebase.auth().createUserWithEmailAndPassword(email, senha)
      .then((userCredential) => {
        let user = userCredential.user;
        // Atualiza o perfil do usuário com o nome
        user.updateProfile({
          displayName: nome
        }).then(() => {
          navigation.navigate("Login", { idUser: user.uid });
        }).catch((error) => {
          console.error("Erro ao atualizar o perfil do usuário:", error);
        });
      })
      .catch((error) => {
        setErrorRegister(true);
        console.error("Erro ao registrar:", error.code, error.message);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.title}>Crie sua conta</Text>
      {/* Novo campo para capturar o nome */}
      <TextInput
        style={styles.input}
        placeholder='Digite seu nome completo'
        type='text'
        onChangeText={(text) => setNome(text)}
        value={nome}
      />
      <TextInput
        style={styles.input}
        placeholder='Digite um email válido'
        type='text'
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        placeholder='Digite uma senha'
        type='text'
        onChangeText={(text) => setSenha(text)}
        value={senha}
      />
      {errorRegister && (
        <View style={styles.contentAlert}>
          <MaterialCommunityIcons
            name='alert-circle'
            size={24}
            color="#bdbdbd"
          />
          <Text style={styles.warninAlert}>Email ou senha inválidos!</Text>
        </View>
      )}
      {(nome === "" || email === "" || senha === "") ? (
        <TouchableOpacity
          disabled={true}
          style={styles.buttonRegistro}
        >
          <Text style={styles.textButtonRegistro}>Registrar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.buttonRegistro}
          onPress={register}
        >
          <Text style={styles.textButtonRegistro}>Registrar</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.login}>Já é registrado?</Text>
      <Text
        style={styles.linkLogin}
        onPress={() => navigation.navigate("Login")}
      >
        Faça o login!
      </Text>
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

export default NovoUsuario;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 25,
    color: "#F92E6A",
    marginTop: 10,
    marginBottom:35,
    fontWeight: "bold",
  },
  input: {
    width: 300,
    marginTop: 10,
    padding: 10,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#F92E6A",
    marginLeft: "auto",
    marginRight: "auto",
    color: "#4d5156"
  },
  buttonRegistro: {
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F92E6A",
    borderRadius: 30,
    marginTop: 45
  },
  textButtonRegistro: {
    color: "#ffffff",
  },
  contentAlert: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  warninAlert: {
    paddingLeft: 10,
    color: "#bdbdbd",
    fontSize: 16,
  },
  login: {
    marginTop: 40,
    color: "#4d5156"
  },
  linkLogin: {
    color: "#1877f2",
    fontSize: 16,
    marginTop: 15,
  }
})
