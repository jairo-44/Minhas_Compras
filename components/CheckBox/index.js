import React, {useEffect, useState} from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const CheckBox = ({options = [], onChange, multiple=false}) => {
    const [selected, setSelected] = useState([]);
    
    function toggle(id){
        let index =  selected.findIndex((i)=> i === id);
        let arrSelecteds = [...selected];            
        if (index!== -1){
            arrSelecteds.splice(index, 1);            
        }else{
            multiple ? arrSelecteds.push(id) : arrSelecteds = [id];
        }
        setSelected(arrSelecteds);
    }
    useEffect(()=> onChange[selected], [selected])
    
    return (    
        <View style={styles.optContainer}>
            {options.map((op, index)=>(
             <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.optTouchable} onPress={()=> toggle (op?.id)}>
                    {selected.findIndex(i=> i === op.id) !== -1 ? (<Icon name="check-bold" color={'#19CD9B'} size={18}/>
                    ) : null
                    }
                </TouchableOpacity>  
                    <Text style={styles.optText}> {op?.text}</Text>
             </View>
              
            ))}
        </View>
    );
};


const styles = StyleSheet.create({
    optionsContainer:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    optText:{
        marginLeft:12,
        color: 'white',
        fontSize:13,
        fontWeight: '600',
    },
    optContainer:{
        marginLeft:12,
    },
    optTouchable:{
        height:20,
        width:20,
        borderBottomEndRadius:4,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#19CD9B',
        borderWidth: 2,
        marginTop:10
    }
})

export default CheckBox;