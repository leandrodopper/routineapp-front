import React, { useContext, useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ContenidoRutinas, DiaRutina, Ejercicio, EjercicioDiaRutina } from '../interfaces/appInterfaces';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TarjetaEjercicio } from '../components/TarjetaEjercicio';
import { RutinasContext } from '../context/RutinasContext';
import routineApi from '../api/routineApi';
import { AuthContext } from '../context/AuthContext';

export const RutinaDetailsScreen = () => {
  const route = useRoute();
  const { rutina, rutinasSeguidasIds, isFromRutinasSeguidas, isFromRutinasCreadas }: { rutina?: ContenidoRutinas, rutinasSeguidasIds?: number[], isFromRutinasSeguidas?: boolean, isFromRutinasCreadas?: boolean } = route.params || {};
  const navigation = useNavigation();
  const { token } = useContext(AuthContext);
  const rutinasContext = useContext(RutinasContext);
  const { setRutinasSeguidasIds, actualizarRutinas, setActualizarRutinas } = rutinasContext;
  // const { rutinasSeguidasIds: contextRutinasSeguidasIds } = rutinasContext;
  const [listaEjercicios, setListaEjercicios] = useState<Ejercicio[]>([]);



  const obtenerIdsEjercicios = (diaRutina: DiaRutina): number[] => {
    const { ejerciciosDiaRutina } = diaRutina;
    const idsEjercicios = ejerciciosDiaRutina.map(({ ejercicioId }) => ejercicioId)
    return idsEjercicios;
  }

  const getDatosEjercicio = async (ejercicioId: number) => {


    if (!token || !rutina) {
      return; // No realizar la llamada a la API si no hay un token de autenticación o si rutina es undefined
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await routineApi.get<Ejercicio>(`/ejercicios/${ejercicioId}`, config);
      const ejercicio = response.data;
      if (ejercicio) {
        // Actualizar la lista de ejercicios con el ejercicio obtenido
        setListaEjercicios((prevLista) => [...prevLista, ejercicio]);
      }

    } catch (error) {
      console.log('Error al obtener los datos del ejercicio:', error);
      return null;
    }
  }

  useEffect(() => {
    // Mostrar los IDs y nombres de los ejercicios en cada DiaRutina
    if (rutina && rutina.dias_rutina) {
      rutina.dias_rutina.forEach((dia) => {
        const idsEjercicios = obtenerIdsEjercicios(dia);

        idsEjercicios.forEach(async (ejercicioId) => {
          const ejercicio = await getDatosEjercicio(ejercicioId);
        });
      });
    }
  }, [rutina]);

  const renderDiaRutina = ({ item: dia }: { item: DiaRutina }) => {
    return (
      <View style={styles.diaRutinaContainer}>
        <Text style={styles.diaRutinaNombre}>{dia.nombre}</Text>
        <FlatList
          data={dia.ejerciciosDiaRutina}
          keyExtractor={(ejercicio) => ejercicio.id_EjercicioRutina.toString()}
          renderItem={({ item: ejercicio }) => {
            // Buscar el ejercicio correspondiente en la lista de ejercicios
            const ejercicioEncontrado = listaEjercicios.find((ej) => ej.id === ejercicio.ejercicioId);

            return (
              <View>
                <TarjetaEjercicio ejercicio={ejercicioEncontrado as Ejercicio} onDelete={() => { }} series={ejercicio.series} repeticiones={ejercicio.repeticiones} />
              </View>
            );
          }}
          contentContainerStyle={styles.ejerciciosList}
        />
      </View>
    );
  };



  const handleFollowButtonPress = async () => {
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

  const handleAddDiarutina = () => {
    console.log('Add dia rutina pressed en rutina id:',rutina?.id);
    navigation.navigate('AddDiaRutinaScreen' as never); 
  }

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
        <Text style={{ alignSelf: 'center', marginTop: 10, color: 'black' }}>Ya sigues esta rutina</Text>
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
      {isFromRutinasCreadas ? (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ color: 'black' }}>Añadir nuevo día a la rutina</Text>

          <TouchableOpacity style={styles.añadirDiaRutinaButton} onPress={handleAddDiarutina}>
            <Icon name="add-outline" color='white' size={20} />
          </TouchableOpacity>

        </View>

      ) : null}

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
    color: 'black',
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
  añadirDiaRutinaButton: {
    height: 80,
    width: 80,
    backgroundColor: '#5856D6',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 10,
  }
});

