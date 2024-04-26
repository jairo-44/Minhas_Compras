import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

export default class AreaProf extends Component {
    render() {
        // Extrair o nome do profissional das props, se estiver presente
        const nomeProfissional = this.props.route.params?.nomeProfissional || '';

        return (
            <View style={styles.container}>
                <Text style={styles.title}>Área do Profissional</Text>
                {/* Exibindo a mensagem com o nome do profissional */}
                <Text style={styles.subtitle}>Olá, {nomeProfissional}!</Text>
                {/* Restante do conteúdo da área do profissional */}
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
        fontSize: 30,
        color: "#FFF"
    },
    subtitle: {
        fontSize: 18,
        color: "#FFF",
        marginTop: 10
    }
});
