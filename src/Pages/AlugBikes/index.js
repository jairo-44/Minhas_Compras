import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image } from "react-native";
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import DatePicker from '@react-native-community/datetimepicker';

export default class AlugBikes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idAlugBike: "",
      id_do_aluno: "",
      id_da_bike: "",
      local_retirada: "",
      data_aluguel: "",
      data_entrega: "",
      hora_retirada: "",
      hora_entrega: "",
      valorTotal: "",
      showDataAluguelPicker: false,
      showDataEntregaPicker: false,
      horasUtilizadas: "" 
    };
    this.api = 'http://192.168.1.8/fitConnect/addbike.php';
    this.fetchImages();
  }

  componentDidMount() {
    const { bikeSelecionada } = this.props.route.params;
    if (bikeSelecionada) {
      this.setState({
        id_do_aluno: "",
        data_aluguel: "",
        data_entrega: "",
        hora_retirada: "",
        hora_entrega: "",
        id_da_bike: bikeSelecionada.idBike,
      });
    }
  }

  fetchImages() {
    // lógica de busca de imagens aqui
  }

  localChange = (itemValue, itemIndex) => {
    this.setState({ local_retirada: itemValue });
  };

  limparCampos = () => {
    this.setState({
      idAlugBike: "",
      id_do_aluno: "",
      id_da_bike: "",
      local_retirada: "",
      data_aluguel: "",
      data_entrega: "",
      hora_retirada: "",
      hora_entrega: "",
      valorTotal: "",
    });
  };

  add = async () => {
    const {
      idAlugBike,
      id_do_aluno,
      id_da_bike,
      local_retirada,
      data_aluguel,
      data_entrega,
      hora_retirada,
      hora_entrega,
      valorTotal,
    } = this.state;

    const obj = {
      idAlugBike,
      id_do_aluno,
      id_da_bike,
      local_retirada,
      data_aluguel,
      data_entrega,
      hora_retirada,
      hora_entrega,
      valorTotal,
    };

    try {
      const res = await axios.post(this.api, obj);
      if (res.data.success === true) {
        Alert.alert('Aluguel solicitado!');
        this.limparCampos();
      } else {
        if (res.data.error) {
          if (res.data.error.includes('Duplicate entry')) {
            this.mensagemDuplicidade();
          } else {
            console.error('Erro ao adicionar:', res.data.error);
          }
        } else {
          console.error('Erro desconhecido:', res.data);
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar:', error);
    }
  };

  handleConfirmar = () => {    
    setTimeout(() => {
      Alert.alert('Pagamento realizado com sucesso!');
    }, 2000);
  };

  validateDate = (date) => {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/;
    return dateRegex.test(date);
  };

  handleChangeDataAluguel = (event, selectedDate) => {
    this.setState({ showDataAluguelPicker: false });
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString(); 
      this.setState({ data_aluguel: formattedDate });
    }
  };
  
  handleChangeDataEntrega = (event, selectedDate) => {
    this.setState({ showDataEntregaPicker: false });
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString(); 
      this.setState({ data_entrega: formattedDate });
    }
  };

  calcularHorasUtilizadas = () => {
    const { hora_retirada, hora_entrega } = this.state;
    
    if (hora_retirada && hora_entrega) {
      const horaRetirada = new Date(`2000-01-01T${hora_retirada}`);
      const horaEntrega = new Date(`2000-01-01T${hora_entrega}`);

      const diferenca = horaEntrega.getTime() - horaRetirada.getTime();
      const horasUtilizadas = diferenca / (1000 * 60 * 60);

      return horasUtilizadas.toFixed(2);
    } else {
      return 0;
    }
  };

  handleChangeHoraRetirada = (hora_retirada) => {
    this.setState({ hora_retirada });
    const horasUtilizadas = this.calcularHorasUtilizadas();
    this.setState({ horasUtilizadas });
  };

  handleChangeHoraEntrega = (hora_entrega) => {
    this.setState({ hora_entrega });
    const horasUtilizadas = this.calcularHorasUtilizadas();
    this.setState({ horasUtilizadas });
  };

  render() {
    const { showDataAluguelPicker, showDataEntregaPicker, data_aluguel, data_entrega, horasUtilizadas } = this.state;

    return (
      <ScrollView contentContainerStyle={Styles.scrollViewContainer}>
        <View style={Styles.container}>
          <View style={Styles.navbar}>
            <Text style={Styles.title}>Cadastro do pedido</Text>
          </View>
          <TextInput
            style={[Styles.input, { display: 'none' }]}
            placeholderTextColor="#707070"
            placeholder="id do aluno"
            value={this.state.id_do_aluno}
            onChangeText={(id_do_aluno) => this.setState({ id_do_aluno })}
          />

          <TextInput
            style={[Styles.input, { display: 'none' }]}
            placeholderTextColor="#707070"
            placeholder="Id do modelo da bike"
            value={this.state.id_da_bike}
            onChangeText={(id_da_bike) => this.setState({ id_da_bike })}
          />

          <View style={Styles.rowContainer}>
            <View style={Styles.labelEscolhaLocal}>
              <Text style={Styles.label}>Local de retirada da bike</Text>
              <View style={Styles.inputContainer}>
                <Picker
                  selectedValue={this.state.local_retirada}
                  onValueChange={this.localChange}
                  style={{ height: 30, width: '100%', justifyContent: 'center', color: '#707070', backgroundColor: '#f2f2f2', borderColor: '#000' }}
                >
                  <Picker.Item label="Escolha o local" value="" />
                  <Picker.Item label="Shopping Flamboyant - Goiânia" value="Shopping Flamboyant - Goiânia" />
                  <Picker.Item label="Goiânia Shopping - Goiânia" value="Goiânia Shopping - Goiânia" />
                  <Picker.Item label="Shopping Iguatemi - São Paulo" value="Shopping Iguatemi - São Paulo" />
                  <Picker.Item label="Shopping Center Norte - São Paulo" value="Shopping Center Norte - São Paulo" />
                  <Picker.Item label="Barra Shopping - Rio de Janeiro" value="Barra Shopping - Rio de Janeiro" />
                  <Picker.Item label="Shopping Boulevard - Rio de Janeiro" value="Shopping Boulevard" />
                  <Picker.Item label="JK Shopping - DF" value="JK Shopping - DF" />
                  <Picker.Item label="Brasília Shopping - DF" value="Brasília Shopping - DF" />
                </Picker>
              </View>
            </View>
          </View>

          <View style={Styles.rowContainer}>
            <View style={Styles.labelContainer}>
              <Text style={Styles.label}>Data de retirada</Text>
              <TouchableOpacity 
              style={[Styles.input, Styles.halfInput]}
              onPress={() => this.setState({ showDataAluguelPicker: true })}>
                <Text>{data_aluguel || 'Selecione a data'}</Text>
              </TouchableOpacity>
              {showDataAluguelPicker && (
                <DatePicker
                  value={data_aluguel ? new Date(data_aluguel) : new Date()}
                  mode="date"
                  display="calendar"
                  onChange={this.handleChangeDataAluguel}
                />
              )}
            </View>
            <View style={Styles.labelContainer}>
              <Text style={Styles.label}>Horário</Text>
              <TextInput
                style={[Styles.input, Styles.halfInput]}
                placeholderTextColor="#707070"
                placeholder="hh:mm"
                value={this.state.hora_retirada}
                onChangeText={this.handleChangeHoraRetirada}
              />
            </View>
            </View>

          <View style={Styles.rowContainer}>
            <View style={Styles.labelContainer}>
              <Text style={Styles.label}>Data de devolução</Text>
              <TouchableOpacity 
              style={[Styles.input, Styles.halfInput]}
              onPress={() => this.setState({ showDataEntregaPicker: true })}>
                <Text>{data_entrega || 'Selecione a data'}</Text>
              </TouchableOpacity>
              {showDataEntregaPicker && (
                <DatePicker
                  value={data_entrega ? new Date(data_entrega) : new Date()}
                  mode="date"
                  display="calendar"
                  onChange={this.handleChangeDataEntrega}
                />
              )}
            </View>
            <View style={Styles.labelContainer}>
              <Text style={Styles.label}>Horário</Text>
              <TextInput
                style={[Styles.input, Styles.halfInput]}
                placeholderTextColor="#707070"
                placeholder="hh:mm"
                value={this.state.hora_entrega}
                onChangeText={this.handleChangeHoraEntrega}
              />
            </View>
          </View>

          <View style={Styles.rowContainer}>
            <Text style={Styles.label}>Horas utilizadas: {horasUtilizadas}</Text>
          </View>

          <View style={Styles.rowContainer}>
  <View style={Styles.labelContainer}>
    <Text style={Styles.label}>Valor a pagar</Text>    
    <TextInput
      style={[Styles.input, Styles.halfInput]}
      placeholderTextColor="#707070"
      placeholder={horasUtilizadas ? '' : ' '}
      value={horasUtilizadas ? `R$ ${(parseFloat(horasUtilizadas) * 9).toFixed(2)}` : ''}
      onChangeText={(valorTotal) => this.setState({ valorTotal })}
      editable={false} 
    />
  </View>
          </View>
          <View style={Styles.pagamento}>
          <Text style={[Styles.label, { marginBottom: 15 }]}>Escolha a forma de pagamento:</Text>
          <View>                
            <View style={[Styles.formPag, { marginBottom: 20 }]}>
              <Text>Cartão:</Text>
              <TouchableOpacity onPress={() => this.handleFormaPagamentoSelecionada('visa')}>
                <Image style={Styles.imgformPag} source={require('../../../assets/visa.png')}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.handleFormaPagamentoSelecionada('mastercard')}>
                <Image style={Styles.imgformPag} source={require('../../../assets/mastercard.png')}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.handleFormaPagamentoSelecionada('elo')}>
                <Image style={Styles.imgformPag} source={require('../../../assets/elo.png')}/>
              </TouchableOpacity>
            </View>   
            <View style={Styles.formPag}>
              <Text>Pix:</Text>
              <TouchableOpacity onPress={() => this.handleFormaPagamentoSelecionada('pix')}>
                <Image style={Styles.imgformPagPix} source={require('../../../assets/pix.png')}/>
              </TouchableOpacity>
              <Text>Boleto:</Text>
              <TouchableOpacity onPress={() => this.handleFormaPagamentoSelecionada('boleto')}>
                <Image style={Styles.imgformPag} source={require('../../../assets/boleto.png')}/>
              </TouchableOpacity>
            </View>           
          </View>
          <View style={Styles.containerCard}>
              <View style={Styles.nomeCard}>
                 <TextInput
                   style={Styles.input}
                    placeholderTextColor="#707070"
                    placeholder="Nome"
                  />                                
             </View>
                <View style={Styles.NumDataCard}>
                    <TextInput
                      style={[Styles.input, {width: '40%'}]}
                      placeholderTextColor="#707070"
                      placeholder="Número do cartão"
                                    />
                  <TextInput
                      style={[Styles.input, {width: '25%'}]}
                      placeholderTextColor="#707070"
                      placeholder="Data de Validade"
                      />
                  <TextInput
                      style={[Styles.input, {width: '15%'}]}
                       placeholderTextColor="#707070"
                       placeholder="C/V"
                       />       
                  </View>
            </View>

          </View>
          <View style={Styles.containerButton}>
            <TouchableOpacity style={Styles.button} onPress={this.handleConfirmar}>
              <Text style={Styles.textButton}>Confirmar</Text>
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
    backgroundColor: '#fff',
    padding: 20, 
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
  input: {
    backgroundColor: '#f2f2f2', 
    borderWidth: 1, 
    borderColor: '#000', 
    borderRadius: 5, 
    padding: 10, 
    marginBottom: 10, 
    color: '#000', 
  }, 

  halfInput: {
    flex: 1, 
    marginRight: 10, 
    height: 40
    
  },
  rowContainer: {
    flexDirection: 'row', 
    marginBottom: 10, 
  },
  containerButton: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: 30, 
    width: '95%'
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
  labelContainer: {
    flex: 1, 
    marginRight: 10, 
  },
  labelEscolhaLocal: {
    flex: 1, 
    marginRight: 10, 
    marginBottom: 20
  },
  label: {
    fontWeight: 'bold', 
  },
  pagamento: {
    borderWidth: 1, 
    borderColor: 'black', 
    borderRadius: 5, 
    padding: 10,
    width: '95%'
  },
  formPag: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  imgformPag: {
    width: 40, 
    height: 20, 
    marginHorizontal: 5, 
    marginRight: 25,
  },
  imgformPagPix: {
    width: 28, 
    height: 28, 
    marginHorizontal: 5, 
    marginRight: 25,
    
  },
  NumDataCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    
    marginBottom: 20,
},
nomeCard: {
    flex: 1,
    marginRight: 30,
    marginLeft:10,
    marginTop: 15,
    width: '93%'
},
numDataValiud: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
},

});