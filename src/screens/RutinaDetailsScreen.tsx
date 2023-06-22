import React, { useContext, useEffect } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ContenidoRutinas, DiaRutina, Ejercicio } from '../interfaces/appInterfaces';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TarjetaEjercicio } from '../components/TarjetaEjercicio';
import { RutinasContext } from '../context/RutinasContext';
import routineApi from '../api/routineApi';
import { AuthContext } from '../context/AuthContext';

export const RutinaDetailsScreen = () => {
  const route = useRoute();
  const { rutina, rutinasSeguidasIds, isFromRutinasSeguidas }: { rutina?: ContenidoRutinas, rutinasSeguidasIds?: number[], isFromRutinasSeguidas?: boolean } = route.params || {};
  const navigation = useNavigation();
  const { token } = useContext(AuthContext);
  const rutinasContext = useContext(RutinasContext);
    const { setRutinasSeguidasIds, actualizarRutinas , setActualizarRutinas} = rutinasContext;
  // const { rutinasSeguidasIds: contextRutinasSeguidasIds } = rutinasContext;



  const renderDiaRutina = ({ item: dia }: { item: DiaRutina }) => {
    return (
      <View style={styles.diaRutinaContainer}>
        <Text style={styles.diaRutinaNombre}>{dia.nombre}</Text>
        <FlatList
          data={dia.ejercicios}
          keyExtractor={(ejercicio: Ejercicio) => ejercicio.id.toString()}
          renderItem={({ item: ejercicio }) => (
            <TarjetaEjercicio ejercicio={ejercicio} onDelete={() => { }} />
          )}
          contentContainerStyle={styles.ejerciciosList}
        />
      </View>
    );
  };

  const handleFollowButtonPress = async() => {
    if (!token || !rutina) {
      return; // No realizar la llamada a la API si no hay un token de autenticación o si rutina es undefined
    }
  
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const response = await routineApi.post(`/rutinas/seguir/${rutina.id}`, config);
      setRutinasSeguidasIds(prevIds => [...prevIds, rutina.id]);
      setActualizarRutinas(true);
      setActualizarRutinas(false);
      navigation.goBack();
    } catch (error) {
      console.log('Error al dejar de seguir la rutina:', error);
    }
  };

  const handleUnfollowButtonPress = async () => {
    if (!token || !rutina) {
      return; // No realizar la llamada a la API si no hay un token de autenticación o si rutina es undefined
    }
  
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const response = await routineApi.delete(`/rutinas/dejarseguir/${rutina.id}`, config);
      setRutinasSeguidasIds(prevIds => prevIds.filter(id => id !== rutina.id));
      setActualizarRutinas(true);
      setActualizarRutinas(false);
      navigation.goBack();
    } catch (error) {
      console.log('Error al dejar de seguir la rutina:', error);
    }
  };

  return (
    <View style={styles.global}>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Icon name="arrow-back-outline" size={25} color="#5856D6" />
        <Text style={{ ...styles.buttonText, fontSize: 20 }}>Volver</Text>
      </TouchableOpacity>
      {rutinasSeguidasIds?.includes(rutina?.id ?? 0) ? (
        <Text style={{ alignSelf: 'center', marginTop: 10, color:'black' }}>Ya sigues esta rutina</Text>
      ) : (
        <TouchableOpacity style={styles.seguirButton} onPress={handleFollowButtonPress}>
          <Text style={styles.seguirButtonText}>Seguir rutina</Text>
        </TouchableOpacity>
      )}
      {isFromRutinasSeguidas ? (
        <TouchableOpacity onPress={handleUnfollowButtonPress} style={styles.unfollowButton}>
          <Text style={styles.unfollowButtonText}>Dejar de seguir</Text>
        </TouchableOpacity>
      ) : null}

      <Text style={styles.title}>{rutina?.nombre}</Text>
      <Text style={styles.rutinaField}>Descripción: {rutina?.descripcion}</Text>
      <Text style={styles.rutinaField}>Creada por: {rutina?.creador}</Text>
      <Text style={styles.rutinaField}>Puntuación media: {rutina?.puntuacion}</Text>

      <FlatList
        data={rutina?.dias_rutina}
        keyExtractor={(dia: DiaRutina) => dia.id.toString()}
        renderItem={renderDiaRutina}
        contentContainerStyle={styles.diasRutinaList}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#5856D6',
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginLeft: 14,
  },
  buttonText: {
    color: '#5856D6',
    textAlign: 'center',
  },
  global: {
    padding: 11,
    flex: 1,
  },
  rutinaField: {
    color: 'black',
    fontSize: 15,
    padding: 10,
    marginTop: 10,
  },
  diasRutinaList: {
    paddingBottom: 20,
  },
  diaRutinaContainer: {
    marginBottom: 20,
  },
  diaRutinaNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'black',
  },
  ejerciciosList: {
    paddingHorizontal: 10,
  },
  seguirButton: {
    backgroundColor: '#5856D6',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginTop: 10,
    marginRight: 20,
  },
  seguirButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  unfollowButton: {
    backgroundColor: '#D60000',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginTop: 10,
  },
  unfollowButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',

  },
});

