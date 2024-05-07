import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
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
    const { lista } = this.state;
    
    return (
      <View style={styles.container}>
        <View style={styles.navbar}>
          <Text style={styles.title}>Lista de Profissionais</Text>
        </View>

        <View style={styles.listContainer}>
          <FlatList
            data={lista}
            renderItem={({ item }) => (              
              <View style={styles.itemHeader}>
                <Text style={styles.highlightedName}>{item.nome}</Text>                
                <View style={styles.itemDetails}>
                  <View style={styles.areaFoto}>
                    <View style={styles.fotoPerfil}>
                    <Image
                        source={{ uri: `http://192.168.1.8/fitConnect/uploads/${item.fotoPerfilProf}` }}
                        style={styles.foto}
                        resizeMode="cover"
                      />
                      {console.log(`http://192.168.1.8/fitConnect/uploads/${item.fotoPerfilProf}`)}
                    </View>
                  </View>
                  <Text style={styles.listItem}>Formado em: {item.area}</Text>
                  <Text style={styles.listItem}>{item.comentarioProf}</Text>
                  <Text style={styles.listItem}>Atendimento Online: {item.atendiOnLine}</Text>
                  <Text style={styles.listItem}>Nome imagem: {item.fotoPerfilProf}</Text>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={this.add}>
                    <Text style={styles.textButton}>Perfil completo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={this.add}>
                    <Text style={styles.textButton}>Contratar</Text>
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
    backgroundColor: '#ADD8E6', 
    padding: 5, 
    borderRadius: 5, 
  },
  listItem: {
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
  },
  button: {
    backgroundColor: "#19CD9B",
    padding: 10, 
    borderRadius: 10,
    width: 160, 
    alignItems: 'center',
    marginRight: 10, 
    marginBottom:35,
  },
  textButton: {
    color: 'white',
  },
  areaFoto: {
    borderWidth: 2, 
    borderColor: 'yellow', 
    padding: 5, 
  },
  fotoPerfil: {
    width: 50, 
    height: 45, 
    borderRadius: 50, 
    overflow: "hidden", 
  },
  borderYellow: {
    borderColor: 'yellow',
  },
  
});