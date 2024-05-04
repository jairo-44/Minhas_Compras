import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { MaterialCommunityIcons, MaterialIcons, FontAwesome  } from '@expo/vector-icons';
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
                this.calcularTMB(data.altura, data.peso, data.idadeAluno, data.sexoAluno);
                this.calcularNivelPeso(data.altura, data.peso);
            })
            .catch(error => console.error('Erro ao buscar dados do perfil do aluno:', error));
    }

    calcularTMB = (peso, altura, idade, sexo) => {
        // Cálculo da TMB
        let tmb;
        if (sexo === 'masculino') {
            tmb = 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * idade);
        } else {
            tmb = 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * idade);
        }
        this.setState({ tmb });
    }

    calcularNivelPeso = (altura, peso) => {
        // Calcula o IMC
        const alturaMetros = altura / 100; // Convertendo altura para metros
        const imc = peso / (alturaMetros * alturaMetros);

        // Determina o nível de peso com base no IMC
        let nivelPeso;
        if (imc < 18.5) {
            nivelPeso = "Abaixo do peso";
        } else if (imc < 25) {
            nivelPeso = "Peso normal";
        } else if (imc < 30) {
            nivelPeso = "Sobrepeso";
        } else {
            nivelPeso = "Obeso";
        }

        this.setState({ nivelPeso });
    }


    navigateToScreen = (screenName) => {
        this.props.navigation.navigate(screenName);
    };

    render() {
        // Extrai o nome do aluno das props, se estiver presente
        const { nomeAluno } = this.props.route.params || '';
        const { perfilAluno, tmb, nivelPeso } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.sidebar}>                    
                </View>
                <View style={styles.navbar}>
                    <Text style={styles.titleCabecalho}>Área do Aluno</Text>
                </View>
                <View style={styles.content}>
                    <View style={styles.container_fotoMenu}>
                        
                    <ScrollView horizontal={true}>
                        <TouchableOpacity style={styles.sidebarItem} onPress={() => this.navigateToScreen("ProfIndicados")}>
                            <MaterialIcons name="fitness-center" size={30} color="white" />
                            <Text style={styles.sidebarText}>Profissionais</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sidebarItem} onPress={() => this.navigateToScreen("Bikes")}>
                            <MaterialCommunityIcons name="bike-fast" size={30} color="white" />
                            <Text style={styles.sidebarText}>Aluguel Bike</Text>
                        </TouchableOpacity>
                    </ScrollView>                    
                    
                        <View style={styles.areaFoto}>
                            <View style={styles.fotoPerfil}>
                                <Image
                                    source={require('../../../assets/fotoPessoa.png')}
                                    style={styles.foto}
                                    resizeMode="cover"
                                />
                            </View>
                            <Text style={styles.subtitle}>{nomeAluno}</Text>
                        </View>
                    </View>
                    <ScrollView>

                    <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, width: '100%', height: 10, borderBottomColor: '#19CD9B', backgroundColor: '#191B31', marginBottom: 12 }}></View>

                        <View style={[styles.camposDados]}>
                            <Text style={[styles.camposDadosText, styles.destaque,]}>Cidade:</Text>
                            <Text style={styles.camposDadosText}>{perfilAluno.cidadeAluno}</Text>
                            <Text style={[styles.camposDadosText, styles.destaque]}>Estado:</Text>
                            <Text style={styles.camposDadosText}>{perfilAluno.estadoAluno}</Text>
                        </View>
                        
                        <View style={styles.CompCorporal}>
                            <Text style={[styles.camposDadosText, styles.destaque]}>Idade:</Text>
                            <Text style={styles.camposDadosText}>{perfilAluno.idadeAluno}</Text>
                            <Text style={[styles.camposDadosText, styles.destaque]}>Altura:</Text>
                            <Text style={styles.camposDadosText}>{perfilAluno.altura} cm</Text>
                            <Text style={[styles.camposDadosText, styles.destaque]}>Peso:</Text>
                            <Text style={styles.camposDadosText}>{perfilAluno.peso} kg</Text>
                        </View>

                        <View style={styles.compCorporal}>   
                        <Text style={[styles.camposDadosText, styles.destaque]}>TMB:</Text>
                        <Text style={styles.camposDadosText}>{tmb}</Text>  
                        <Text style={[styles.camposDadosText, styles.destaque]}>Status:</Text>
                        <Text style={styles.camposDadosText}>{nivelPeso}</Text>                                                
                        
                        </View>

                        <View style={styles.sobreMim}> 
                            <Text style={[styles.camposDadosText, styles.destaque]}>Sobre mim:</Text>
                            <Text style={styles.camposDadosText}>{perfilAluno.comentarioAluno}</Text>  
                        </View>
                        <Text style={styles.title2}>Gráficos de desempenho</Text>
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
    title2: {
        marginTop:35,
        fontSize: 20,
        color: "#FFF",
        fontWeight: "bold" 
        
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
        marginTop: 5,
        flexDirection: 'row',        
        alignItems: 'flex-start',
        color: '#FFF',
        fontSize: 12,
        paddingHorizontal: 1, 
    },

    destaque: {
        marginRight: 5, 
        fontWeight: 'bold',
        color: '#FFF', 
        textShadowColor: '#000', 
        textShadowOffset: { width: 1, height: 3 }, 
        textShadowRadius: 5, 
        fontSize: 18,
        

    },

    CompCorporal: {
        marginTop: 10,
        flexDirection: 'row',
        
        alignItems: 'flex-start',
        color: '#FFF',
        fontSize: 12,
        paddingHorizontal: 1, 
    },
    compCorporal: {
        marginTop: 5,
        flexDirection: 'row',        
        alignItems: 'flex-start',
        color: '#FFF',
        fontSize: 12,
        paddingHorizontal: 1, 
    },
    sobreMim: {
        marginTop: 20,
        color: '#FFF',
        fontSize: 12,
    },
    camposDadosText: {
        marginTop: 5,
        color: '#FFF',
        fontSize: 17,
        alignItems: 'end',
         marginRight: 25 
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
        width: 75,
        height: 75,
        justifyContent: 'center', 
        alignItems: 'center', 
    },
});
