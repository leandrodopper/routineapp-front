import React, { useContext, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useForm } from '../hooks/useForm';
import routineApi from '../api/routineApi';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { loginStyles } from '../theme/loginTheme';
import Icon from 'react-native-vector-icons/Ionicons';

export const AddDietaScreen = () => {
    const { user, token } = useContext(AuthContext);
    const [dietaCreada, setDietaCreada] = useState(false);
  
    const navigation = useNavigation();
  
    const { nombre, onChange } = useForm({
      creador: '',
      nombre: '',
    });
  
    const onAddDieta = async () => {
      const dietaData = {
        creador: user?.username,
        nombre: nombre,
      }
  
      try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await routineApi.post('/dietas/guardar', dietaData, config);
        setDietaCreada(true);
        Alert.alert('Éxito', 'La dieta se ha creado correctamente');
        navigation.goBack();
  
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
          <Text style={{ ...loginStyles.title, }}>Nueva dieta</Text>
          <Text style={loginStyles.label}>Nombre de la dieta:</Text>
          <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Nombre dieta" value={nombre} onChangeText={(value) => onChange(value, 'nombre')} />
        </View>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity activeOpacity={0.8} style={{ ...styles.button, marginBottom: 100, marginTop: 50 }} onPress={onAddDieta}>
            <Text style={styles.buttonText}>Crear dieta</Text>
          </TouchableOpacity>
        </View>
  
        {dietaCreada && (
        <View style={styles.avisoContainer}>
          <Text style={styles.avisoText}>La dieta se ha creado correctamente</Text>
        </View>
      )}
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