import React, { useState } from 'react';
import { StatusBar, SafeAreaView, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/Pages/Login';
import NovoUsuario from './src/Pages/NovoUsuario';
import Editar from './src/Pages/Editar';
import RelacaoGastos from "./src/Pages/RelacaoGastos";
import ListaCompras from "./src/Pages/ListaCompras";
import NovoProduto2 from './src/Pages/NovoProduto2';
import Dashboard from './src/Pages/Dashboard';
import Home from './src/Pages/Home';
import EditarPerfil from './src/Pages/EditarPerfil';


const Stack = createNativeStackNavigator();

export default function App() {
    const [checkedItems, setCheckedItems] = useState({});

    return (
        <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#f92e6a" />
            <SafeAreaView style={styles.container}>
                <Stack.Navigator
                    initialRouteName='Login'
                    screenOptions={{
                        headerStyle: {
                            height: 100, 
                        },
                        headerTitleStyle: {
                            fontSize: 18, 
                        },
                        headerRight: () => (
                            <Image
                                source={require('./assets/logoCompras.png')}
                                style={{ width: 45, height: 45 }} 
                            />
                        ),
                    }}
                >
                    <Stack.Screen
                        name='Login'
                        component={Login}
                        options={{                        
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name='NovoUsuario'
                        component={NovoUsuario}
                        options={{
                            title: 'Cadastrar conta',
                            headerTintColor: "#f92e6a",
                        }}
                    />                    
                    
                    <Stack.Screen
                        name='Editar'
                        options={{
                            title: 'Editar',
                            headerTintColor: "#f92e6a",
                        }}
                    >
                        {props => <Editar {...props} checkedItems={checkedItems} setCheckedItems={setCheckedItems} />}
                    </Stack.Screen>

                    <Stack.Screen
                        name='RelacaoGastos'
                        options={{
                            title: 'Relação dos gastos',
                            headerTintColor: "#f92e6a",
                            headerBackVisible: true, 
                        }}
                    >
                        {props => <RelacaoGastos {...props} checkedItems={checkedItems} setCheckedItems={setCheckedItems} />}
                    </Stack.Screen>
                    <Stack.Screen
                        name='ListaCompras'
                        options={{
                            title: 'Lista de compras',
                            headerTintColor: "#f92e6a",
                            headerBackVisible: true, 
                        }}
                    >
                        {props => <ListaCompras {...props} checkedItems={checkedItems} setCheckedItems={setCheckedItems} />}
                    </Stack.Screen>
                    <Stack.Screen
                        name='NovoProduto2'
                        component={NovoProduto2}
                        options={{
                            title: 'Novo Produto',
                            headerTintColor: "#f92e6a",
                        }}
                    />
                     <Stack.Screen
                        name='Dashboard'
                        component={Dashboard}
                        options={{
                            title: 'Gráficos',
                            headerTintColor: "#f92e6a",
                        }}
                    />
                    <Stack.Screen
                        name='Home'
                        component={Home}
                        options={{
                            title: 'Home',
                            headerTintColor: "#f92e6a",
                            headerBackVisible: false, 
                        }}
                    />
                    <Stack.Screen
                        name='EditarPerfil'
                        component={EditarPerfil}
                        options={{
                            title: 'Edital perfil',
                            headerTintColor: "#f92e6a",
                            headerBackVisible: true, 
                        }}
                    />
                </Stack.Navigator>
            </SafeAreaView>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
