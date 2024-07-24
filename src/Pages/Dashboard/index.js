import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, Platform, ScrollView} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PolarChart, Pie, CartesianChart, Line } from "victory-native";
import { useFont } from '@shopify/react-native-skia';
import firebase from "../config/firebaseconfig";
import { format } from 'date-fns';

export default function Dashboard({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [searchText, setSearchText] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Sim");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState(null); // Data de início do período
  const [endDate, setEndDate] = useState(null); // Data de término do período
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [tipoPgto, setTipoPgto] = useState(); 
  const [totalsByPaymentType, setTotalsByPaymentType] = useState({});

  
  const font = useFont(require("../../fonts/Roboto-Regular.ttf"));
  const database = firebase.firestore();
  const user = firebase.auth().currentUser;

  const [totalsByDay, setTotalsByDay] = useState({});
  const [totalsByMonth, setTotalsByMonth] = useState({});


  const calculateTotalByDay = (filteredTasks) => {
    const totalsByDay = {};

    if (!filteredTasks) {
      return totalsByDay;
    }

    filteredTasks.forEach(item => {
      const taskDateParts = item.dataCompra.split('/');
      const taskDay = parseInt(taskDateParts[0]);
      const taskDate = new Date(taskDateParts[2], taskDateParts[1] - 1, taskDateParts[0]).toLocaleDateString('pt-BR');

      if (!totalsByDay[taskDay]) {
        totalsByDay[taskDay] = 0;
      }

      const qtd = parseFloat(item.qtd) || 0;
      const valor = parseFloat(item.valor) || 0;
      totalsByDay[taskDay] += qtd * valor;
    });

    return totalsByDay;
  };

  const calculateTotalByMonth = (filteredTasks) => {
    const totalsByMonth = {};
  
    if (!filteredTasks) {
      return totalsByMonth; 
    }
  
    filteredTasks.forEach(item => {
      const taskDateParts = item.dataCompra.split('/');
      const taskMonth = parseInt(taskDateParts[1]);
      const taskYear = parseInt(taskDateParts[2]);
      const monthKey = `${taskMonth}/${taskYear}`;
  
      if (!totalsByMonth[monthKey]) {
        totalsByMonth[monthKey] = 0;
      }
  
      const qtd = parseFloat(item.qtd) || 0;
      const valor = parseFloat(item.valor) || 0;
      totalsByMonth[monthKey] += qtd * valor;
    });
  
    return totalsByMonth;
  };

  //Total por meio de pagamento
  const calculateTotalByPaymentType = (filteredTasks) => {
    const totalsByPaymentType = {};
  
    if (!filteredTasks) {
      return totalsByPaymentType; // Retornar um objeto vazio se filteredTasks for indefinido ou vazio
    }
  
    filteredTasks.forEach(item => {
      const tipoPgto = item.tipoPgto || "Desconhecido"; // Definir "Desconhecido" se tipoPgto não estiver presente
  
      if (!totalsByPaymentType[tipoPgto]) {
        totalsByPaymentType[tipoPgto] = 0;
      }
  
      const qtd = parseFloat(item.qtd) || 0;
      const valor = parseFloat(item.valor) || 0;
      totalsByPaymentType[tipoPgto] += qtd * valor;
    });
  
    return totalsByPaymentType;
  };
  
  

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

  useEffect(() => {
    const filteredTasks = filterTasks(); // Filtra as tarefas com base nos filtros aplicados
    const totalsByDay = calculateTotalByDay(filteredTasks); // Calcula os totais por dia
    setTotalsByDay(totalsByDay); // Atualiza o estado
    const totalsByMonth = calculateTotalByMonth(filteredTasks); // Calcula os totais por mês
    setTotalsByMonth(totalsByMonth); // Atualiza o estado
    const totalsByPaymentType = calculateTotalByPaymentType(filteredTasks); // Calcula os totais por tipo de pagamento
    setTotalsByPaymentType(totalsByPaymentType); // Atualiza o estado
  }, [tasks, startDate, endDate]); // Dependências para recálculo dos totais
  

  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate();
    const month = date.getMonth() + 1; // Os meses são indexados de 0 a 11
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  };

  const lineChartData = Object.entries(totalsByDay).map(([day, total]) => ({
    x: parseInt(day), // Dia
    y: total // Total correspondente
  }));

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
    let filteredByMonthAndYear = filterTasksByMonthAndYear();
    filteredByMonthAndYear = filterTasksByCategory(filteredByMonthAndYear);
    filteredByMonthAndYear = filterTasksBySearchText(filteredByMonthAndYear);
    filteredByMonthAndYear = filterTasksByStatus(filteredByMonthAndYear);
    filteredByMonthAndYear = filterTasksByPeriod(filteredByMonthAndYear);
    return filteredByMonthAndYear.sort((a, b) => (a.produto > b.produto) ? 1 : ((b.produto > a.produto) ? -1 : 0));
  };

  const calculateTotal = () => {
    const filteredTasks = filterTasks(); // Filtra as tarefas com base nos filtros aplicados
    const totalGeral = filteredTasks.reduce((total, item) => {
      const qtd = parseFloat(item.qtd) || 0;
      const valor = parseFloat(item.valor) || 0;
      return total + (qtd * valor);
    }, 0).toFixed(2);

    const categorias = {};
    filteredTasks.forEach(item => {
      if (!categorias[item.categoria]) {
        categorias[item.categoria] = 0;
      }
      const qtd = parseFloat(item.qtd) || 0;
      const valor = parseFloat(item.valor) || 0;
      categorias[item.categoria] += qtd * valor;
    });

    return { totalGeral, categorias };
  };

  const { totalGeral, categorias } = calculateTotal();

  const categoryColors = {
    'Alimentos': '#19CD9B',
    'Limpeza': '#F0F40B',
    'Higiene': '#0038FE',
    'Supérfluos': '#FF3333',
    'Pet': '#5F6A60',
    'Farmácia': '#FD0ED7',
    'Suplementos': '#1F3462',
    'Combustível': '#F40B89',
    'Eletrônicos': '#800BF4',
    'Casa(intens e acessórios)': '#FF3333',
    'Acessórios Carro': '#F40B89',
    'Acessórios Pessoais': '#897F85',
  };

  const pieChartData = Object.entries(categorias).map(([categoria, total], index) => ({
    name: `- ${categoria}`,
    value: parseFloat(total.toFixed(2)),
    color: categoryColors[categoria] || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    legendFontColor: "#000000",
    legendFontSize: 10
  }));

  const legendData = Object.entries(categorias).map(([categoria, total]) => {
    const percentage = ((total / totalGeral) * 100).toFixed(1);
    return {
      name: `${categoria} (${percentage}%)`,
      color: categoryColors[categoria] || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.datePickerContainer}>
        <Text style={[styles.tituloNome, { marginRight: 15 }]}>Escolha um período:</Text>
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
      
      {startDate && endDate && (
      <ScrollView>
        {/* Total geral e por categoria */}
        <View style={styles.categoryTotalContainer}>
          <View style={styles.categoryItemsContainer}>
            {Object.entries(categorias).map(([categoria, total], index) => (
              <View key={index} style={styles.categoryTotalItem}>
                <Text style={styles.categoryTotalText}>{categoria}: R$ {total.toFixed(2)}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.totalText}>Total: R$ {totalGeral}</Text>
        </View>
  
        {/* Gráfico de pizza e legenda */}
        <View style={styles.chartAndLegendContainer}>
          <View style={styles.pieChartContainer}>
            <PolarChart
              data={pieChartData}
              labelKey={pieChartData}
              valueKey={"value"}
              colorKey={"color"}
            >
              <Pie.Chart />
            </PolarChart>
          </View>
          <View style={styles.legendContainer}>
            {legendData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
  
        {/* Total por tipo de pagamento */}
        <View style={styles.totalPorTipoPgtoContainer}>
          <Text style={styles.totalTextMes}>Gasto por tipo de pagamento</Text>
          {Object.entries(totalsByPaymentType).map(([tipoPgto, total], index) => (
            <View key={index} style={styles.categoryTotalItem}>
              <Text style={styles.categoryTotalText}>{tipoPgto}: R$ {total.toFixed(2)}</Text>
            </View>
          ))}
        </View>
  
        {/* Total por mês */}
        <View style={styles.totalPorMesContainer}>
          <Text style={styles.totalTextMes}>Gasto por mês</Text>
          {Object.entries(totalsByMonth).map(([month, total], index) => (
            <View key={index} style={styles.categoryTotalItem}>
              <Text style={styles.categoryTotalText}>{month}: R$ {total.toFixed(2)}</Text>
            </View>
          ))}
        </View>
  
        {/* Total por dia e gráfico de linhas */}
        <Text style={styles.totalTextDia}>Gasto por dia </Text>
        <View style={styles.chartAndTotalContainer}>
          <View style={styles.totalContainer}>
            {Object.entries(totalsByDay).map(([day, total], index) => (
              <View key={index} style={styles.categoryTotalItem}>
                <Text style={styles.categoryTotalText}>{day}: R$ {total.toFixed(2)}</Text>
              </View>
            ))}
          </View>
          <View style={styles.chartContainer}>
            <CartesianChart
              data={lineChartData}
              xKey="x"
              yKeys={["y"]}
              axisOptions={{
                tickCount: 5,
                font: font,
                labelOffset: { x: 3, y: 2 },
                labelPosition: "outset",
                formatYLabel: (value) => `${value}`,
                formatXLabel: (value) => `${value}`
              }}
              style={{ height: 200 }} 
            >
              {({ points }) => (
                <Line
                  points={points.y}
                  color="red"
                  strokeWidth={3}
                  animate={{ type: "timing", duration: 300 }}
                />
              )}
            </CartesianChart>
          </View>
        </View>
        <Text style={styles.tituloAviso}>Os dados deste gráfico valem quando selecionado período de até 1 mês</Text>
      </ScrollView>
      )}
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingHorizontal: 25,
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
  chartAndLegendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pieChartContainer: {
    width: "45%",
    height: 130,
  },
  legendContainer: {
    width: "40%",
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginLeft: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 15,
    marginTop:25
  },
  totalTextDia: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 15,
    marginTop: 25,
    textAlign: 'center', 
    alignSelf: 'center', 
  },
  categoryTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    borderWidth: 3,
    borderColor: '#DDD',
    padding: 10,
    marginBottom: 20,
  },
  categoryItemsContainer: {
    flex: 1,
  },
  categoryTotalItem: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  categoryTotalText: {
    fontSize: 12,
  },
  chartAndTotalContainer: {
    flexDirection: 'row',
    marginTop: 1,
  },
  totalContainer: {
    flex: 0.3, 
    paddingHorizontal: 5,
  },
  totalValue: {
    fontSize: 15,
  },
  chartContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 5,
   
  },
  tituloAviso: {
    textAlign: "center",
    marginTop:5,
    margin:35,
    fontSize: 12,
    fontWeight: "bold",
    color:'red'
},
  
  totalTextMes: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 3,
    textAlign: 'center', 
    alignSelf: 'center',
  },
  totalPorMesContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 3,
    borderColor: '#DDD',
    padding: 10,
  },
  totalPorTipoPgtoContainer: {
    marginBottom: 5,
    paddingHorizontal: 10,
    borderWidth: 3,
    borderColor: '#DDD',
    padding: 10,
  },
  
});
