import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image, ToastAndroid } from "react-native";
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import CheckBox from "../../../components/CheckBox";
import axios from 'axios';

export default class CadastroProf extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: "",
      area: "",
      sexo: "",
      atendiOnLine: "",
      nome: "",
      email: "",
      senha: "",
      cpf: "",
      cidade: "",
      estado: "",
      conselho: "",
      formacao: "",
      certFormacao: "", 
      certEspec1: "",
      certEspec2: "",
      certEspec3: "",
      comentarioProf: "",
      fotoPerfilProf: ""
    };
    this.api = 'http://192.168.1.8/fitConnect/add.php';
    this.fetchImages();
  }

  fotoPerfil = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
        Alert.alert(
            'Permissão necessária',
            'Permita que sua aplicação acesse as imagens'
        );
    } else {
        const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: false,
            aspect: [4, 4],
            quality: 1,
        });

        if (canceled) {
            ToastAndroid.show('Operação cancelada', ToastAndroid.SHORT);
        } else {
            const filename = assets[0].uri.split('/').pop(); // Obtém o nome do arquivo a partir do caminho completo do URI
            const extend = filename.split('.')[1];
            const formData = new FormData();
            formData.append('file', {
                name: filename,
                uri: assets[0].uri,
                type: 'image/' + extend,
            });
            formData.append('id', this.state.id); // Assuming you have an 'id' in your state

            try {
                const response = await axios.post('http://192.168.1.8/fitConnect/fotoPerfilProf.php', formData, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response.data.success) {
                    Alert.alert('Sucesso!', 'Imagem anexada!');
                    this.setState({ fotoPerfilProf: filename });
                } else {
                    Alert.alert('Erro', 'Imagem não enviada. Tente novamente.');
                }
            } catch (err) {
                Alert.alert('Erro', 'Erro ao enviar sua imagem');
            }
        }
    }
};



  fetchImages = async () => {
    
  }

  
  handlePickerImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
        Alert.alert(
            'Permissão necessária',
            'Permita que sua aplicação acesse as imagens'
        );
    } else {
        const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: false,
            aspect: [4, 4],
            quality: 1,
        });

        if (canceled) {
            ToastAndroid.show('Operação cancelada', ToastAndroid.SHORT);
        } else {
            const filename = assets[0].uri.substring(
                assets[0].uri.lastIndexOf('/') + 1,
                assets[0].uri.length
            );

            const extend = filename.split('.')[1];
            const formData = new FormData();
            formData.append('file', {
                name: filename,
                uri: assets[0].uri,
                type: 'image/' + extend,
            });
            formData.append('id', this.state.id); // Assuming you have an 'id' in your state

            try {
                const response = await axios.post('http://192.168.1.8/fitConnect/upload.php', formData, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response.data.success) {
                    Alert.alert('Sucesso!', 'Imagem anexada!');
                    // Atualize o estado com o nome da imagem selecionada
                    this.setState({ certFormacao: filename });
                } else {
                    Alert.alert('Erro', 'Imagem não enviada. Tente novamente.');
                }
            } catch (err) {
                Alert.alert('Erro', 'Erro ao enviar sua imagem');
            }
        }
    }
};




  onSexoChange = (itemValue, itemIndex) => {
    this.setState({ sexo: itemValue });
  };

  onOnlineChange = (itemValue, itemIndex) => {
    this.setState({ atendiOnLine: itemValue });
  };

  limparCampos = () => {
    this.setState({
      id: "",
      area: "",
      sexo: "",
      atendiOnLine: "",
      nome: "",
      email: "",
      senha: "",
      cpf: "",
      cidade: "",
      estado: "",
      conselho: "",
      formacao: "",
      certFormacao: "", 
      certEspec1: "",
      certEspec2: "",
      certEspec3: "",
      comentarioProf: "",
      fotoPerfilProf: ""
    });
  };

  
  add = async () => {
    const {
      id,
      nome,
      email,
      senha,
      cpf,
      cidade,
      estado,
      conselho,
      formacao,
      certFormacao,
      certEspec1,
      certEspec2,
      certEspec3,
      comentarioProf,
      sexo,
      area,
      atendiOnLine,
      fotoPerfilProf
    } = this.state;

    const obj = {
      id,
      nome,
      email,
      senha,
      cpf,
      cidade,
      estado,
      conselho,
      formacao,
      certFormacao,
      certEspec1,
      certEspec2,
      certEspec3,
      comentarioProf,
      sexo,
      area,
      atendiOnLine,
      fotoPerfilProf
    };

    try {
      const res = await axios.post(this.api, obj);
      if (res.data.success === true) {
        Alert.alert('Usuário cadastrado com sucesso');
        this.limparCampos();
      } else {
        if (res.data.error) {
          if (res.data.error.includes('Duplicate entry')) {
            this.mensagemDuplicidade();
          } else {
            console.error("Erro ao cadastrar usuário:", res.data.error);
          }
        } else {
          console.error("Erro ao cadastrar usuário: Resposta inesperada do servidor.");
          console.log("Resposta completa do servidor:", res);
        }
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
  };

    

    render() {
      const { pagamentoRealizado } = this.state;
      const opcao1 = [{ text: 'Li e concordo', id: 1 }];
      return (
        <ScrollView contentContainerStyle={Styles.scrollViewContainer}>
          <View style={Styles.container}>
            <View style={Styles.navbar}>
              <Text style={Styles.title}>Cadastro do Profissional</Text>
            </View>

            <View style={Styles.inputPicker}>
              <Picker
                selectedValue={this.state.area}
                onValueChange={(itemValue, itemIndex) => this.setState({ area: itemValue })}
                style={{ height: 30, width: '100%', justifyContent: 'center', color: 'blue' }}
              >
                <Picker.Item label="Selecione a Área" value="" />
                <Picker.Item label="Educação Física" value="Educação Física" />
                <Picker.Item label="Nutrição" value="Nutricao" />
              </Picker>
            </View>

            <TextInput
            style={Styles.input}
            placeholderTextColor="#707070"
            placeholder="ID"
            value={this.state.id}
            editable={false} 
          />

            <TextInput
              style={Styles.input}
              placeholderTextColor="#707070"
              placeholder="Nome"
              value={this.state.nome}
              onChangeText={(nome) => this.setState({ nome })}
            />

            <TextInput
              style={Styles.input}
              placeholderTextColor="#707070"
              placeholder="Email"
              value={this.state.email}
              onChangeText={(email) => this.setState({ email })}
            />

            <TextInput
              secureTextEntry={true}
              style={Styles.input}
              placeholderTextColor="#707070"
              placeholder="senha"
              value={this.state.senha}
              onChangeText={(senha) => this.setState({ senha })}
            />

            <View style={Styles.rowContainer}>
              <TextInput
                style={[Styles.input, Styles.halfInput]}
                placeholderTextColor="#707070"
                placeholder="CPF"
                value={this.state.cpf}
                onChangeText={(cpf) => this.setState({ cpf })}
              />
              <View style={[Styles.inputPickerSexo, Styles.halfInput]}>
                <Picker
                    selectedValue={this.state.sexo}
                    onValueChange={this.onSexoChange}
                    style={{ height: 30, width: '100%', justifyContent: 'center', color: '#707070' }}
                >
                <Picker.Item label="Sexo" value="" />
                <Picker.Item label="Masculino" value="masculino" />
                <Picker.Item label="Feminino" value="feminino" />
                </Picker>
              </View>
            </View>

            <View style={Styles.rowContainer}>
              <TextInput
                style={[Styles.input, Styles.halfInput]}
                placeholderTextColor="#707070"
                placeholder="cidade"
                value={this.state.cidade}
                onChangeText={(cidade) => this.setState({ cidade })}  
              />
              <TextInput
                style={[Styles.input, Styles.halfInput]}
                placeholderTextColor="#707070"
                placeholder="estado"
                value={this.state.estado}
                onChangeText={(estado) => this.setState({ estado })}
              />
            </View>

            <View style={Styles.rowContainer}>
              <TextInput
                style={[Styles.input, Styles.halfInput]}
                placeholderTextColor="#707070"
                placeholder="Nº Conselho"
                value={this.state.conselho}
                onChangeText={(conselho) => this.setState({ conselho })} 
              />
              <TextInput
                style={[Styles.input, Styles.halfInput]}
                placeholderTextColor="#707070"
                placeholder="Formação"
                value={this.state.formacao}
                onChangeText={(formacao) => this.setState({ formacao })} 
              />
            </View>

            <View style={Styles.fotoPerfilProf}>
              <TextInput
                style={Styles.input}
                placeholderTextColor="#707070"
                placeholder="Foto para o perfil"
                value={this.state.fotoPerfilProf}
                editable={false}
                onChangeText={(fotoPerfilProf) => this.setState({fotoPerfilProf})}
              />

              <TouchableOpacity style={Styles.buttonTermos} onPress={this.fotoPerfil}>
                <Text style={Styles.textButton}>Anexar</Text>
              </TouchableOpacity>
            </View>

            

            <View style={Styles.navbar2}>
              <Text style={Styles.title2}>Formação e especialidades</Text>
            </View>

            <View style={Styles.rowContainer2}>
              <TextInput
                style={[Styles.input, {width: "65%"}]}
                placeholderTextColor="#707070"
                placeholder="Cetificado de formação"
                value={this.state.certFormacao}
                onChangeText={(certFormacao) => this.setState({ certFormacao })}
              />

              <TouchableOpacity style={Styles.buttonTermos} onPress={this.handlePickerImage}>
                <Text style={Styles.textButton}>Anexar</Text>
              </TouchableOpacity>
            </View>
            

            <View style={Styles.rowContainer2}>
              <TextInput
                style={[Styles.input, Styles.halfInput2]}
                placeholderTextColor="#707070"
                placeholder="Especialização 1"
                value={this.state.certEspec1}
                onChangeText={(certEspec1) => this.setState({ certEspec1 })} 
              />
              <TextInput
                style={[Styles.input, Styles.halfInput3]}
                placeholderTextColor="#707070"
                placeholder="anexar"
              />
            </View>

            <View style={Styles.rowContainer2}>
              <TextInput
                style={[Styles.input, Styles.halfInput2]}
                placeholderTextColor="#707070"
                placeholder="Especialização 2"
                value={this.state.certEspec2}
                onChangeText={(certEspec2) => this.setState({ certEspec2 })} 
              />
              <TextInput
                style={[Styles.input, Styles.halfInput3]}
                placeholderTextColor="#707070"
                placeholder="anexar"
              />
            </View>

            <View style={Styles.rowContainer2}>
              <TextInput
                style={[Styles.input, Styles.halfInput2]}
                placeholderTextColor="#707070"
                placeholder="Especialização 3"
                value={this.state.certEspec3}
                onChangeText={(certEspec3) => this.setState({ certEspec3 })} 
              />
              <TextInput
                style={[Styles.input, Styles.halfInput3]}
                placeholderTextColor="#707070"
                placeholder="anexar"
              />
            </View>
            <TextInput
              style={Styles.resumoSobre}
              placeholderTextColor="#707070"
              placeholder="Conte mais sobre você."
              multiline={true} 
              alignItems='top'
              value={this.state.comentarioProf}
              onChangeText={(comentarioProf) => this.setState({ comentarioProf })} 
            />

            <View style={Styles.inputPicker}>
              <Picker
                selectedValue={this.state.atendiOnLine}
                onValueChange={this.onOnlineChange}
                style={{ height: 30, width: '100%', justifyContent: 'center', color: 'black' }}
              >
                <Picker.Item label="Atendimento ou consulta on-line?" value="" />
                <Picker.Item label="Sim" value="sim" />
                <Picker.Item label="Não" value="nao" />
              </Picker>
            </View>

            <View style={Styles.navbar2}>
              <Text style={Styles.title2}>Termos</Text>
            </View>

            <View >
              <Text style={[Styles.title2, { fontSize: 10 }]}>Declaro que as informações por mim prestadas são verdadeiras</Text>
            </View>
            
            <TouchableOpacity style={Styles.buttonTermos} onPress={this.AreAluno}>
              <Text style={Styles.textButton}>Termos</Text>              
            </TouchableOpacity>
            <CheckBox options={opcao1} onChange={(op) => alert(op)} />
            

            <View style={Styles.containerButton}>
              <TouchableOpacity style={Styles.button} onPress={this.add}>
                <Text style={Styles.textButton}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      );
    }
}



const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191B31",
    justifyContent: "top",
    alignItems: "center",
    padding: 3,
  },
  navbar: {   
    backgroundColor: '#19CD9B',
    padding: 0,
    alignItems: 'center',
    width: '100%',
    marginBottom:10,
  },

  navbar2: {   
    color:'white',    
    padding: 3,
    width: '90%',
    marginBottom:5,
    marginLeft:5,
    marginTop:5,
    borderBottomWidth: 1,
    borderBottomColor: '#19CD9B',
  },

  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  title2: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    
  },

  input: {
    height: 25,
    width: "90%",
    marginVertical: 3,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    backgroundColor: "#DCE8F5",
    marginTop:5,
  },

  inputArea: {
    height: 30,
    width: "80%",
    marginVertical: 3,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    backgroundColor: "#19CD9B",
    marginTop:5,
    marginBottom:20,
  },

  inputPicker:{
    height: 30,
    width: "90%",
    marginVertical: 15,
    borderWidth: 1,
    borderRadius: 10,    
    backgroundColor: "#DCE8F5",
    justifyContent: 'center',
    fontWeight: 'bold',
    marginBottom:15,
     
   
  },

  inputPickerSexo:{
    height: 30,
    width: "60%",
    marginVertical: 0,
    borderWidth: 1,
    borderRadius: 10,    
    backgroundColor: "#DCE8F5",
    justifyContent: 'center', 
   
  },

  resumoSobre:{   
    height: 70,
    width: "90%",
    marginVertical: 3,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    backgroundColor: "#DCE8F5",
    textAlignVertical: 'top'
  },
  
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginVertical: 3,
  },

  rowContainer2: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginVertical: 3,
    
  },

  halfInput: {
    width: "48%",
  },

  halfInput2: {
    width: "65%",
  },

  halfInput3: {
    width: "25%",
  },
  containerButton: {
    marginTop:30,
  },
 
  button:{
    backgroundColor:"#19CD9B",
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 10,
    width: 100,
    alignItems: 'center'
},


buttonTermos:{
    backgroundColor:"gray",
    padding: 2,
    marginBottom:5,
    borderRadius: 5,
    width: 70,
    alignItems: 'center'
},
  
textButton:{
    color:"#070A1E", 
},

fotoPerfilProf:{
  alignItems: 'center',
  marginTop:20
  
}

});
