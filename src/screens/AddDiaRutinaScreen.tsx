import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useContext, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ContenidoRutinas, DiaRutina } from '../interfaces/appInterfaces';
import { loginStyles } from '../theme/loginTheme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import { useForm } from '../hooks/useForm';
import { AuthContext } from '../context/AuthContext';
import routineApi from '../api/routineApi';


export const AddDiaRutinaScreen = () => {
  const route = useRoute();
  const { token } = useContext(AuthContext);
  const navigation = useNavigation<any>();
  const [diaRutinaCreado, setDiaRutinaCreado] = useState(false);
  const [rutinaResp, setRutinaResp] = useState<ContenidoRutinas>();

  const { rutina, rutinasSeguidasIds, isFromRutinasSeguidas, isFromRutinasCreadas }: { rutina?: ContenidoRutinas, rutinasSeguidasIds?: number[], isFromRutinasSeguidas?: boolean, isFromRutinasCreadas?: boolean } = route.params || {};
  const { nombre, descripcion, onChange } = useForm({
    descripcion: '',
    nombre: '',
  });



  const onAddDiarutina = async () => {
    const rutinaData = {
      id_rutina: rutina?.id,
      descripcion: descripcion,
      nombre: nombre,
      ejerciciosDiaRutina: [],
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await routineApi.post<DiaRutina>('/diasrutina', rutinaData, config);


      setDiaRutinaCreado(true);

      await new Promise((resolve) => {
        Alert.alert('Éxito', 'Se ha añadido el nuevo dia con éxito', [{ text: 'Aceptar', onPress: resolve }]);
      });
      const rutinaActualizada = { ...rutina };
    const diasRutinaActualizados = rutina?.dias_rutina ? [...rutina.dias_rutina, response.data] : [response.data]; 
    rutinaActualizada.dias_rutina = diasRutinaActualizados; 

      navigation.navigate('RutinaDetailsScreen' as never, { rutina: rutinaActualizada, isFromRutinasCreadas: true });
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
        <Text style={{ ...loginStyles.title, }}>Añadiendo nuevo día a la rutina: {rutina?.nombre}</Text>
        <Text style={loginStyles.label}>Nombre del día:</Text>
        <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Ej. Push Day" value={nombre} onChangeText={(value) => onChange(value, 'nombre')} />
        <Text style={loginStyles.label}>Descripción:</Text>
        <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Breve descripción de lo que haremos ese día" value={descripcion} onChangeText={(value) => onChange(value, 'descripcion')} />
      </View>
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity activeOpacity={0.8} style={{ ...styles.button, marginBottom: 100, marginTop: 50 }} onPress={onAddDiarutina}>
          <Text style={styles.buttonText}>Añadir día</Text>
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
