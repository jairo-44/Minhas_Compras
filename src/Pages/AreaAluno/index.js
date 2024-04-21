import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { AntDesign } from '@expo/vector-icons';

export default class AreaAluno extends Component {
    constructor(props) {
        super(props);
    }

    navigateToScreen = (screenName) => {
        this.props.navigation.navigate(screenName);
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.sidebar}>
                    <ScrollView horizontal={true}>
                        <TouchableOpacity style={styles.sidebarItem} onPress={() => this.navigateToScreen("CadastroAluno")}>
                            <Text style={styles.sidebarText}>Edital</Text>
                        </TouchableOpacity>                        
                        <TouchableOpacity style={styles.sidebarItem} onPress={() => this.navigateToScreen("ProfIndicados")}>
                            <Text style={styles.sidebarText}>Profissionais </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <View style={styles.navbar}>
                    <Text style={styles.title}>Área do Aluno</Text>
                </View>
                

                <View style={styles.content}>
                    <Text style={styles.title}>Perfil</Text>
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
    sidebar: {
        flexDirection: 'row',
        backgroundColor: '#1E1E1E',
        paddingTop: 2,
        justifyContent: 'center',
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
});
