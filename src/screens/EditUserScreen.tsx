import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ejercicio, Usuario } from '../interfaces/appInterfaces';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthContext } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { loginStyles } from '../theme/loginTheme';
import Icon from 'react-native-vector-icons/Ionicons';
import routineApi from '../api/routineApi';

export const EditUserScreen = () => {
  const route = useRoute();
  const { user }: { user?: Usuario } = route.params || {};
  const navigation = useNavigation();
  const { signUp, logOut, signIn } = useContext(AuthContext);


  const {
    nombre,
    apellidos,
    telefono,
    altura,
    peso,
    edad,
    onChange,
  } = useForm({
    nombre: user?.nombre || '',
    apellidos: user?.apellidos || '',
    telefono: user?.telefono || '',
    altura: user?.altura.toString() || '',
    peso: user?.peso.toString() || '',
    edad: user?.edad.toString() || '',
  });

  const handleBack = () => {
    navigation.goBack();
  }

  const onEdit = async () => {
    const userData = {
      nombre: nombre,
      apellidos: apellidos,
      telefono: telefono,
      altura: altura,
      peso: peso,
      edad: edad,
    }

    try {
      const response = await routineApi.put<Usuario>(`/auth/actualizar/userId/${user?.id}`, userData);

      Alert.alert('Éxito', 'Los datos del usuario han sido actualizados. Por favor, vuelve a iniciar sesión');
      logOut();
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
          <Icon name='arrow-back-outline' size={25} color='white' />
          <Text style={{ ...styles.buttonText, fontSize: 20 }}>Volver</Text>
        </TouchableOpacity>
        <Text style={{ ...loginStyles.title, }}>Editando datos de usuario</Text>
        <Text style={loginStyles.label}>Nombre del usuario:</Text>
        <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' value={nombre} onChangeText={(value) => onChange(value, 'nombre')} />
        <Text style={loginStyles.label}>Apellidos del usuario:</Text>
        <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' value={apellidos} onChangeText={(value) => onChange(value, 'apellidos')} />
        <Text style={loginStyles.label}>Nueva Contraseña:</Text>
        <Text style={loginStyles.label}>Teléfono:</Text>
        <TextInput style={styles.input} selectionColor='white' keyboardType='phone-pad' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' value={telefono} onChangeText={(value) => onChange(value, 'telefono')} />
        <Text style={loginStyles.label}>Altura:</Text>
        <TextInput style={styles.input} selectionColor='white' keyboardType='decimal-pad' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' value={altura} onChangeText={(value) => onChange(value, 'altura')} />
        <Text style={loginStyles.label}>Peso:</Text>
        <TextInput style={styles.input} selectionColor='white' keyboardType='decimal-pad' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' value={peso} onChangeText={(value) => onChange(value, 'peso')} />
        <Text style={loginStyles.label}>Edad:</Text>
        <TextInput style={styles.input} selectionColor='white' keyboardType='number-pad' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' value={edad} onChangeText={(value) => onChange(value, 'edad')} />
      </View>
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity activeOpacity={0.8} style={{ ...styles.button, marginBottom: 100, marginTop: 50 }} onPress={onEdit}>
          <Text style={styles.buttonText}>Editar usuario</Text>
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
    flexDirection: 'row',
    justifyContent: 'center'
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
