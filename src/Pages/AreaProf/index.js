import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

export default class AreaProf extends Component {
    
    render() {
        // Extrair o nome do profissional das props, se estiver presente
        const nomeProfissional = this.props.route.params?.nomeProfissional || '';
        return (
            <View style={styles.container}>
                <View style={styles.sidebar}>
                    
                </View>
                <View style={styles.navbar}>
                    <Text style={styles.titleCabecalho}>Área do Profissional</Text>
                </View>
                <View style={styles.content}>
                
                    <View style={styles.container_fotoMenu}>
                    <ScrollView horizontal={true}>
                        <TouchableOpacity style={styles.sidebarItem} onPress={() => this.navigateToScreen("CadastroProf")}>
                        <FontAwesome name="edit" size={30} color="white" />
                        <Text style={styles.sidebarText}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sidebarItem} onPress={() => this.navigateToScreen("ProfIndicados")}>
                            <MaterialIcons name="design-services" size={30} color="white" />
                            <Text style={styles.sidebarText}>Serviços</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sidebarItem} onPress={() => this.navigateToScreen("Bikes")}>
                            <MaterialCommunityIcons name="calendar-edit" size={30} color="white" />
                            <Text style={styles.sidebarText}>Agenda</Text>
                        </TouchableOpacity>
                    </ScrollView>

                        <View style={styles.areaFoto}>
                            <View style={styles.fotoPerfil}>
                                <Image
                                    source={require('../../../assets/fotoProf.png')}
                                    style={styles.foto}
                                    resizeMode="cover"
                                />
                                
                            </View>
                            <Text style={styles.subtitle}>{nomeProfissional}</Text>
                        </View>
                        
                    </View>
                    <ScrollView>

                        <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, width: '100%', height: 10, borderBottomColor: '#19CD9B', backgroundColor: '#191B31' }}></View>
                        
                        
                        <Text style={styles.title2}>Agendados</Text>
                            
                        <Image
                            source={require('../../../assets/agendados.png')}
                            style={{ width: '90%', height: 200, alignSelf: 'center', justifyContent: 'center' }}
                            resizeMode="contain"
                        />

                        <Text style={styles.title2}>Gerenciamento de treinos</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, width: '100%', height: 10, borderBottomColor: '#19CD9B', backgroundColor: '#191B31' }}></View>
                        <Image
                            source={require('../../../assets/gerTreinos.png')}
                            style={{ width: '80%', height: 240, alignSelf: 'center', justifyContent: 'center' }}
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
});
