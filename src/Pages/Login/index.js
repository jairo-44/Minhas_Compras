import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { AntDesign, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import axios from 'axios';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            senha: ""
        };

        this.CadAluno = this.CadAluno.bind(this);
        this.CadProf = this.CadProf.bind(this);
        this.AreAluno = this.AreAluno.bind(this);
        this.IndPro = this.IndPro.bind(this);
    }

    CadAluno() {
        this.props.navigation.navigate("CadastroAluno");
    }

    CadProf() {
        this.props.navigation.navigate("CadastroProf");
    }

    AreAluno() {
        this.props.navigation.navigate("AreaAluno");
    }

    AreProf() {
        this.props.navigation.navigate("AreaProf");
    }

    IndPro() {
        this.props.navigation.navigate("ProfIndicados");
    }

    async logar() {
        const { email, senha } = this.state;
    
        try {
            const response = await axios.post('http://192.168.1.9/fitConnect/login.php', {
                email,
                senha
            });
    
            if (response.data.success) {
                // Verifica o tipo de usuário retornado pela API
                const tipoUsuario = response.data.usuario.tipo_usuario;
                
                // Redireciona para a página correspondente ao tipo de usuário
                if (tipoUsuario === 'aluno') {
                    this.props.navigation.navigate("AreaAluno");
                } else if (tipoUsuario === 'prof') {
                    this.props.navigation.navigate("AreaProf");
                } else {
                    Alert.alert("Erro ao Logar", "Tipo de usuário desconhecido.");
                }
            } else {
                // Credenciais inválidas, exibir mensagem de erro
                Alert.alert("Erro ao Logar", "Dados Incorretos");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            Alert.alert("Erro ao Logar", "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente mais tarde.");
        }
    }
    
    

    render() {
        return (
            <View style={styles.container}>
                <Text style={[styles.title, { marginBottom: 45 }]}>Já faz parte da nossa corrente? </Text>

                <Text style={styles.title}>Entre </Text>

                <TextInput
                    style={styles.input}
                    onChangeText={(email) => this.setState({ email })}
                    placeholderTextColor="#707070"
                    placeholder='Email'
                    value={this.state.email}
                />

                <TextInput
                    secureTextEntry={true}
                    style={styles.input}
                    onChangeText={(senha) => this.setState({ senha })}
                    placeholderTextColor="#707070"
                    placeholder='Senha'
                    value={this.state.senha}
                />

                <View style={styles.containerButton}>
                    <TouchableOpacity style={styles.button} onPress={() => this.logar()}>
                        <Text style={styles.textButton}>Entrar</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <Text style={styles.textoSpacing}>Conectando a necessidade por saúde e qualidade de vida a quem entende do assunto. </Text>
                    <Text style={styles.textoSpacing}>Faça seu cadastro e entre para a corrente do bem-estar. </Text>
                    <Text style={styles.textoSpacing2}>Cadastre-se.</Text>
                </View>

                <View style={styles.containerButton}>
                    <TouchableOpacity style={styles.button} onPress={this.CadAluno}>
                        <Text style={styles.textButton}>Aluno</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={this.CadProf}>
                        <Text style={styles.textButton}>Profissional</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.title, { flexDirection: 'row' }]}>
                    

                    <TouchableOpacity style={styles.buttonTemporarios} onPress={this.IndPro}>
                        <Text style={styles.textButton}>P</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.socialIconsContainer}>
                    <AntDesign style={styles.socialIcon} name="facebook-square" size={24} color="white" />
                    <FontAwesome5 style={styles.socialIcon} name="instagram-square" size={24} color="white" />
                    <FontAwesome6 style={styles.socialIcon} name="square-whatsapp" size={24} color="white" />
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
        alignItems: "center"
    },
    title: {
        fontSize: 18,
        color: "#FFF"
    },
    button: {
        backgroundColor: "#19CD9B",
        padding: 5,
        marginHorizontal: 5,
        borderRadius: 10,
        width: 100,
        alignItems: 'center'
    },
    buttonTemporarios: {
        backgroundColor: "gray",
        padding: 5,
        marginHorizontal: 10,
        borderRadius: 10,
        width: 25,
        height: 25,
        alignItems: 'center'
    },
    containerButton: {
        flexDirection: "row",
        padding: 5,
        marginBottom: 10,
    },
    textButton: {
        color: "#070A1E",
    },
    input: {
        height: 40,
        width: "80%",
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        backgroundColor: "#DCE8F5",
    },
    textoSpacing: {
        marginBottom: 0,
        marginTop: 0,
        padding: 5,
        color: "#FFF",
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    textoSpacing2: {
        marginBottom: 10,
        marginTop: 15,
        padding: 5,
        color: "#FFF",
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    socialIconsContainer: {
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 5,
        paddingBottom: 20
    },
    socialIcon: {
        width: 40,
        height: 40
    },
});
