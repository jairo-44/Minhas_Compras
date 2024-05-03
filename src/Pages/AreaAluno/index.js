import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { AntDesign } from '@expo/vector-icons';

export default class AreaAluno extends Component {
    constructor(props) {
        super(props);
        this.state = {
            perfilAluno: {} // Inicializa o estado para armazenar os dados do perfil do aluno
        };
    }

    componentDidMount() {
        // Recupera o ID do aluno logado (supondo que o ID esteja disponível no state ou props)
        const idAlunoLogado = this.props.route.params?.idAluno || '';

        // Faça uma solicitação para o endpoint da API perfilAluno para obter os dados do aluno logado
        fetch(`http://192.168.1.8/fitConnect/perfilAluno.php?id=${idAlunoLogado}`)
            .then(response => response.json())
            .then(data => {
                console.log('Dados do perfil do aluno:', data);
                this.setState({ perfilAluno: data });
            })
            .catch(error => console.error('Erro ao buscar dados do perfil do aluno:', error));
    }

    navigateToScreen = (screenName) => {
        this.props.navigation.navigate(screenName);
    };

    render() {
        // Extrai o nome do aluno das props, se estiver presente
        const { nomeAluno } = this.props.route.params || '';
        const { perfilAluno } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.sidebar}>
                    <ScrollView horizontal={true}>
                        <TouchableOpacity style={styles.sidebarItem} onPress={() => this.navigateToScreen("CadastroAluno")}>
                            <Text style={styles.sidebarText}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sidebarItem} onPress={() => this.navigateToScreen("ProfIndicados")}>
                            <Text style={styles.sidebarText}>Profissionais</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sidebarItem} onPress={() => this.navigateToScreen("Bikes")}>
                            <Text style={styles.sidebarText}>Aluguel de Bikes</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <View style={styles.navbar}>
                    <Text style={styles.titleCabecalho}>Área do Aluno</Text>
                </View>
                <View style={styles.content}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20 }}>
                        <Text style={styles.title}>Perfil</Text>
                        <View style={styles.fotoPerfil}>
                            <Image
                                source={require('../../../assets/fotoPessoa.png')}
                                style={styles.foto}
                                resizeMode="cover"
                            />
                        </View>
                    </View>
                    <ScrollView>

                        <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, width: '100%', height: 10, borderBottomColor: '#19CD9B', backgroundColor: '#191B31' }}></View>
                        <View style={styles.camposDados}>
                            <Text style={styles.camposDadosText}>Nome: {perfilAluno.nomeAluno}</Text>
                            <Text style={styles.camposDadosText}>Cidade: {perfilAluno.cidadeAluno}</Text>
                            <Text style={styles.camposDadosText}>Estado: {perfilAluno.estadoAluno}</Text>
                            <Text style={styles.camposDadosText}>Idade: {perfilAluno.idadeAluno}</Text>
                            <Text style={styles.camposDadosText}>Altura: {perfilAluno.altura}</Text>
                            <Text style={styles.camposDadosText}>Peso: {perfilAluno.peso}</Text>
                            <Text style={styles.camposDadosText}>Sobre mim: {perfilAluno.comentarioAluno}</Text>
                        </View>
                        <Text style={styles.title}>Gráfico de desempenho</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, width: '100%', height: 10, borderBottomColor: '#19CD9B', backgroundColor: '#191B31' }}></View>
                        <Image
                            source={require('../../../assets/graficos.png')}
                            style={{ width: '80%', height: 400, alignSelf: 'center', justifyContent: 'center' }}
                            resizeMode="contain"
                        />
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
        fontSize: 24,
        color: "#FFF",
    },
    titleCabecalho: {
        marginTop: 5,
        fontSize: 24,
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
        fontSize: 16,
    },
    content: {
        flex: 1,
        backgroundColor: '#191B31',
    },
    subtitle: {
        color: '#FFF',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
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
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#19CD9B',
        padding: 2,
        overflow: 'hidden',
    },
    foto: {
        width: 80,
        height: 80,
    },
});
