import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ejercicio } from '../interfaces/appInterfaces';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { loginStyles } from '../theme/loginTheme';
import Icon from 'react-native-vector-icons/Ionicons';
import routineApi from '../api/routineApi';

export const EditEjercicio = () => {
  const route = useRoute();
  const { ejercicio }: { ejercicio?: Ejercicio } = route.params || {};
  const navigation = useNavigation();

  const { user } = useContext(AuthContext);

  const { nombre_creador, nombre, descripcion, grupo_muscular, imagen, dificultad, onChange } = useForm({
    nombre_creador: ejercicio?.username_creador || '',
    nombre: ejercicio?.nombre || '',
    descripcion: ejercicio?.descripcion || '',
    grupo_muscular: ejercicio?.grupo_muscular || '',
    imagen: ejercicio?.imagen || '',
    dificultad: ejercicio?.dificultad || '',
  });
  const handleBack = () =>{
    navigation.goBack();
  }

  const onEdit = async () => {
     const ejercicioData = {
       nombre_creador: user?.username,
       nombre: nombre,
       descripcion: descripcion,
       grupo_muscular: grupo_muscular,
       imagen: 'generic.png', //faltaria mirar como hacer esto sin añadir un generic
       dificultad: dificultad,
     }

     try {
       const response = await routineApi.put(`/ejercicios/${ejercicio?.id}`, ejercicioData);
       Alert.alert('Éxito', 'El ejercicio se ha modificado correctamente');
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
        onPress={handleBack}
        activeOpacity={0.8}
      >
        <Icon name='arrow-back-outline' size={25} color='white'/>
        <Text style={{...styles.buttonText, fontSize:20}}>Volver</Text>
      </TouchableOpacity>
      <Text style={{ ...loginStyles.title, }}>Editando ejercicio: {ejercicio?.nombre} </Text>
      <Text style={loginStyles.label}>Nombre del ejercicio:</Text>
      <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' value={nombre} onChangeText={(value) => onChange(value, 'nombre')} />
      <Text style={loginStyles.label}>Descripción:</Text>
      <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white'  value={descripcion} onChangeText={(value) => onChange(value, 'descripcion')} />
      <Text style={loginStyles.label}>Grupo muscular:</Text>
      <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white'  value={grupo_muscular} onChangeText={(value) => onChange(value, 'grupo_muscular')} />
      <Text style={loginStyles.label}>Dificultad:</Text>
      <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white'  value={dificultad} onChangeText={(value) => onChange(value, 'dificultad')} />
    </View>
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity activeOpacity={0.8} style={{ ...styles.button, marginBottom: 100, marginTop: 50 }} onPress={onEdit}>
        <Text style={styles.buttonText}>Editar ejercicio</Text>
      </TouchableOpacity>
    </View>

    
  </KeyboardAwareScrollView>
  );
};

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