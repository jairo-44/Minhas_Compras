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

  navigateToScreen = (screenName) => {
    this.props.navigation.navigate(screenName);
  };

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
              <View style={styles.listItemContainer}>
                <View style={styles.itemHeader}>
                  <View style={styles.nameAndPhotoContainer}>
                    <Text style={styles.highlightedName}>{item.nome}</Text> 
                    <View style={styles.fotoPerfil}>
                      <Image
                        source={{ uri: `http://192.168.1.8/fitConnect/uploads/${item.fotoPerfilProf}` }}
                        style={styles.foto}
                        resizeMode="cover"
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.itemDetails}>     
                  <Text style={styles.listItem}>Formado em: <Text style={styles.highlightedText}>{item.area}</Text></Text>
                  <Text style={styles.listItem}>Sobre mim: <Text style={styles.highlightedText}>{item.comentarioProf}</Text></Text>
                  <Text style={styles.listItem}>Atendimento Online: <Text style={styles.highlightedText}>{item.atendiOnLine}</Text></Text>                  
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.props.navigation.navigate("PerfilCompletoProf", { profissional: item })}
                    >
                        <Text style={styles.textButton}>Perfil completo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={this.add}>
                      <Text style={styles.textButton}>Contratar</Text>
                    </TouchableOpacity>
                  </View>
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
    marginBottom: 2,
    borderBottomWidth: 2,
    borderBottomWidth: 4,
    borderColor: 'white',
    
  },
  
  nameAndPhotoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor:'#DCE8F5'
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
    marginRight:10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:40,
    borderBottomWidth: 1,
    
  },
  highlightedName: {
    fontSize: 16,
    fontWeight: 'bold',     
    width: '80%', 
  },
  highlightedText: {    
    fontSize: 13,
    color: 'white',
  },
  listItem: {
    fontSize: 16,
    marginBottom: 20,
    color: '#F1F5C1',
    fontWeight: 'bold',
    textAlign: 'justify'
  },
  button: {
    backgroundColor: "#19CD9B",
    padding: 8, 
    borderRadius: 10,
    width: 120, 
    alignItems: 'center',
    marginRight: 10, 
    marginBottom:45,
    borderBottomWidth: 1,
  },
  textButton: {
    color: 'white',
  },
  areaFoto: {
    alignItems: 'flex-end',
    marginTop: 0,
  },
  fotoPerfil: {
    width: 90, 
    height: 90, 
    borderRadius: 45, 
  },
  foto: {
    width: '100%', 
    height: '100%',
  },
});

