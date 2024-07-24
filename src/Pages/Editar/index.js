import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform, ScrollView, KeyboardAvoidingView } from "react-native";
import firebase from "../config/firebaseconfig";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from '@react-native-picker/picker';

export default function Editar({ navigation, route, checkedItems, setCheckedItems }) {
    const database = firebase.firestore();
    const { id, produto, marca, qtd, valor, dataCompra, tipoPgto, obs, idUser } = route.params;

    const [produtoEdit, setProdutoEdit] = useState('');
    const [marcaEdit, setMarcaEdit] = useState('');
    const [qtdEdit, setQtdEdit] = useState('');
    const [valorEdit, setValorEdit] = useState('');
    const [dataCompraEdit, setDataCompraEdit] = useState('');
    const [tipoPgtoEdit, setTipoPgtoEdit] = useState('');
    const [obsEdit, setObsEdit] = useState('');
    const [statusEdit, setStatusEdit] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date(dataCompraEdit);
        setShowDatePicker(Platform.OS === 'ios');
        setDataCompraEdit(formatDate(currentDate));
    };

    useEffect(() => {
        database.collection("Compras").doc(id).get()
            .then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    setProdutoEdit(data.produto || '');
                    setMarcaEdit(data.marca || '');
                    setQtdEdit(data.qtd !== null && data.qtd !== undefined ? data.qtd.toString() : '');
                    setValorEdit(data.valor !== null && data.valor !== undefined ? data.valor.toString() : '');
                    setDataCompraEdit(data.dataCompra || '');
                    setTipoPgtoEdit(data.tipoPgto || '');
                    setObsEdit(data.obs || '');
                    setStatusEdit(data.status || '');
                } else {
                    Alert.alert("Erro", "Documento não encontrado.");
                    console.error("Documento não encontrado");
                }
            })
            .catch((error) => {
                Alert.alert("Erro ao verificar documento", "Não foi possível verificar o documento.");
                console.error("Erro ao verificar o documento:", error);
            });
    }, [id]);

    function editTask() {
        if (!produtoEdit.trim() || !marcaEdit.trim() || !dataCompraEdit) {
            Alert.alert("Atenção!", "Os campos Produto, Marca e Data da Compra são obrigatórios.");
            return;
        }

        if (!idUser) {
            Alert.alert("Erro", "ID do usuário não encontrado.");
            console.error("ID do usuário não encontrado");
            return;
        }

        const updatedQtd = qtdEdit.trim() === '' ? '' : parseInt(qtdEdit, 10);
        const updatedValor = valorEdit.trim() === '' ? '' : parseFloat(valorEdit);

        const updatedCheckedItems = { ...checkedItems };
        updatedCheckedItems[id] = true;
        setCheckedItems(updatedCheckedItems);

        database.collection("Compras").doc(id).get()
            .then((doc) => {
                if (doc.exists) {
                    database.collection("Compras").doc(id).update({
                        produto: produtoEdit,
                        marca: marcaEdit,
                        qtd: updatedQtd,
                        valor: updatedValor,
                        obs: obsEdit,
                        tipoPgto: tipoPgtoEdit,
                        dataCompra: dataCompraEdit,
                        status: statusEdit
                    })
                        .then(() => {
                            navigation.navigate("RelacaoGastos");
                        })
                        .catch((error) => {
                            Alert.alert("Erro ao salvar", "Não foi possível salvar as alterações.");
                            console.error("Erro ao salvar as alterações:", error);
                        });
                } else {
                    Alert.alert("Erro", "Documento não encontrado.");
                    console.error("Documento não encontrado");
                }
            })
            .catch((error) => {
                Alert.alert("Erro ao verificar documento", "Não foi possível verificar o documento.");
                console.error("Erro ao verificar o documento:", error);
            });
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={80}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <Text style={styles.label}>Aqui você pode alterar detalhes do seu produto</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Produto"
                        onChangeText={setProdutoEdit}
                        value={produtoEdit}
                        placeholderTextColor="#a9a9a9"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Marca"
                        onChangeText={setMarcaEdit}
                        value={marcaEdit}
                        placeholderTextColor="#a9a9a9"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Valor"
                        onChangeText={(text) => {
                            setValorEdit(text);
                        }}
                        value={valorEdit}
                        keyboardType="numeric"
                        placeholderTextColor="#a9a9a9"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Quantidade"
                        onChangeText={(text) => {
                            setQtdEdit(text);
                        }}
                        value={qtdEdit}
                        keyboardType="numeric"
                        placeholderTextColor="#a9a9a9"
                    />

                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <TextInput
                            style={styles.input}
                            placeholder="Data da compra"
                            value={dataCompraEdit}
                            editable={false}
                            placeholderTextColor="#a9a9a9"
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
                            selectedValue={tipoPgtoEdit}
                            onValueChange={(itemValue, itemIndex) => setTipoPgtoEdit(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Tipo de pagamento" value="" />
                            <Picker.Item label="Cartão de Crédito" value="Cartão de Crédito" />
                            <Picker.Item label="Cartão de Débito" value="Cartão de Débito" />
                            <Picker.Item label="Pix" value="Pix" />
                            <Picker.Item label="Boleto" value="Boleto" />
                        </Picker>
                    </View>
                    <View style={styles.pickerContainerComp}>
                        <Text style={styles.textComprado}>Comprado?</Text>
                        <Picker
                            selectedValue={statusEdit}
                            style={[styles.inputComprado, statusEdit === 'Sim' ? styles.greenText : styles.redText]}
                            onValueChange={(itemValue) => setStatusEdit(itemValue)}
                        >
                            <Picker.Item label="Indefinido" value="" />
                            <Picker.Item label="Não" value="Não" />
                            <Picker.Item label="Sim" value="Sim" />
                        </Picker>
                    </View>
                    <TextInput
                        style={styles.obs}
                        placeholder="Observação"
                        onChangeText={setObsEdit}
                        value={obsEdit}
                        placeholderTextColor="#a9a9a9"
                    />


                </View>
            </ScrollView>
            <TouchableOpacity
                style={styles.buttonNewTask}
                onPress={editTask}
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
   
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 5,
        paddingLeft: 10,
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

    picker: {
        height: 50,
        width: "100%",
        color: "#000",
    },
    pickerContainer: {
        height: 50,
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 5,
        marginBottom: 20,
        justifyContent: "center",
    },
    pickerContainerComp: {
        height: 50,
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 5,
        marginBottom: 20,
        flexDirection: "row",
    },
    obs: {
        height: 120, 
        borderWidth: 1,
        borderColor: "#F92E6A",
        marginBottom: 20,
        padding: 10,
        textAlignVertical: 'top', 
    },
    inputComprado: {
        width: "45%",
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

    greenText: {
        color: "green",
    },
    redText: {
        color: "red",
    },
    textComprado:{
        marginTop:15,
        marginLeft:5
        
    }
    
});
