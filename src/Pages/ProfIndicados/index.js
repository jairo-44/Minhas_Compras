import React, { Component, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default class ProfIndicados extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lista: [],
    };
  }

  componentDidMount() {
    this.listarDados();
  }

  async listarDados() {
    try {
      const res = await axios.get('http://192.168.1.8/fitConnect/listar.php');
      this.setState({ lista: res.data.result });
      console.log(res.data.result);
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
    }
  }

  render() {
    return (
      <View style={Styles.container}>
        <View style={Styles.navbar}>
          <Text style={Styles.title}>Lista de Profissionais</Text>
        </View>

        <View style={Styles.listContainer}>
          <FlatList
            data={this.state.lista}
            renderItem={({ item }) => (              
                <View style={Styles.itemHeader}>
                  <Text style={Styles.highlightedName}>{item.nome}</Text>                
                <View style={Styles.itemDetails}>
                  <Text style={Styles.listItem}>Formado em: {item.area}</Text>
                  <Text style={Styles.listItem}>{item.comentarioProf}</Text>
                  <Text style={Styles.listItem}>Atendimento Online: {item.atendiOnLine}</Text>
                </View>

                <View style={Styles.buttonContainer}>
                <TouchableOpacity style={Styles.button} onPress={this.add}>
                    <Text style={Styles.textButton}>Perfil completo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Styles.button} onPress={this.add}>
                    <Text style={Styles.textButton}>Contratar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191B31",
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
  },
  navbar: {
    backgroundColor: '#19CD9B',
    padding: 10,
    alignItems: 'center',
    width: '100%'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    padding: 10,
    marginTop: 10,
    width: '100%'
  },
  listItemContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  itemHeader: {
    flex: 1,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  highlightedName: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#ADD8E6', // Cor de fundo azul mais suave
    padding: 5, // Espaçamento interno
    borderRadius: 5, // Borda arredondada
  },
  listItem: {
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
  },
  button: {
    backgroundColor: "#19CD9B",
    padding: 10, // Aumenta o padding para tornar os botões mais largos
    borderRadius: 10,
    width: 160, // Aumenta a largura dos botões
    alignItems: 'center',
    marginRight: 10, // Adiciona espaçamento entre os botões
    marginBottom:35,
  },
  textButton: {
    color: 'white',
  },
});