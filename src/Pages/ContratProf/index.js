import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import CheckBoxPlanos from "../../../components/CheckBoxPlanos";

export default class ContratacaoProf extends Component {
    constructor(props) {
        super(props);
        this.state = {
            perfilProf: {
                id: this.props.route.params?.idProfissional || '',
                nome: this.props.route.params?.nomeProfissional || '',
                fotoPerfilProf: this.props.route.params?.fotoProfissional || ''
            },
            pagamentoRealizado: false
        };
    }

    handlePagamento = () => {
        // Simula um tempo de carregamento do pagamento
        setTimeout(() => {
            this.setState({ pagamentoRealizado: true });
            // Exibe a mensagem de sucesso após o pagamento ser realizado
            Alert.alert('Pagamento realizado com sucesso!');
        }, 2000); // Tempo de simulação de 2 segundos
    }

    componentDidMount() {
        // Recupera o ID do profissional logado
        const idProfLogado = this.props.route.params?.idProfissional || '';

        // Faça uma solicitação para o endpoint da API perfilProf para obter os dados do profissional logado
        fetch(`http://192.168.1.8/fitConnect/perfilProf.php?id=${idProfLogado}`)
            .then(response => response.json())
            .then(data => {
                console.log('Dados do perfil do profissional:', data);
                this.setState({ perfilProf: data });               
            })
            .catch(error => console.error('Erro ao buscar dados do perfil do profissional:', error));
    }

    render() {
        const { perfilProf, pagamentoRealizado } = this.state;
        const opcao1 = [{ text: 'Li e concordo', id: 1 }];
        const opcao2 = [{text: 'Pack Básico - Consulta online, Plano de Exercícios, Vídeos, Acompanhamento(1 mês) = R$ 250,00', id: 1}, 
                        {text: 'Pack Plus - Consulta online, Plano de Exercícios, Vídeos, Acompanhamento(6 meses) = R$ 600,00', id: 2},
                        {text: 'Plano de exerícios com vídeos = R$ 180,00', id: 3},
                        {text: 'Plano de exerícios (Planilhas) = R$ 180,00', id: 4}
                    ];

        return (
            <View style={styles.container}>
                <View style={styles.sidebar}></View>
                <View style={styles.navbar}>
                    <Text style={styles.titleCabecalho}>Pagamento</Text>
                </View>
                <View style={styles.content}>
                    
                    <ScrollView>
                        <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, width: '100%', height: 10, borderBottomColor: '#19CD9B', backgroundColor: '#191B31' }}></View>
                        <Text style={styles.title2}>Planos</Text>

                        <CheckBoxPlanos options={opcao2} onChange={(op) => alert(op)} />
                        

                      
                        <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, width: '100%', height: 10, borderBottomColor: '#19CD9B', backgroundColor: '#191B31' }}></View>
                        <Text style={styles.title2}>Forma de Pagamento</Text>
                        <View>                
                            <View style={[styles.formPag, { marginLeft: 20, marginBottom: 20, marginTop: 30 }]}>
                                <Text style={[styles.textPag, {color: 'white'}]} >Cartão:</Text>
                                <TouchableOpacity onPress={() => this.handleFormaPagamentoSelecionada('visa')}>
                                    <Image style={styles.imgformPag} source={require('../../../assets/visa.png')}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.handleFormaPagamentoSelecionada('mastercard')}>
                                    <Image style={styles.imgformPag} source={require('../../../assets/mastercard.png')}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.handleFormaPagamentoSelecionada('elo')}>
                                    <Image style={styles.imgformPag} source={require('../../../assets/elo.png')}/>
                                </TouchableOpacity>
                            </View>   
                            <View style={styles.formPag}>
                                <Text style={[styles.textPag, {color: 'white', marginLeft: 20}]} >Pix:</Text>
                                <TouchableOpacity onPress={() => this.handleFormaPagamentoSelecionada('pix')}>
                                    <Image style={styles.imgformPagPix} source={require('../../../assets/pix.png')}/>
                                </TouchableOpacity>
                                <Text style={[styles.textPag, {color: 'white'}]} >Boleto:</Text>
                                <TouchableOpacity onPress={() => this.handleFormaPagamentoSelecionada('boleto')}>
                                    <Image style={styles.imgformPag} source={require('../../../assets/boleto.png')}/>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.containerCard}>
                                <View style={styles.nomeCard}>
                                    <TextInput
                                        style={styles.input}
                                        placeholderTextColor="#707070"
                                        placeholder="Nome"
                                    />                                
                                </View>
                                <View style={styles.NumDataCard}>
                                    <TextInput
                                        style={[styles.input, {width: '40%'}]}
                                        placeholderTextColor="#707070"
                                        placeholder="Número do cartão"
                                    />
                                    <TextInput
                                        style={[styles.input, {width: '25%'}]}
                                        placeholderTextColor="#707070"
                                        placeholder="Data de Validade"
                                    />
                                    <TextInput
                                        style={[styles.input, {width: '15%'}]}
                                        placeholderTextColor="#707070"
                                        placeholder="C/V"
                                    />       
                                </View>
                            </View>

                            <View style={styles.containerButton}>
                                <TouchableOpacity style={styles.button} onPress={this.handlePagamento}>
                                    <Text style={styles.textButton}>Pagar</Text>
                                </TouchableOpacity>                                
                                {pagamentoRealizado && <Text style={styles.mensagem}>Pagamento realizado com sucesso!</Text>}
                            </View>             
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    navbar: {
        backgroundColor: '#19CD9B',
        padding: 3,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        color: "#FFF",
        fontWeight: "bold"
    },
    title2: {
        marginTop:15,
        fontSize: 20,
        color: "#FFF",
        fontWeight: "bold"
    },
    titleCabecalho: {
        marginTop: 5,
        fontSize: 20,
        color: "#FFF",
    },
    sidebar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 2,
        backgroundColor: '#191B31',
    },
    sidebarItem: {
        marginRight: 40,

    },
    sidebarText: {
        color: '#FFF',
        fontSize: 13,
    },
    content: {
        flex: 1,
        backgroundColor: '#191B31',
    },

    container_fotoMenu:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10
    },

    areaFoto:{
        marginTop:15,
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    subtitle: {
        color: '#FFF',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 6,
    },
    camposDados: {
        marginTop: 20,
        color: '#FFF',
        fontSize: 12,
    },
    camposDadosText: {
        marginTop: 5,
        color: '#FFF',
        fontSize: 18,
    },
    fotoPerfil: {
        width: 80,
        height: 80,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#19CD9B',
        padding: 3,
        overflow: 'hidden',
    },
    foto: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pagamento: {
       
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
    containerButton: {
      borderTopColor: '#ccc',
      marginTop: 30, 
      width: '35%',
      alignSelf: 'center',
    },
    button: {
      backgroundColor: '#19CD9B',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
    },
    input: {
        height: 25,
        width: "80%",
        marginVertical: 3,
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
        backgroundColor: "#DCE8F5",
        marginTop:5,
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
        width: '120%'
    },
    numDataValiud: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    mensagem: {
        color: 'green',
        marginTop: 10,
        textAlign: 'center',
    },
});