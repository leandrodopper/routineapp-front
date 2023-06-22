import React, { useContext, useEffect, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import routineApi from '../api/routineApi';

import { AuthContext } from '../context/AuthContext';
import { Rutina } from '../interfaces/appInterfaces';
import { TarjetaRutina } from '../components/TarjetaRutina';
import { RutinasContext } from '../context/RutinasContext';
import { useIsFocused } from '@react-navigation/native';

export const RutinasSeguidasScreen = () => {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const { token } = useContext(AuthContext);
  const isFocused = useIsFocused();
  const { rutinasSeguidasIds, setRutinasSeguidasIds, actualizarRutinas, setActualizarRutinas } = useContext(RutinasContext);
  useEffect(() => {
    const fetchRutinasSeguidas = async () => {
      console.log({actualizarRutinas})
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await routineApi.get<Rutina[]>('/rutinas/rutinas_usuario', config);

        const ids = response.data.map((rutina) => rutina.id);
        setRutinasSeguidasIds(ids);

        setRutinas(response.data);
      } catch (error) {
        console.log('Error:', error);
      }
    };

    fetchRutinasSeguidas();
  }, [actualizarRutinas, isFocused]);

  useEffect(() => {
    if (isFocused) {
      setActualizarRutinas(true);
    }
  }, [isFocused]);

  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{textAlign:'center', fontWeight:'300', marginTop:10, color:'black'}}>En esta pantalla aparecerán las rutinas que sigues, y desde aquí podrás dejar de seguir una rutina o en su defecto, empezar un entrenamiento seleccionando una de las rutinas que sigues</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={rutinas}
        renderItem={({ item }) => (
          <TarjetaRutina rutina={item} isFromRutinasSeguidas={true}/>
        )}
        keyExtractor={(item) => item.id.toString()}
        style={{
          width: '85%',
          marginTop: 10,
        }}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: 'center' , color:'black', fontWeight:'300'}}>
            No sigues ninguna rutina. Selecciona alguna rutina o crea una rutina personalizada en la pestaña 'Rutinas'
          </Text>
        )}
      />


    </View>
  );
}
