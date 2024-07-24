import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import firebase from "../config/firebaseconfig";

const EditarPerfil = () => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      setNome(user.displayName || "");
      
      // Supondo que você tenha armazenado telefone e data de nascimento no Firestore
      const database = firebase.firestore();
      const userDoc = database.collection("users").doc(user.uid);
      userDoc.get().then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          setTelefone(userData.telefone || "");
          setDataNascimento(userData.dataNascimento || "");
        }
      });
    }
  }, []);

  const adicionarNomeAoPerfil = (nome, telefone, dataNascimento) => {
    const user = firebase.auth().currentUser;
    const database = firebase.firestore();

    if (user) {
      user.updateProfile({
        displayName: nome
      }).then(() => {
        database.collection("users").doc(user.uid).set({
          telefone: telefone,
          dataNascimento: dataNascimento
        }, { merge: true }).then(() => {
          console.log("Nome, telefone e data de nascimento adicionados ao perfil com sucesso!");
          Alert.alert("Sucesso!", "Perfil editado com sucesso!");
        }).catch((error) => {
          console.error("Erro ao adicionar telefone e data de nascimento ao perfil:", error);
        });
      }).catch((error) => {
        console.error("Erro ao adicionar nome ao perfil:", error);
      });
    } else {
      console.error("Nenhum usuário autenticado encontrado.");
    }
  };

  const handleSaveProfile = () => {
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!phoneRegex.test(telefone)) {
      Alert.alert("Erro", "Telefone inválido. Formato correto: (00) 00000-0000");
      return;
    }

    if (!dateRegex.test(dataNascimento)) {
      Alert.alert("Erro", "Data de nascimento inválida. Formato correto: dd/mm/aaaa");
      return;
    }

    adicionarNomeAoPerfil(nome, telefone, dataNascimento);
  };

  const formatPhone = (value) => {
    value = value.replace(/\D/g, ""); // Remove tudo que não é dígito
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2"); // Adiciona parênteses e espaço após os dois primeiros dígitos
    value = value.replace(/(\d{5})(\d)/, "$1-$2"); // Adiciona o hífen após os primeiros cinco dígitos
    setTelefone(value);
  };

  const formatDate = (value) => {
    value = value.replace(/\D/g, ""); // Remove tudo que não é dígito
    value = value.replace(/(\d{2})(\d)/, "$1/$2"); // Adiciona a primeira barra
    value = value.replace(/(\d{2})(\d)/, "$1/$2"); // Adiciona a segunda barra
    setDataNascimento(value);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite seu telefone"
        value={telefone}
        onChangeText={formatPhone}
        keyboardType="phone-pad"
        maxLength={15} 
      />
      <TextInput
        style={styles.input}
        placeholder="Digite sua data de nascimento"
        value={dataNascimento}
        onChangeText={formatDate}
        keyboardType="numeric"
        maxLength={10} // Limita o número de caracteres para o formato dd/mm/aaaa
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  input: {
    width: "90%",
    marginTop: 10,
    padding: 10,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#F92E6A",
    marginLeft: "auto",
    marginRight: "auto",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  button: {
    backgroundColor: "#F92E6A",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditarPerfil;
