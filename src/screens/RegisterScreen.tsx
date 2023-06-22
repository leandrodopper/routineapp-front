import React, { useContext } from 'react'
import { Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { loginStyles } from '../theme/loginTheme'
import { WhiteLogo } from '../components/WhiteLogo'
import { useForm } from '../hooks/useForm'
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AuthContext } from '../context/AuthContext'
import { RegisterData } from '../interfaces/appInterfaces';
import { useState } from 'react';

interface Props extends StackScreenProps<any, any> { }

export const RegisterScreen = ({ navigation }: Props) => {

  const { signUp } = useContext(AuthContext);

  const { email, password, name, surname, username, telefono, altura, peso, edad, onChange } = useForm({
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    telefono: '',
    altura: '',
    peso: '',
    edad: '',
  });

  const [registerData, setRegisterData] = useState<RegisterData>({
    nombre: '',
    apellidos: '',
    username: '',
    email: '',
    password: '',
    telefono: '',
    altura: 0,
    peso: 0,
    edad: 0,
  });



  const onRegister = () => {
    registerData.nombre=name,
    registerData.apellidos=surname,
    registerData.username=username,
    registerData.email=email,
    registerData.password=password,
    registerData.telefono=telefono,
    registerData.altura=parseInt(altura),
    registerData.peso=parseInt(peso),
    registerData.edad=parseInt(edad),
    signUp(registerData);
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={loginStyles.title}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('LoginScreen')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <WhiteLogo />
        <Text style={{ ...loginStyles.title, }}>Registro</Text>
        <Text style={loginStyles.label}>Nombre:</Text>
        <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Nombre" value={name} onChangeText={(value) => onChange(value, 'name')} />
        <Text style={loginStyles.label}>Apellidos:</Text>
        <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Apellido" value={surname} onChangeText={(value) => onChange(value, 'surname')} />
        <Text style={loginStyles.label}>Nombre de usuario:</Text>
        <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Nombre de usuario" value={username} onChangeText={(value) => onChange(value, 'username')} />
        <Text style={loginStyles.label}>Correo electrónico:</Text>
        <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Correo electrónico" value={email} onChangeText={(value) => onChange(value, 'email')} keyboardType="email-address" />
        <Text style={loginStyles.label}>Contraseña:</Text>
        <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Contraseña" value={password} onChangeText={(value) => onChange(value, 'password')} secureTextEntry />
        <Text style={loginStyles.label}>Teléfono:</Text>
        <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Teléfono" value={telefono} onChangeText={(value) => onChange(value, 'telefono')} keyboardType="phone-pad" />
        <Text style={loginStyles.label}>Altura:</Text>
        <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Altura" value={altura} onChangeText={(value) => onChange(value, 'altura')} keyboardType="numeric" />
        <Text style={loginStyles.label}>Peso:</Text>
        <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Peso" value={peso} onChangeText={(value) => onChange(value, 'peso')} keyboardType="numeric" />
        <Text style={loginStyles.label}>Edad:</Text>
        <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Edad" value={edad} onChangeText={(value) => onChange(value, 'edad')} keyboardType="numeric" />
      </View>
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity activeOpacity={0.8} style={{ ...styles.button, marginBottom: 100, marginTop: 50 }} onPress={onRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
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

  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});