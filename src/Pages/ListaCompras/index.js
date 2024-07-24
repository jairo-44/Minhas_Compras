import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, Platform } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import firebase from "../config/firebaseconfig";

export default function ListagemProdutos({ navigation }) {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [searchText, setSearchText] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [startDate, setStartDate] = useState(null); // Data de início do período
    const [endDate, setEndDate] = useState(null); // Data de término do período
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [filteredItemCount, setFilteredItemCount] = useState(0);
    const database = firebase.firestore();
    const user = firebase.auth().currentUser;

    const onChangeStartDate = (event, selectedDate) => {
        const currentDate = selectedDate || startDate || new Date();
        setShowStartDatePicker(Platform.OS === 'ios');
        setStartDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
    };
    
    const onChangeEndDate = (event, selectedDate) => {
        const currentDate = selectedDate || endDate || new Date();
        setShowEndDatePicker(Platform.OS === 'ios');
        setEndDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
    };

    const formatDate = (date) => {
        if (!date) return '';
        const day = date.getDate();
        const month = date.getMonth() + 1; // Os meses são indexados de 0 a 11
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
    };

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

    const filterTasksByCategory = (tasks) => {
        if (!selectedCategory) {
            return tasks;
        }

        return tasks.filter(task => task.categoria === selectedCategory);
    };

    const filterTasksBySearchText = (tasks) => {
        if (!searchText) {
            return tasks;
        }

        return tasks.filter(task =>
            task.produto.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    const filterTasksByStatus = (tasks) => {
        if (selectedStatus === "") {
            return tasks.filter(task => task.status === "" || task.status === selectedStatus);
        } else {
            return tasks.filter(task => task.status === selectedStatus);
        }
    };
    

    const filterTasksByPeriod = (tasks) => {
        if (!startDate || !endDate) {
            return tasks;
        }
        
        // Definindo o intervalo de datas para comparação
        const startTimestamp = startDate.setHours(0, 0, 0, 0); // Zerando hora, minuto, segundo e milissegundo
        const endTimestamp = endDate.setHours(23, 59, 59, 999); // Último milissegundo do dia
        
        return tasks.filter(task => {
            const taskDateParts = task.dataCompra.split('/');
            const taskYear = parseInt(taskDateParts[2]);
            const taskMonth = parseInt(taskDateParts[1]) - 1; // Os meses em objetos Date começam em 0
            const taskDay = parseInt(taskDateParts[0]);
            const taskDate = new Date(taskYear, taskMonth, taskDay);
            const taskTimestamp = taskDate.getTime(); // Obtendo o timestamp da data da tarefa
            
            // Verificando se a data da tarefa está dentro do intervalo selecionado
            return taskTimestamp >= startTimestamp && taskTimestamp <= endTimestamp;
        });
    };
    
    
    
    

    const filterTasks = () => {
        const filteredByMonthAndYear = filterTasksByMonthAndYear();
        const filteredByCategory = filterTasksByCategory(filteredByMonthAndYear);
        const filteredBySearchText = filterTasksBySearchText(filteredByCategory);
        const filteredByStatus = filterTasksByStatus(filteredBySearchText);
        const filteredByPeriod = filterTasksByPeriod(filteredByStatus);
        const finalFilteredTasks = filteredByPeriod.sort((a, b) => (a.produto > b.produto) ? 1 : ((b.produto > a.produto) ? -1 : 0));
        
        // Atualiza a contagem de itens filtrados
        setFilteredItemCount(finalFilteredTasks.length);
        
        return finalFilteredTasks;
    };
    


    const calculateTotal = () => {
        return filteredTasks.reduce((total, item) => {
            // Verifica se o status do item é "Sim"
            if (item.status === "Sim") {
                const qtd = parseFloat(item.qtd) || 0;
                const valor = parseFloat(item.valor) || 0;
                return total + (qtd * valor);
            } else {
                return total; // Se o status não for "Sim", não adiciona ao total
            }
        }, 0).toFixed(2);
    };

    useEffect(() => {
        const finalFilteredTasks = filterTasks();
        setFilteredTasks(finalFilteredTasks);
    }, [tasks, searchText, selectedMonth, selectedYear, selectedStatus, selectedCategory, startDate, endDate]);
    

    return (
        <View style={styles.container}>
            <View style={styles.datePickerContainer}>
                <Text style={[styles.tituloNome, {marginRight:15}]}>Escolha  período:</Text>
                <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                    <TextInput
                        style={[styles.input, { marginRight: 40, color: startDate ? '#000' : '#999' }]}
                        placeholder="Data início"
                        value={startDate ? formatDate(startDate) : ''}
                        editable={false}
                    />
                </TouchableOpacity>
                {showStartDatePicker && (
                    <DateTimePicker
                        value={startDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={onChangeStartDate}
                    />
                )}
                <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                    <TextInput
                        style={[styles.input, { marginRight: 40, color: startDate ? '#000' : '#999' }]}
                        placeholder="Data fim"
                        value={startDate ? formatDate(endDate) : ''}
                        editable={false}
                    />
                </TouchableOpacity>
                {showEndDatePicker && (
                    <DateTimePicker
                        value={endDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={onChangeEndDate}
                    />
                )}
            </View>
    
            <View style={styles.searchFilterContainer}>
                <Text style={[styles.tituloNome, {marginRight:2}]}>Comprado?:</Text>
                <Picker
                    selectedValue={selectedStatus}
                    style={styles.statusPicker}
                    onValueChange={(itemValue) => setSelectedStatus(itemValue)}               
                >
                    <Picker.Item label="Indefinido" value="" />
                    <Picker.Item label="Sim" value="Sim" />
                    <Picker.Item label="Não" value="Não" />
                </Picker>
    
                <Picker
                    selectedValue={selectedCategory}
                    style={styles.categoriaPicker}
                    onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                >
                    <Picker.Item label="Categoria" value="" />
                    <Picker.Item label="Alimentos" value="Alimentos" />
                    <Picker.Item label="Limpeza" value="Limpeza" />
                    <Picker.Item label="Higiene" value="Higiene" />
                    <Picker.Item label="Supérfluos" value="Supérfluos" />
                    <Picker.Item label="Pet" value="Pet" />
                    <Picker.Item label="Farmácia" value="Farmácia" />
                    <Picker.Item label="Suplementos" value="Suplementos" />
                    <Picker.Item label="Combustível" value="Combustível" />
                    <Picker.Item label="Eletrônicos" value="Eletrônicos" /> 
                    <Picker.Item label="Acessórios Casa" value="Casa(intens e acessórios)" />
                    <Picker.Item label="Acessórios Carro" value="Acessórios Carro" />
                    <Picker.Item label="Acessórios Pessoais" value="Acessórios Pessoais" />
                </Picker>  
            </View>
    
            <View style={styles.searchFilterContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar produto..."
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                />
            </View>
            <Text style={[styles.tituloNome, {marginRight:2}]}>Criar lista de compras:</Text>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredTasks}
                renderItem={({ item }) => (
                    <View style={styles.taskContainer}>
                        <View style={styles.textContainerStatus}>
                            <Text style={styles.tituloNome}>Produto comprado?</Text>
                            <Text style={[styles.taskTextSim, item.status === "Sim" ? styles.greenText : styles.redText]}>{item.status}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => navigation.navigate("Editar", {
                                    id: item.id,
                                    produto: item.produto,
                                    marca: item.marca,
                                    qtd: item.qtd,
                                    valor: item.valor,
                                    dataCompra: item.dataCompra,
                                    status: item.status,
                                    obs: item.obs,
                                    idUser: user ? user.uid : null
                                })}
                            >
                                <View style={styles.prodMarca}>
                                    <Text style={styles.tituloNome}>Produto:</Text>
                                    <Text style={[styles.taskText, { marginRight: 15, }]}>{item.produto}</Text>
                                    <Text style={styles.tituloNome}>Marca:</Text>
                                    <Text style={[styles.taskText, { marginRight: 20 }]}>{item.marca}</Text>
                                </View>
                                <View style={styles.qtdValorData}>                                
                                    <Text style={styles.tituloNome}>Valor: R$</Text>
                                    <Text style={[styles.taskText, { marginRight: 15, }]}>{item.valor}</Text>
                                    <Text style={styles.tituloNome}>Quant:</Text>
                                    <Text style={[styles.taskText, { marginRight: 15, }]}>{item.qtd}</Text>
                                    <Text style={styles.tituloNome}>Data:</Text>
                                    <Text style={[styles.taskText, { marginRight: 20 }]}>{item.dataCompra}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.id)}>
                                <FontAwesome name="trash" size={30} color={"red"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />
    
            <Text style={styles.tituloAviso}>Para editar, toque no produto.</Text>
            
            <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Itens: {filteredItemCount}</Text>
                <Text style={styles.totalText}>
                    Total: R$ {calculateTotal()}
                </Text>
            </View>
            
            <TouchableOpacity style={styles.ButtonNewTask} onPress={() => navigation.navigate("NovoProduto2", { idUser: user ? user.uid : null })}>
                <Text style={styles.iconButton}>+</Text>
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
        alignItems: "center",
        borderColor: "#DDD",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        height: 35,
    },
    picker: {
        height: 50,
        width: "40%",
    },
    datePickerContainer: {
        flexDirection: "row",        
        alignItems: "center",
        borderColor: "#DDD",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        height: 50,
    },
    input: {
        flex: 1,
        height: 50,
        marginRight: 10,
        padding: 10,
        backgroundColor: "#f9f9f9",
    },
    searchFilterContainer: {
        flexDirection: "row",
        borderColor: "#DDD",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        alignItems: "center",
        marginRight:40,
        width: "100%",
        height: 35,
        alignItems: "center",
    },
    categoriaContainer: {
        flexDirection: "row",
        borderColor: "#DDD",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        alignItems: "center",
        marginRight:40,
        width: "100%",
        height: 35,
        alignItems: "center",
    },
    searchInput: {
        flex: 1,
        height: 50,
        
    },
    statusPicker: {
        height: 20,
        width: 130,
        marginLeft: 2,
        borderColor: "#DDD",
        borderWidth: 1,
        borderRadius: 5,
        marginLeft:2

    },
    categoriaPicker: {
        height: 30,
        width: 150,
        marginLeft: 2,
        borderColor: "#DDD",
        borderWidth: 1,
        borderRadius: 5,
        marginLeft:1,
        
    },
    taskContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#DDD',
    },
    counterText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
        marginTop:20
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
    tituloAviso: {
        textAlign: "center",
        marginTop:5,
        fontSize: 10,
        fontWeight: "bold",
        color:'red'
    },
    taskText: {
        fontSize: 12,
    },
    textContainerStatus: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        fontSize: 12,
        borderWidth: 1,
        borderColor: '#DDD',
        backgroundColor:'#DDD',
        marginRight:5,
        padding:3,
        textAlign: 'center',
        width: "100%",
    },
    taskTextSim: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        fontSize: 12,
        marginRight:5,
        padding:3,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: "row",
    },
    editButton: {
        marginHorizontal: 10,
    },
    deleteButton: {
        marginTop:40,
        marginRight:8
        
    },
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
        marginTop: 40,
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
   
    greenText: {
        color: "green",
        fontWeight: "bold",
    },
    redText: {
        color: "red",
    },
});
