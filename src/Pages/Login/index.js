import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, StyleSheet, Image } from 'react-native';
import firebase from "../config/firebaseconfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import 'firebase/compat/auth';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);

  const loginFirebase = () => {
    firebase.auth().signInWithEmailAndPassword(email, senha)
      .then((userCredential) => {
        let user = userCredential.user;        
        navigation.navigate("Home", { idUser: user.uid });
      })
      .catch((error) => {
        setErrorLogin(true);
        console.error("Erro ao logar:", error.code, error.message);
      });
  };
  
  const handlePasswordReset = () => {
    if (email) {
      firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          alert("Email de recuperação de senha enviado!");
        })
        .catch((error) => {
          console.error("Erro ao enviar email de recuperação:", error.code, error.message);
        });
    } else {
      alert("Por favor, insira seu email para recuperar a senha.");
    }
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("Home", { idUser: user.uid })
        var uid = user.uid;        
      } 
    });
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container}>
       <Image 
      source={require('../../../assets/logoCompras.png')} 
      style={styles.logo} 
      />
      <Text style={styles.title}>Minhas Compras</Text>
      <TextInput
        style={styles.input}
        placeholder='Digite seu email'
        type='text'
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholderTextColor="#a9a9a9" 
      />
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        placeholder='Digite sua senha'
        type='text'
        onChangeText={(text) => setSenha(text)}
        value={senha}
        placeholderTextColor="#a9a9a9" 
      />
      {errorLogin && (
        <View style={styles.contentAlert}>
          <MaterialCommunityIcons
            name='alert-circle'
            size={24}
            color="#bdbdbd"
          />
          <Text style={styles.warninAlert}>Email ou senha inválidos!</Text>
        </View>
      )}
      {(email === "" || senha === "") ? (
        <TouchableOpacity
          disabled={true}
          style={styles.buttonLogin}
        >
          <Text style={styles.textButtonLogin}>Entrar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.buttonLogin}
          onPress={loginFirebase}
        >
          <Text style={styles.textButtonLogin}>Login</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.linkReset} onPress={handlePasswordReset}>
        Esqueceu a senha?
      </Text>
      <Text style={styles.registro}>Não é registrado? Crie o seu registro agora.</Text>
      <Text
        style={styles.linkRegistro}
        onPress={() => navigation.navigate("NovoUsuario")}
      >
        Registre-se agora!
      </Text>
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,  
    height: 100, 
    marginBottom: 5, 
  },
  title: {
    fontSize: 25,
    color: "#F92E6A",
    marginBottom:40,
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
    color: "#4d5156",
    textAlign: "center", 
  },
  buttonLogin: {
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F92E6A",
    borderRadius: 30,
    marginTop: 30,
    marginBottom:40,
  },
  textButtonLogin: {
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
  registro: {
    marginTop: 20,
    color: "#4d5156"
  },
  linkRegistro: {
    color: "#1877f2",
    fontSize: 16,
    marginTop: 15,
  },
  linkReset: {
    color: "#1877f2",
    fontSize: 16,
    marginTop: 10,
  }
});
