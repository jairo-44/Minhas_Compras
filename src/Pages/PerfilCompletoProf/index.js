import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { AntDesign, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';

export default class PerfilCompletoProf extends Component {
    constructor(props) {
        super(props);
        this.state = {
            perfilCompletoProf: {} 
        };
    }

    componentDidMount() {
        const { route } = this.props;
        const profissional = route.params?.profissional;
        console.log('Profissional:', profissional);

        if (!profissional) {
            console.error("Nenhum profissional foi selecionado.");
            return;
        }

        
        const idProfLogado = profissional.id || '';

        
        fetch(`http://192.168.1.8/fitConnect/perfilcomplProf.php?id=${idProfLogado}`)
    .then(response => response.json())
    .then(data => {        
        this.setState({ perfilCompletoProf: data });
    });
            
    }

    render() {
        const { perfilCompletoProf } = this.state;
        const { route } = this.props;
        const profissional = route.params?.profissional;

        console.log('Profissional:', profissional);

        if (!profissional) {
            return (
                <View style={styles.container}>
                    <Text>Nenhum profissional foi selecionado.</Text>
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <ScrollView>
                        <View style={styles.textoPerfil}>
                            <Text style={styles.destaque}>{profissional.nome}</Text>

                            <View style={styles.camposContainer}>
                                <View style={styles.camposWrapper}>
                                    <Text style={styles.camposTitulo}>Formação:</Text>
                                    <Text style={styles.camposValor}>{profissional.area}</Text>
                                </View>
                                <View style={styles.camposWrapper}>
                                    <Text style={styles.camposTitulo}>Nº do conselho:</Text>
                                    <Text style={styles.camposValor}>{profissional.conselho}</Text>
                                </View>
                            </View>

                            <View style={styles.camposContainer}>
                                <View style={styles.camposWrapper}>
                                    <Text style={styles.camposTitulo}>Atende online:</Text>
                                    <Text style={styles.camposValor}>{profissional.atendiOnLine}</Text>
                                </View>
                                <View style={styles.camposWrapper}>
                                    <Text style={styles.camposTitulo}>Sexo:</Text>
                                    <Text style={styles.camposValor}>{profissional.sexo}</Text>
                                </View>
                            </View>

                            <View style={styles.camposContainer}>
                                <View style={styles.camposWrapper}>
                                    <Text style={styles.camposTitulo}>Cidade em que estou:</Text>
                                    <Text style={styles.camposValor}>{profissional.cidade}</Text>
                                </View>
                                <View style={styles.camposWrapper}>
                                    <Text style={styles.camposTitulo}>Estado:</Text>
                                    <Text style={styles.camposValor}>{profissional.estado}</Text>
                                </View>
                            </View>

                            <Text style={styles.camposDadosText}><Text style={{ fontWeight: "bold", color: "yellow" }}>Mais sobre mim:</Text> {profissional.comentarioProf}</Text>
                            <Text style={styles.camposDadosText}><Text style={{ fontWeight: "bold", color: "yellow" }}>Email:</Text> {profissional.email}</Text>          

                            <View style={styles.socialIconsContainer}>
                                <AntDesign name="facebook-square" size={40} color="white" style={styles.socialIcon} />
                                <FontAwesome5 name="instagram-square" size={40} color="white" style={styles.socialIcon} />
                                <FontAwesome6 name="square-whatsapp" size={40} color="white" style={styles.socialIcon} />
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
    content: {
        flex: 1,
        backgroundColor: '#191B31',
        paddingHorizontal: 30, 
        paddingTop: 30, 
    },
    textoPerfil: {
        marginBottom: 20, 
    },
    destaque: {
        marginBottom: 40, 
        fontWeight: 'bold',
        color: '#FFF', 
        textShadowColor: '#000', 
        textShadowOffset: { width: 1, height: 3 }, 
        textShadowRadius: 5, 
        fontSize: 25,
        textAlign: 'center', 
    },
    camposContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    camposWrapper: {
        flex: 1,
    },
    camposTitulo: {
        color: 'yellow',
        fontWeight: 'bold',
        fontSize: 17,
    },
    camposValor: {
        color: '#FFF',
        fontSize: 17,
    },
    camposDadosText: {
        marginBottom: 35, 
        color: '#FFF',
        fontSize: 17,
        textAlign: 'justify'
    },
    socialIconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    socialIcon: {
        marginRight: 85
    },
});