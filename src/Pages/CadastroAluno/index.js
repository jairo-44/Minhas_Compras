import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';

export default class CadastroAluno extends Component {

  constructor(props) {
    super(props);
    this.state = {
      idAluno: "",
      nomeAluno: "",
      emailAluno: "",
      senhaAluno: "",
      cpfAluno: "",
      foneAluno:"",      
      enderecoAluno: "",
      cidadeAluno: "",
      estadoAluno: "",
      qualProf: "",
      objetivo: "",
      peso: "",
      altura: "",
      sexoAluno: "",
      idadeAluno: "",
      praticaAtiv: "",
      quantAtiv: "",
      problSaude: "",
      qualProbl: "",
      comentarioAluno: "",    
      fotoPerfilAluno: "",  
    };
    this.api = 'http://192.168.1.8/fitConnect/addAluno.php';
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
                const response = await axios.post('http://192.168.1.8/fitConnect/uploadAluno.php', formData, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response.data.success) {
                    Alert.alert('Sucesso!', 'Imagem anexada!');
                    // Atualize o estado com o nome da imagem selecionada
                    this.setState({fotoPerfilAluno: filename });
                } else {
                    Alert.alert('Erro', 'Imagem não enviada. Tente novamente.');
                }
            } catch (err) {
                Alert.alert('Erro', 'Erro ao enviar sua imagem');
            }
        }
    }
  };

  onqualProfChange = (itemValue, itemIndex) => {
    this.setState({ qualProf: itemValue });
  };

  onObjetivo1Change = (itemValue, itemIndex) => {
    this.setState({ objetivo: itemValue });
  };

  onsexoAlunoChange = (itemValue, itemIndex) => {
    this.setState({ sexoAluno: itemValue });
  };

  onpraticaAtivChange = (itemValue, itemIndex) => {
    this.setState({ praticaAtiv: itemValue });
  };

  onquantAtivChange = (itemValue, itemIndex) => {
    this.setState({ quantAtiv: itemValue });
  };

  onProblemaChange = (itemValue, itemIndex) => {
    this.setState({ problSaude: itemValue });
  };

  limparCampos = () => {
    this.setState({
      idAluno:"",
      nomeAluno: "",
      emailAluno: "",
      senhaAluno: "",
      cpfAluno: "",
      foneAluno:"",      
      enderecoAluno: "",
      cidadeAluno: "",
      estadoAluno: "",
      qualProf: "",
      objetivo: "",
      peso: "",
      altura: "",
      sexoAluno: "",
      idadeAluno: "",
      praticaAtiv: "",
      quantAtiv: "",
      problSaude: "",
      qualProbl: "",
      comentarioAluno: "",
      fotoPerfilAluno: "",
    });
  };

  mensagemDuplicidade = () => {
    Alert.alert("Email já cadastrado!");
  };

  addAluno = async () => {
    const {
      idAluno,
      nomeAluno,
      emailAluno,
      senhaAluno,
      cpfAluno,
      foneAluno,      
      enderecoAluno,
      cidadeAluno,
      estadoAluno,
      qualProf,
      objetivo,
      peso,
      altura,
      sexoAluno,
      idadeAluno,
      praticaAtiv,
      quantAtiv,
      problSaude,
      qualProbl,
      comentarioAluno,
      fotoPerfilAluno,
    } = this.state;

    const obj = {
      idAluno,
      nomeAluno,
      emailAluno,
      senhaAluno,
      cpfAluno,
      foneAluno,      
      enderecoAluno,
      cidadeAluno,
      estadoAluno,
      qualProf,
      objetivo,
      peso,
      altura,
      sexoAluno,
      idadeAluno,
      praticaAtiv,
      quantAtiv,
      problSaude,
      qualProbl,
      comentarioAluno,
      fotoPerfilAluno,
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
    return (
      
        <ScrollView contentContainerStyle={Styles.scrollViewContainer}>
          <View style={Styles.container}>
            <View style={Styles.navbar}>
              <Text style={Styles.title}>Cadastro Aluno/Paciente</Text>
            </View>

            <TextInput
              style={Styles.input}
              placeholderTextColor="#707070"
              placeholder="Id"
              value={this.state.idAluno}
              editable={false} 
              onChangeText={(idAluno) => this.setState({ idAluno })}
            />
  
            <TextInput
              style={Styles.input}
              placeholderTextColor="#707070"
              placeholder="Nome"
              value={this.state.nomeAluno}
              onChangeText={(nomeAluno) => this.setState({ nomeAluno })}
            />

          <TextInput
            style={Styles.input}
            placeholderTextColor="#707070"
            placeholder="Email"
            value={this.state.emailAluno}
            onChangeText={(emailAluno) => this.setState({ emailAluno })}
          />

          <TextInput
            style={Styles.input}
            placeholderTextColor="#707070"
            placeholder="Senha"
            value={this.state.senhaAluno}
            onChangeText={(senhaAluno) => this.setState({ senhaAluno })}
          />

          <View style={Styles.rowContainer}>
            <TextInput
              style={[Styles.input, Styles.halfInput]}
              placeholderTextColor="#707070"
              placeholder="CPF"
              value={this.state.cpfAluno}
            onChangeText={(cpfAluno) => this.setState({ cpfAluno })}
              
            />
            <TextInput
            style={[Styles.input, Styles.halfInput]}
            placeholderTextColor="#707070"
            placeholder="Telefone"
            value={this.state.foneAluno}
            onChangeText={(foneAluno) => this.setState({ foneAluno })}
          />            
          </View>

          <TextInput
            style={Styles.input}
            placeholderTextColor="#707070"
            placeholder="Endereço"
            value={this.state.enderecoAluno}
            onChangeText={(enderecoAluno) => this.setState({ enderecoAluno })}
          />

          <View style={Styles.rowContainer}>
            <TextInput
              style={[Styles.input, Styles.cidade]}
              placeholderTextColor="#707070"
              placeholder="Cidade"
              value={this.state.cidadeAluno}
            onChangeText={(cidadeAluno) => this.setState({ cidadeAluno })}
            />
            <TextInput
              style={[Styles.input, Styles.estado]}
              placeholderTextColor="#707070"
              placeholder="Estado"
              value={this.state.estadoAluno}
            onChangeText={(estadoAluno) => this.setState({ estadoAluno })}
            />
          </View>

          <View style={Styles.fotoPerfilAluno}>
              <TextInput
                style={Styles.input}
                placeholderTextColor="#707070"
                placeholder="Foto para o perfil"
                value={this.state.fotoPerfilAluno}
                editable={false}
                onChangeText={(fotoPerfilAluno) => this.setState({ fotoPerfilAluno })}
              />

              <TouchableOpacity style={Styles.buttonTermos} onPress={this.fotoPerfil}>
                <Text style={Styles.textButton}>Anexar</Text>
              </TouchableOpacity>
            </View>

          <View style={Styles.navbar2}>
            <Text style={Styles.title2}>Qual profissional você busca?</Text>
          </View>
          <View style={Styles.inputPicker}>
            <Picker
              selectedValue={this.state.qualProf}
              onValueChange={this.onqualProfChange}
              style={{ height: 30, width: '100%', justifyContent: 'center', color: 'black' }}
            >
              <Picker.Item label="-" value="" />
              <Picker.Item label="Nutricionista" value="nutricionista" />
              <Picker.Item label="Personal trainer" value="personal" />
            </Picker>
          </View>

          <View style={Styles.navbar2}>
            <Text style={Styles.title2}>Qual seu objetivo?</Text>
          </View>
          <View style={Styles.inputPicker}>
            <Picker
              selectedValue={this.state.objetivo}
              onValueChange={this.onObjetivo1Change}
              style={{ height: 30, width: '100%', justifyContent: 'center', color: 'black' }}
            >
              <Picker.Item label="-" value="" />
              <Picker.Item label="Emagrecimento" value="emagrecimento" />
              <Picker.Item label="Ganho de massa muscular" value="ganhoMassa" />
              <Picker.Item label="Condicionamento físico" value="condicionamento" />
              <Picker.Item label="Melhora da saúde" value="saude" />
            </Picker>
          </View>

          <View style={Styles.navbar2}>
            <Text style={Styles.title2}>Conte mais sobre você.</Text>
          </View>
          <View style={Styles.rowContainer}>
            <TextInput
              style={[Styles.input, Styles.halfInput]}
              placeholderTextColor="#707070"
              placeholder="Peso"
              value={this.state.peso}
              onChangeText={(peso) => this.setState({ peso })}
            />
            <TextInput
              style={[Styles.input, Styles.halfInput]}
              placeholderTextColor="#707070"
              placeholder="Altura"
              value={this.state.altura}
              onChangeText={(altura) => this.setState({ altura })}
            />
          </View>
          <View style={Styles.rowContainer}>
            <TextInput
              style={[Styles.input, Styles.halfInput]}
              placeholderTextColor="#707070"
              placeholder="idade"
              value={this.state.idadeAluno}
              onChangeText={(idadeAluno) => this.setState({ idadeAluno })}
            />           
            <View style={[Styles.inputPickerSexo, Styles.halfInput]}>
              <Picker
                selectedValue={this.state.sexoAluno}
                onValueChange={this.onsexoAlunoChange}
                style={{ height: 30, width: '100%', justifyContent: 'center', color: '#707070' }}
              >
                <Picker.Item label="Sexo" value="" />
                <Picker.Item label="Masculino" value="masculino" />
                <Picker.Item label="Feminino" value="feminino" />
              </Picker>
            </View>
          </View>
          <View style={Styles.navbar2}>
            <Text style={Styles.title2}>Já pratica atividade física?</Text>
          </View>
          <View style={Styles.inputPicker}>
            <Picker
              selectedValue={this.state.praticaAtiv}
              onValueChange={this.onpraticaAtivChange}
              style={{ height: 30, width: '100%', justifyContent: 'center', color: 'black' }}
            >
              <Picker.Item label="-" value="" />
              <Picker.Item label="Sim" value="sim" />
              <Picker.Item label="Não" value="nao" />
            </Picker>
          </View>

          <View style={Styles.navbar2}>
            <Text style={Styles.title2}>Quantas vezes na semana?</Text>
          </View>
          <View style={Styles.inputPicker}>
            <Picker
              selectedValue={this.state.quantAtiv}
              onValueChange={this.onquantAtivChange}
              style={{ height: 30, width: '100%', justifyContent: 'center', color: 'black' }}
            >
              <Picker.Item label="-" value="" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
              <Picker.Item label="7" value="7" />
            </Picker>
          </View>

          <View style={Styles.navbar2}>
            <Text style={Styles.title2}>Tem algum problema físico ou de saúde?</Text>
          </View>
          <View style={Styles.inputPicker}>
            <Picker
              selectedValue={this.state.problSaude}
              onValueChange={this.onProblemaChange}
              style={{ height: 30, width: '100%', justifyContent: 'center', color: 'black' }}
            >
              <Picker.Item label="-" value="" />
              <Picker.Item label="Sim" value="sim" />
              <Picker.Item label="Não" value="nao" />
            </Picker>
          </View>
          <TextInput
            style={Styles.input}
            placeholderTextColor="#707070"
            placeholder="Qual?"
            value={this.state.qualProbl}
            onChangeText={(qualProbl) => this.setState({ qualProbl })}
          />

          <View style={Styles.navbar2}>
            <Text style={Styles.title2}>Fale mais sobre você.</Text>
          </View>
          <View style={Styles.rowContainer2}>
          </View>
          <TextInput
            style={Styles.resumoSobre}
            placeholderTextColor="#707070"
            placeholder="Escreva aqui."
            multiline={true}
            alignItems='top'
            value={this.state.comentarioAluno}
            onChangeText={(comentarioAluno) => this.setState({ comentarioAluno })}
          />

          <View style={Styles.navbar2}>
            <Text style={Styles.title2}>Termos</Text>
          </View>

          <View>
            <Text style={[Styles.title2, { fontSize: 10 }]}>Declaro que as informações por mim prestadas são verdadeiras</Text>
          </View>

          <TouchableOpacity style={Styles.buttonTermos} onPress={this.AreAluno}>
            <Text style={Styles.textButton}>Termos</Text>
          </TouchableOpacity>

          <View style={Styles.containerButton}>
          <TouchableOpacity style={Styles.button} onPress={this.addAluno}>
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
    marginBottom:35,
  },

  navbar2: {   
    color:'white',    
    padding: 3,
    width: '90%',
    marginBottom:1,
    marginLeft:5,
    marginTop:20,
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
    width: "90%",
    marginVertical: 3,
    
  },

  halfInput: {
    width: "50%",
  },

  halfInput2: {
    width: "65%",
  },

  estado: {
    width: "50%",
  },
  cidade: {
    width: "50%",
  },
  cpf: {
    width: "50%",
  },
  fone: {
    width: "50%",
  },
  sexo: {
    fone: "50%",
  },
  containerButton: {},
 
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
    marginBottom:15,
    borderRadius: 5,
    width: 70,
    alignItems: 'center'
},
  
textButton:{
    color:"#070A1E", 
},

fotoPerfilAluno:{
  alignItems: 'center',
  marginTop:20
  
}

});
