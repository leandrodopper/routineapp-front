import React, { useContext, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native'
import { View } from 'react-native'
import { useForm } from '../hooks/useForm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { loginStyles } from '../theme/loginTheme';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import routineApi from '../api/routineApi';
import Icon  from 'react-native-vector-icons/Ionicons';


export const AddEjercicioScreen = () => {

  const { user } = useContext(AuthContext);
  const [ejercicioCreado, setEjercicioCreado] = useState(false);

  const navigation = useNavigation();

  const { nombre_creador, nombre, descripcion, grupo_muscular, imagen, dificultad, onChange } = useForm({
    nombre_creador: '',
    nombre: '',
    descripcion: '',
    grupo_muscular: '',
    imagen: '',
    dificultad: '',
  });

  const onRegister = async () => {
    const ejercicioData = {
      nombre_creador: user?.username,
      nombre: nombre,
      descripcion: descripcion,
      grupo_muscular: grupo_muscular,
      imagen: 'generic.png',
      dificultad: dificultad,
    }

    try {
      const response = await routineApi.post('/ejercicios', ejercicioData);
      setEjercicioCreado(true);
      Alert.alert('Éxito', 'El ejercicio se ha creado correctamente');
      navigation.navigate('EjerciciosScreen' as never);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={loginStyles.title}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EjerciciosScreen' as never)}
          activeOpacity={0.8}
        >
          <Icon name='arrow-back-outline' size={25} color='white'/>
          <Text style={{...styles.buttonText, fontSize:20}}>Volver</Text>
        </TouchableOpacity>
        <Text style={{ ...loginStyles.title, }}>Nuevo ejercicio personalizado</Text>
        <Text style={loginStyles.label}>Nombre del ejercicio:</Text>
        <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Nombre ejercicio" value={nombre} onChangeText={(value) => onChange(value, 'nombre')} />
        <Text style={loginStyles.label}>Descripción:</Text>
        <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Descripción ejercicio" value={descripcion} onChangeText={(value) => onChange(value, 'descripcion')} />
        <Text style={loginStyles.label}>Grupo muscular:</Text>
        <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Grupo muscular" value={grupo_muscular} onChangeText={(value) => onChange(value, 'grupo_muscular')} />
        <Text style={loginStyles.label}>Dificultad:</Text>
        <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Dificultad (principiante, intermedio, avanzado)" value={dificultad} onChangeText={(value) => onChange(value, 'dificultad')} />
      </View>
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity activeOpacity={0.8} style={{ ...styles.button, marginBottom: 100, marginTop: 50 }} onPress={onRegister}>
          <Text style={styles.buttonText}>Crear ejercicio</Text>
        </TouchableOpacity>
      </View>

      {ejercicioCreado && (
      <View style={styles.avisoContainer}>
        <Text style={styles.avisoText}>El ejercicio se ha creado correctamente</Text>
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