import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import axios from 'axios';

// Mapeamento de modelos para imagens correspondentes
const modeloParaImagem = {
  "S1": require("../../../../fitConnect/assets/bikes/S1.png"),
  "A700": require("../../../../fitConnect/assets/bikes/A700.png"),
  "A700": require("../../../../fitConnect/assets/bikes/A700.png"),
  "E200": require("../../../../fitConnect/assets/bikes/E200.png"),
  "M3000": require("../../../../fitConnect/assets/bikes/M3000.png"),
  "U500": require("../../../../fitConnect/assets/bikes/U500.png"),
  "T700": require("../../../../fitConnect/assets/bikes/T700.png"),
  "R500": require("../../../../fitConnect/assets/bikes/R500.png"),
  "M3000": require("../../../../fitConnect/assets/bikes/M3000.png"),
  "RX8000": require("../../../../fitConnect/assets/bikes/RX8000.png"),  
  "F450": require("../../../../fitConnect/assets/bikes/F450.png"),
  "K100": require("../../../../fitConnect/assets/bikes/K100.png"),
  "EFB600": require("../../../../fitConnect/assets/bikes/EFB600.png"),
  "C300": require("../../../../fitConnect/assets/bikes/C300.png"),
  "H200": require("../../../../fitConnect/assets/bikes/H200.png"),
  "CD250": require("../../../../fitConnect/assets/bikes/CD250.png"),
  "AS900": require("../../../../fitConnect/assets/bikes/AS900.png"),
  
};

export default class Bikes extends Component {
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
      const res = await axios.get('http://192.168.1.8/fitConnect/bikes.php');
      this.setState({ lista: res.data.result });
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
    }
  }

  
 
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navbar}>
          <Text style={styles.title}>Escolha a sua</Text>
        </View>       

        <View style={styles.listContainer}>
          <FlatList
            data={this.state.lista}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemDetails}>
                    <Text style={styles.label}>Marca:</Text>
                    <Text style={styles.item}>{item.marca}</Text>
                    <Text style={styles.label}>Modelo:</Text>
                    <Text style={styles.item}>{item.modelo}</Text>
                    <Text style={styles.label}>Descrição:</Text>
                    <Text style={styles.item}>{item.descricao}</Text>
                    <Text style={styles.label}>Valor:</Text>
                    <Text style={styles.item}>R$ {item.valorHora} - por hora.</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    {modeloParaImagem[item.modelo] && (
                      <Image source={modeloParaImagem[item.modelo]} style={{ width: 160, height: 160, resizeMode: 'contain' }} />
                    )}
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={this.add}>
                    <Text style={styles.textButton}>Alugar</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navbar: {
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemDetails: {
    flex: 1,
    paddingLeft: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  item: {
    fontSize: 14,
    marginBottom: 5,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  textButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});