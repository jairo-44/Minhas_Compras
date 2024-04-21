import React, {Component} from "react";
import { View, Text, StyleSheet } from "react-native";

export default class AreaProf extends Component{
    render(){
        return(
            <View style={Styles.container}>
                <Text style={Styles.title}>Area do Profissional</Text>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#191B31",
        justifyContent: "center",
        alignItems:"center"
    },
    
    title:{
        fontSize:30,
        color:"#FFF",  
              
        
    }
})