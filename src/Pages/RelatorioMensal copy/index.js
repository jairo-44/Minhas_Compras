import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import firebase from "../config/firebaseconfig";

export default function RelatorioMensal({ navigation }) {
    const [tasks, setTasks] = useState([]);
    const database = firebase.firestore();
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const user = firebase.auth().currentUser;

    function logout() {
        firebase.auth().signOut().then(() => {
            navigation.navigate("Login");
        }).catch((error) => {
            console.error("Erro ao fazer logout: ", error);
        });
    }

    function deleteTask(id) {
        database.collection("Compras").doc(id).delete()
            .then(() => {
                console.log("Tarefa deletada com sucesso!");
            })
            .catch((error) => {
                console.error("Erro ao deletar tarefa: ", error);
            });
    }

    function confirmDelete(id) {
        Alert.alert(
            "Atenção!",
            "Realmente quer deletar este produto?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Deletar",
                    onPress: () => deleteTask(id),
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    }

    useEffect(() => {
        const unsubscribe = database.collection("Compras")
            .where("idUser", "==", user.uid) // Filtro pelo ID do usuário atual
            .onSnapshot((query) => {
                const list = [];
                query.forEach((doc) => {
                    list.push({ ...doc.data(), id: doc.id });
                });
                setTasks(list);
            });

        return () => unsubscribe();
    }, []);

    const filterTasksByMonthAndYear = () => {
        if (!selectedMonth || !selectedYear) {
            return tasks;
        }

        const selectedMonthNumber = parseInt(selectedMonth);
        const selectedYearNumber = parseInt(selectedYear);

        return tasks.filter(task => {
            const taskDateParts = task.dataCompra.split('/');
            const taskMonthNumber = parseInt(taskDateParts[1]);
            const taskYearNumber = parseInt(taskDateParts[2]);

            return taskMonthNumber === selectedMonthNumber && taskYearNumber === selectedYearNumber;
        });
    };

    const calculateTotal = () => {
        return filterTasksByMonthAndYear().reduce((total, item) => {
            const qtd = parseFloat(item.qtd) || 0;
            const valor = parseFloat(item.valor) || 0;
            return total + (qtd * valor);
        }, 0).toFixed(2);
    };

    return (
        <View style={styles.container}>
            <View style={styles.pickerContainer}>
                <Text style={styles.tituloNome}>Selecione:</Text>
                <Picker
                    selectedValue={selectedMonth}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) => setSelectedMonth(itemValue)}
                >
                    <Picker.Item label="Mês" value="" />
                    <Picker.Item label="Janeiro" value="01" />
                    <Picker.Item label="Fevereiro" value="02" />
                    <Picker.Item label="Março" value="03" />
                    <Picker.Item label="Abril" value="04" />
                    <Picker.Item label="Maio" value="05" />
                    <Picker.Item label="Junho" value="06" />
                    <Picker.Item label="Julho" value="07" />
                    <Picker.Item label="Agosto" value="08" />
                    <Picker.Item label="Setembro" value="09" />
                    <Picker.Item label="Outubro" value="10" />
                    <Picker.Item label="Novembro" value="11" />
                    <Picker.Item label="Dezembro" value="12" />
                </Picker>
                <Picker
                    selectedValue={selectedYear}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}
                >
                    <Picker.Item label="Ano" value="" />
                    <Picker.Item label="2024" value="2024" />
                    <Picker.Item label="2025" value="2025" />
                </Picker>
            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={filterTasksByMonthAndYear()}
                renderItem={({ item }) => (
                    <View style={styles.taskContainer}>
                        <View style={styles.textContainer}>
                            <View style={styles.prodMarca}>
                                <Text style={styles.tituloNome}>Produto:</Text>
                                <Text style={[styles.taskText, { marginRight: 15, }]}>{item.produto}</Text>
                                <Text style={styles.tituloNome}>Marca:</Text>
                                <Text style={styles.taskText}>{item.marca}</Text>
                            </View>
                            <View style={styles.qtdValorData}>
                                <Text style={styles.tituloNome}>Quant:</Text>
                                <Text style={[styles.taskText, { marginRight: 15, }]}>{item.qtd}</Text>
                                <Text style={styles.tituloNome}>Valor: R$</Text>
                                <Text style={[styles.taskText, { marginRight: 15, }]}>{item.valor}</Text>
                                <Text style={styles.tituloNome}>Data:</Text>
                                <Text style={styles.taskText}>{item.dataCompra}</Text>
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => navigation.navigate("Editar", {
                                    id: item.id,
                                    produto: item.produto,
                                    marca: item.marca,
                                    qtd: item.qtd,
                                    valor: item.valor,
                                    dataCompra: item.dataCompra,
                                    idUser: user ? user.uid : null // Passar idUser
                                })}
                            >
                                <FontAwesome name="edit" size={23} color={"#000"} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.id)}>
                                <FontAwesome name="trash" size={23} color={"red"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>
                    Total: R$ {calculateTotal()}
                </Text>
            </View>
            <TouchableOpacity style={styles.ButtonNewTask} onPress={() => navigation.navigate("NovoProduto2", { idUser: user ? user.uid : null })}>
                <Text style={styles.iconButton}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.Buttonlogout}
                onPress={() => { logout() }}
            >
                <Text>
                    <MaterialCommunityIcons
                        name="location-exit"
                        size={23}
                        color="f92e6a"
                    />
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 10,
        paddingHorizontal: 20,
    },
    pickerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        borderColor: "black",
        backgroundColor: "#ccc",
        padding: 10,
    },
    picker: {
        height: 50,
        width: "40%",
    },
    taskContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#DDD",
        marginTop: 10,
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    prodMarca: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBottom: 10,
    },
    qtdValorData: {
        flexDirection: "row",
    },
    tituloNome: {
        fontSize: 12,
        fontWeight: "bold",
    },
    taskText: {
        fontSize: 12,
    },
    buttonContainer: {
        flexDirection: "row",
    },
    editButton: {
        marginHorizontal: 10,
    },
    deleteButton: {},
    ButtonNewTask: {
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
    iconButton: {
        color: "#fff",
        fontSize: 25,
        fontWeight: "bold",
    },
    totalText: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
    },
    totalContainer: {
        alignItems: "center",
        marginVertical: 10,
        paddingVertical: 10,
        backgroundColor: "#f1f1f1",
        width: 350,
        marginTop: 80,
    },
    Buttonlogout: {
        position: "absolute",
        width: 60,
        height: 60,
        bottom: 30,
        left: 20,
        backgroundColor: "#F92e6a",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
});
