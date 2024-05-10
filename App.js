import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/Pages/Login';
import CadastroAluno from './src/Pages/CadastroAluno';
import CadastroProf from './src/Pages/CadastroProf';
import AreaAluno from './src/Pages/AreaAluno';
import AreaProf from './src/Pages/AreaProf/index';
import ProfIndicados from './src/Pages/ProfIndicados';
import PerfilCompletoProf from './src/Pages/PerfilCompletoProf';
import Bikes from './src/Pages/Bikes';
import AlugBikes from './src/Pages/AlugBikes';
import { Image, View, TouchableOpacity } from 'react-native';
import logo from '../fitConnect/assets/logo.png';
import { AntDesign } from '@expo/vector-icons'; 
import axios from 'axios';

const Stack = createNativeStackNavigator();
//const {abrirLogin, setAbrirLogin} = useState(true);

const CustomHeader = ({ navigation, route }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, width: '100%', height: 70, borderBottomColor: 'white', backgroundColor: '#191B31' }}>
    {route.name !== 'Login' && (
      <TouchableOpacity style={{ position: 'absolute', left: 10 }} onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
    )}
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Image source={logo} style={{ width: 90, height: 90, resizeMode: 'contain' }} />
    </View>
  </View>
);

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <Stack.Navigator
          screenOptions={{
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: '#191B31' },
            headerTintColor: 'white',
            header: (props) => <CustomHeader {...props} />,
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="CadastroAluno" component={CadastroAluno} />
          <Stack.Screen name="CadastroProf" component={CadastroProf} />
          <Stack.Screen name="AreaAluno" component={AreaAluno} />
          <Stack.Screen name="AreaProf" component={AreaProf} />
          <Stack.Screen name="ProfIndicados" component={ProfIndicados} />
          <Stack.Screen name="Bikes" component={Bikes} />
          <Stack.Screen name="PerfilCompletoProf" component={PerfilCompletoProf} />
          <Stack.Screen name="AlugBikes" component={AlugBikes} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}
