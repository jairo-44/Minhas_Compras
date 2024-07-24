import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import firebase from "../config/firebaseconfig";

export default function Home({ navigation }) {
    const [userName, setUserName] = useState(""); 
    const [tasks, setTasks] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const database = firebase.firestore();
    const user = firebase.auth().currentUser;

    function logout() {
        firebase.auth().signOut().then(() => {
            navigation.navigate("Login");
        }).catch((error) => {
            console.error("Erro ao fazer logout: ", error);
        });
    }

    useEffect(() => {
        console.disableYellowBox = true;
        const unsubscribe = database.collection("Compras")
            .where("idUser", "==", user.uid)
            .orderBy("horaCadastro", "asc")
            .onSnapshot((query) => {
                const list = [];
                const checkedItemsCopy = { ...checkedItems };
                query.forEach((doc) => {
                    const data = doc.data();
                    list.push({ ...data, id: doc.id });
                    if (!checkedItemsCopy.hasOwnProperty(doc.id)) {
                        checkedItemsCopy[doc.id] = false;
                    }
                });
                setCheckedItems(checkedItemsCopy);
                setTasks(list);
            });

        // Busca e define o nome do usuário
        if (user) {
            const fullName = user.displayName;
            if (fullName) {
                const firstName = fullName.split(" ")[0]; // Pega o primeiro nome
                setUserName(firstName);
            }
        }

        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
            {userName && ( // Renderiza apenas se userName estiver definido
                <Text style={styles.greetingText}>Olá, {userName}!</Text>
            )}
            <View style={styles.buttonsContainer}>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("NovoProduto2", { idUser: user ? user.uid : null })}>
                        <View style={styles.buttonContent}>
                            <Image
                                source={require('../../../assets/add.png')}
                                style={{ width: 100, height: 100 }}
                            />
                            <Text style={styles.buttonText}>Add produto</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ListaCompras", { idUser: user ? user.uid : null })}>
                        <View style={styles.buttonContent}>
                            <Image
                                source={require('../../../assets/lista.png')}
                                style={{ width: 100, height: 100 }}
                            />
                            <Text style={styles.buttonText}>Criar lista de compras</Text>
                        </View>
                    </TouchableOpacity>

                </View>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("RelacaoGastos", { idUser: user ? user.uid : null })}>
                        <View style={styles.buttonContent}>
                            <Image
                                source={require('../../../assets/gastos.png')}
                                style={{ width: 100, height: 100 }}
                            />
                            <Text style={styles.buttonText}>Compras efetivadas</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("EditarPerfil", { idUser: user ? user.uid : null })}>
                        <View style={styles.buttonContent}>
                            <Image
                                source={require('../../../assets/editarPerfil.png')}
                                style={{ width: 100, height: 100 }}
                            />
                            <Text style={styles.buttonText}>Editar perfil</Text>
                        </View>
                    </TouchableOpacity>               
                </View>
                <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Dashboard", { idUser: user ? user.uid : null })}>
                        <View style={styles.buttonContent}>
                            <Image
                                source={require('../../../assets/graficos.png')}
                                style={{ width: 100, height: 100 }}
                            />
                            <Text style={styles.buttonText}>Gráficos</Text>
                        </View>
                    </TouchableOpacity>     
                </View>
            </View>

            <TouchableOpacity
                style={styles.Buttonlogout}
                onPress={() => { logout() }}
            >
                <MaterialCommunityIcons
                    name="logout"
                    size={30}
                    color="#fff"
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    greetingText: {
        fontSize: 20,
        textAlign: "center",
        
    },
    buttonsContainer: {
        flex: 1,
        marginTop:70,
        alignItems: "center",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        paddingHorizontal: 10,
        marginVertical: 30, 
    },
    button: {
        marginHorizontal: 20, 
        alignItems: "center",
        flex: 1,
    },
    buttonContent: {
        alignItems: "center",
    },
    buttonText: {
        color: "black",
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "left", 
    },
    Buttonlogout: {
        position: "absolute",
        width: 60,
        height: 60,
        bottom: 30,
        right: 20,
        backgroundColor: "#F92e6a",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
});
