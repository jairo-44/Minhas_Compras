import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import axios from 'axios';

// Mapeamento de modelos para imagens correspondentes
const modeloParaImagem = {
  "S1": require("../../../../fitConnect/assets/bikes/S1.png"),
  "A700": require("../../../../fitConnect/assets/bikes/A700.png"),
  "E200": require("../../../../fitConnect/assets/bikes/E200.png"),
  "M3000": require("../../../../fitConnect/assets/bikes/M3000.png"),
  "U500": require("../../../../fitConnect/assets/bikes/U500.png"),
  "T700": require("../../../../fitConnect/assets/bikes/T700.png"),
  "R500": require("../../../../fitConnect/assets/bikes/R500.png"),
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
      bikeSelecionada: null,
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

  selecionarBike = (bike) => {
    this.setState({ bikeSelecionada: bike });
  };

  navigateToScreen = () => {
    const { bikeSelecionada } = this.state;
    if (bikeSelecionada) {
      this.props.navigation.navigate("AlugBikes", { bikeSelecionada });
    } else {
      // Adicione uma lógica de tratamento de erro se nenhuma bike estiver selecionada
    }
  };

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
    <TouchableOpacity
      style={[styles.itemContainer, item === this.state.bikeSelecionada ? styles.itemSelected : null]}
      onPress={() => this.selecionarBike(item)}
    >
      <View style={styles.itemHeader}>
        <View style={styles.itemDetails}>
          {/* Ocultar renderização "Id" com display: none */}
          <Text style={[styles.label, { display: 'none' }]}>Id:</Text>
          <Text style={[styles.item, { display: 'none' }]}>{item.idBike}</Text>         
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
    </TouchableOpacity>
  )}
/>
        </View>

        <View style={styles.containerButton}>
          <TouchableOpacity style={styles.button} onPress={this.navigateToScreen}>
            <Text style={styles.textButton}>Alugar</Text>
          </TouchableOpacity>
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
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
  },
  listContainer: {
    flex: 1,
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemSelected: {
    backgroundColor: '#d3d3d3', // Cor de fundo mais escura quando selecionado
  },
  itemHeader: {
    flexDirection: 'row',
  },
  itemDetails: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  item: {
    marginBottom: 10,
  },
  containerButton: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  textButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});