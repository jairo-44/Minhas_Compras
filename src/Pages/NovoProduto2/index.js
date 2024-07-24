import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert, ScrollView, KeyboardAvoidingView, FlatList } from "react-native";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import firebase from "../config/firebaseconfig";

export default function NovoProduto2({ navigation, route }) {
    const database = firebase.firestore();
    const { idUser } = route.params;
    const [categoria, setCategoria] = useState('');
    const [produto, setProduto] = useState('');
    const [marca, setMarca] = useState('');
    const [dataCompra, setDataCompra] = useState('');
    const [horaCadastro, setHoraCadastro] = useState('');
    const [qtd, setQtd] = useState('');
    const [valor, setValor] = useState('');
    const [tipoPgto, setTipoPgto] = useState('');
    const [obs, setObs] = useState('');
    const [status, setStatus] = useState('');
    const [usuario, setUsuario] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);   
    const [showUsuarioPicker, setShowUsuarioPicker] = useState(false);

    const categorias = ["Alimentos", "Limpeza", "Higiene", "Supérfluos", "Pet", "Farmácia", "Suplementos", "Combustível", "Eletrônicos", "Casa(intens e acessórios)", "Acessórios Carro/Moto/Bike", "Acessórios Pessoais"];

    

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const allowedEmails = ["jairosouza_3@hotmail.com"];
                if (allowedEmails.includes(user.email)) {
                    setShowUsuarioPicker(true);
                } else {
                    setShowUsuarioPicker(false);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date(dataCompra);
        setShowDatePicker(Platform.OS === 'ios');
        const formattedDate = formatDate(currentDate);
        setDataCompra(formattedDate);
    };

    const formatDate = (date) => {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (day < 10) {
            day = `0${day}`;
        }
        if (month < 10) {
            month = `0${month}`;
        }

        return `${day}/${month}/${year}`;
    };

    const handleQtdChange = (text) => {
        const cleanedText = text.replace(/[^0-9]/g, '');
        setQtd(cleanedText);
    };

    const handleValorChange = (text) => {
        const cleanedText = text.replace(/[^0-9.]/g, '');
        setValor(cleanedText);
    };

    function addProduto() {
        if (!categoria.trim() || !produto.trim() || !dataCompra.trim()) {
            Alert.alert("Atenção!", "Os campos categoria, produto e data são obrigatórios.");
            return;
        }

        const currentHour = new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        const valorAjustado = valor.trim() === '' ? null : parseFloat(valor);
        const qtdAjustada = qtd.trim() === '' ? null : parseFloat(qtd);

        database.collection("Compras").add({
            categoria: categoria,
            produto: produto,
            marca: marca,
            qtd: qtdAjustada,
            valor: valorAjustado,
            dataCompra: dataCompra,
            horaCadastro: currentHour,
            idUser: idUser,
            status: status,
            tipoPgto: tipoPgto,
            obs: obs,
            usuario: usuario,
        })
        .then(() => {
            console.log("Produto adicionado com sucesso!");

            setCategoria('');
            setProduto('');
            setMarca('');
            setQtd('');
            setValor('');
            setDataCompra('');
            setTipoPgto('');
            setStatus('');
            setObs('');
            setUsuario('');

            navigation.navigate("ListaCompras");
        })
        .catch((error) => {
            console.error("Erro ao adicionar produto: ", error);
        });
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}            
            keyboardVerticalOffset={150}
        >
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.categoriaContainer}>
                        <Picker
                            selectedValue={categoria}
                            style={styles.picker}
                            onValueChange={(itemValue) => setCategoria(itemValue)}
                        >
                            <Picker.Item label="Selecione a categoria" value="" />
                            {categorias.map((cat, index) => (
                                <Picker.Item 
                                    key={index} 
                                    label={cat} 
                                    value={cat} 
                                    style={categoria === cat ? styles.selectedCategoria : styles.defaultCategoria}
                                />
                            ))}
                        </Picker>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Produto"
                            onChangeText={setProduto}
                            value={produto}
                        />
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Marca"
                        onChangeText={setMarca}
                        value={marca}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Valor R$"
                        onChangeText={handleValorChange}
                        value={valor}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Quantidade"
                        onChangeText={handleQtdChange}
                        value={qtd}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <TextInput
                            style={[styles.input, { marginRight: 40, width: "100%", color: dataCompra ? '#000' : '#999' }]}
                            placeholder="Data da compra"
                            value={dataCompra}
                            editable={false}
                        />
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={new Date()}
                            mode="date"
                            display="default"
                            onChange={onChange}
                        />
                    )}
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={tipoPgto}
                            onValueChange={(itemValue) => setTipoPgto(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Tipo de pagamento" value="" />
                            <Picker.Item label="Cartão de Crédito" value="Cartão de Crédito" />
                            <Picker.Item label="Cartão de Débito" value="Cartão de Débito" />
                            <Picker.Item label="Pix" value="Pix" />
                            <Picker.Item label="Dinheiro" value="Dinheiro" />
                        </Picker>
                    </View>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={status}
                            style={[styles.picker, status === 'Sim' ? styles.greenText : styles.redText]}
                            onValueChange={(itemValue) => setStatus(itemValue)}
                        >
                            <Picker.Item label="Comprado?" value="" />
                            <Picker.Item label="Não" value="Não" />
                            <Picker.Item label="Sim" value="Sim" />
                        </Picker>
                    </View>
                    <TextInput
                        style={styles.obs}
                        placeholder="Observação"
                        onChangeText={setObs}
                        value={obs}
                    />

                    {/* Esta função é para escolher quem cadastrou na conta conjunta
                    {showUsuarioPicker && (
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={usuario}
                                style={[styles.picker]}
                                onValueChange={(itemValue) => setUsuario(itemValue)}
                            >
                                <Picker.Item label="Cadastrado por:" value="" />
                                <Picker.Item label="Jairo" value="Jairo" />
                                <Picker.Item label="Michely" value="Michely" />
                            </Picker>
                        </View>
                    )}
                    */}
                </View>
            </ScrollView>
            <TouchableOpacity
                style={styles.buttonNewTask}
                onPress={addProduto}
            >
                <Text style={styles.iconButtonSalvar}>Salvar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        padding: 20,
    },
    categoriaContainer: {
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    picker: {
        height: 50,
        width: "100%",
        color: "#000",
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 20,
    },
    obs: {
        height: 100,
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 5,
        paddingLeft: 10,
        paddingTop: 10,
        textAlignVertical: "top",
        marginBottom: 20,
    },
    pickerContainer: {
        height: 50,
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 5,
        marginBottom: 20,
        justifyContent: "center",
    },
    selectedCategoria: {
        backgroundColor: '#d3d3d3',
    },
    defaultCategoria: {
        backgroundColor: '#ffffff',
    },
    greenText: {
        color: 'green',
    },
    redText: {
        color: 'red',
    },
    buttonNewTask: {
        width: 60,
        height: 60,
        position: "absolute",
        bottom: 30,
        right: 20,
        backgroundColor: "#F92e6A",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    iconButtonSalvar: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});
