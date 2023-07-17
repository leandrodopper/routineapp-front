import React, { useContext, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { AuthContext } from '../context/AuthContext';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useForm } from '../hooks/useForm';
import routineApi from '../api/routineApi';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { loginStyles } from '../theme/loginTheme';
import Icon from 'react-native-vector-icons/Ionicons';
import { ContenidoRutinas } from '../interfaces/appInterfaces';

type EditRutinaScreenProps = {
  route: RouteProp<{ params: { rutina: ContenidoRutinas } }, 'params'>;
};

export const EditRutinaScreen = ({ route }: EditRutinaScreenProps) => {
  const { rutina } = route.params;
  const { user, token } = useContext(AuthContext);
  const [rutinaCreada, setRutinaCreada] = useState(false);

  const navigation = useNavigation();

  const { nombre, descripcion, onChange } = useForm({
    creador: '',
    nombre: rutina?.nombre || '',
    descripcion: rutina?.descripcion || '',
  });

  const onModifyRutina = async () => {
    const rutinaData = {

      nombre: nombre,
      descripcion: descripcion,
    
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await routineApi.put(`/rutinas/${rutina.id}`, rutinaData, config);
      //Falta añadir en servidor actualizar rutina
      setRutinaCreada(true);
      Alert.alert('Éxito', 'La rutina se ha modificado correctamente');
      navigation.navigate('RutinasScreen' as never);

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
          <Icon name='arrow-back-outline' size={25} color='white' />
          <Text style={{ ...styles.buttonText, fontSize: 20 }}>Volver</Text>
        </TouchableOpacity>
        <Text style={{ ...loginStyles.title, }}>Editando rutina {rutina?.nombre}</Text>
        <Text style={loginStyles.label}>Nombre de la rutina:</Text>
        
        <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Nombre rutina" value={nombre} onChangeText={(value) => onChange(value, 'nombre')} />
        <Text style={loginStyles.label}>Descripción:</Text>
        <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Descripción rutina" value={descripcion} onChangeText={(value) => onChange(value, 'descripcion')} />
      </View>
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity activeOpacity={0.8} style={{ ...styles.button, marginBottom: 100, marginTop: 50 }} onPress={onModifyRutina}>
          <Text style={styles.buttonText}>Editar rutina</Text>
        </TouchableOpacity>
      </View>

      {rutinaCreada && (
        <View style={styles.avisoContainer}>
          <Text style={styles.avisoText}>La rutina se ha modificado correctamente</Text>
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
