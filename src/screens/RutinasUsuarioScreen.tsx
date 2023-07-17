import React, { useContext, useEffect, useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import routineApi from '../api/routineApi';

import { AuthContext } from '../context/AuthContext';
import { Rutina } from '../interfaces/appInterfaces';
import { TarjetaRutina } from '../components/TarjetaRutina';
import { RutinasContext } from '../context/RutinasContext';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';

export const RutinasUsuarioScreen = () => {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const { token } = useContext(AuthContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { rutinasSeguidasIds, setRutinasSeguidasIds, actualizarRutinas, setActualizarRutinas } = useContext(RutinasContext);
  useEffect(() => {
    const fetchRutinasCreadas = async () => {
      // console.log({actualizarRutinas})
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await routineApi.get<Rutina[]>('/rutinas/creadas_usuario', config);
        setRutinas(response.data);
      } catch (error) {
        console.log('Error:', error);
      }
    };

    fetchRutinasCreadas();
  }, [actualizarRutinas, isFocused]);

  useEffect(() => {
    if (isFocused) {
      setActualizarRutinas(true);
      setActualizarRutinas(false);
    }
  }, [isFocused]);


  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ textAlign: 'center', fontWeight: '300', marginTop: 10, color: 'black' }}>En esta pantalla aparecerán las rutinas que has creado. Desde aquí podrás editar o eliminar tus rutinas así como gestionar los dias de tu rutina</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={rutinas}
        renderItem={({ item }) => (
          <TarjetaRutina rutina={item} isFromRutinasSeguidas={false} isFromRutinasCreadas={true} />
        )}
        keyExtractor={(item) => item.id.toString()}
        style={{
          width: '85%',
          marginTop: 10,
        }}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: 'center', color: 'black', fontWeight: '300' }}>
            No has creado ninguna rutina. Crea una rutina personalizada en la pestaña 'Rutinas'
          </Text>
        )}
      />


    </View>
  );
}
