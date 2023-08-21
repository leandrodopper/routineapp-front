import React, { useContext, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { AuthContext } from '../context/AuthContext';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useForm } from '../hooks/useForm';
import routineApi from '../api/routineApi';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { loginStyles } from '../theme/loginTheme';
import Icon from 'react-native-vector-icons/Ionicons';
import { Comida, GetDietasResponse } from '../interfaces/appInterfaces';


type AddAlimentoScreenProps = {
    route: RouteProp<{ params: { dieta: GetDietasResponse, comida:Comida } }, 'params'>;
};

export const AddAlimentoScreen = ({ route }: AddAlimentoScreenProps) => {
    const { user, token } = useContext(AuthContext);
    const { dieta, comida } = route.params;
    const navigation = useNavigation<any>();
  
    const { nombre, cantidad, onChange } = useForm({
      nombre: '',
      cantidad: '',
    });
  
    const onAddAlimento = async () => {
      const comidaData = {
        nombre: nombre,
        cantidad : cantidad,
      }
  
      try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await routineApi.post<GetDietasResponse>(`/dietas/${comida.id}/alimentos`, comidaData, config);
        Alert.alert('Éxito', 'El alimento se ha añadido correctamente');
        navigation.navigate('DietaDetailsScreen', {dieta:response.data});
  
      } catch (error) {
        console.log(error);
      }
    };
  
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <View style={loginStyles.title}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Icon name='arrow-back-outline' size={25} color='white'/>
            <Text style={{...styles.buttonText, fontSize:20}}>Volver</Text>
          </TouchableOpacity>
          <Text style={{ ...loginStyles.title, }}>Añadiendo alimento a: {comida.nombre}</Text>
          <Text style={loginStyles.label}>Nombre del alimento:</Text>
          <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Nombre del alimento" value={nombre} onChangeText={(value) => onChange(value, 'nombre')} />
          <Text style={loginStyles.label}>Cantidad:</Text>
          <TextInput style={styles.input} keyboardType='decimal-pad' selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Cantidad" value={cantidad} onChangeText={(value) => onChange(value, 'cantidad')} />
        </View>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity activeOpacity={0.8} style={{ ...styles.button, marginBottom: 100, marginTop: 50 }} onPress={onAddAlimento}>
            <Text style={styles.buttonText}>Añadir alimento</Text>
          </TouchableOpacity>
        </View>
  
      </KeyboardAwareScrollView>
    )
  }
  
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: '#5856D6',
      padding: 25,
    },
    form: {
      marginBottom: 15,
    },
    input: {
      height: 40,
      marginBottom: 15,
      paddingHorizontal: 10,
      color: 'white',
    },
    button: {
      backgroundColor: '#5856D6',
      paddingVertical: 10,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: 'white',
      width: 100,
      flexDirection:'row',
      justifyContent:'center'
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
      
    },
    avisoContainer: {
      backgroundColor: 'green',
      padding: 10,
      marginTop: 10,
      alignItems: 'center',
    },
    avisoText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });