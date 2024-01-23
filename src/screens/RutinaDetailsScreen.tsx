import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ContenidoRutinas, DiaRutina, Ejercicio, EjercicioDiaRutina } from '../interfaces/appInterfaces';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TarjetaEjercicio } from '../components/TarjetaEjercicio';
import { RutinasContext } from '../context/RutinasContext';
import routineApi from '../api/routineApi';
import { AuthContext } from '../context/AuthContext';

export const RutinaDetailsScreen = () => {
  const route = useRoute();
  const { rutina, rutinasSeguidasIds, isFromRutinasSeguidas, isFromRutinasCreadas, isFromAddEjercicioADiaRutina }: { rutina?: ContenidoRutinas, rutinasSeguidasIds?: number[], isFromRutinasSeguidas?: boolean, isFromRutinasCreadas?: boolean, isFromAddEjercicioADiaRutina?: boolean } = route.params || {};
  const navigation = useNavigation<any>();
  const { token } = useContext(AuthContext);
  const rutinasContext = useContext(RutinasContext);
  const { setRutinasSeguidasIds, actualizarRutinas, setActualizarRutinas } = rutinasContext;
  const [listaEjercicios, setListaEjercicios] = useState<Ejercicio[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [puntuacion, setPuntuacion] = useState(0);
  const [showCountdownModal, setshowCountdownModal] = useState(false);
  const [countdown, setCountdown] = useState(3);



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
        setListaEjercicios((prevLista) => [...prevLista, ejercicio]);
        setIsLoaded(true);
      }


    } catch (error) {
      console.log('Error al obtener los datos del ejercicio:', error);
      return null;
    }
  }


  useEffect(() => {
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

    const tieneEjercicios = dia.ejerciciosDiaRutina.length > 0;

    return (
      <View style={styles.diaRutinaContainer}>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Text style={{ ...styles.diaRutinaNombre, flex: 1 }}>{dia.nombre}</Text>
            {tieneEjercicios && isFromRutinasSeguidas && (
              <TouchableOpacity style={styles.empezarEntrenoButton} onPress={() =>startCountdown(dia)}>
                <Text style={styles.empezarEntrenoButtonText}>Empezar entreno</Text>
              </TouchableOpacity>
            )}
            <Modal visible={showCountdownModal} transparent>
              <View style={styles.modalContainer}>
                <Text style={{...styles.countdownText, fontSize:24}}>Cargando ejercicios! Ánimo!</Text>
                <Text style={styles.countdownText}>{countdown}</Text>
              </View>
            </Modal>
          </View>

          {isFromRutinasCreadas && (
            <TouchableOpacity style={styles.deleteDiaRutinaButton} onPress={() => handleBorrarDiaRutina(dia)}>
              <Icon name="trash-outline" size={20} color="black" />
            </TouchableOpacity>
          )}
        </View>



        <Text style={{ marginTop: 5, color: 'black', marginBottom: 10 }}>{dia.descripcion}</Text>
        <FlatList
          data={dia.ejerciciosDiaRutina}
          keyExtractor={(ejercicio) => ejercicio.id_EjercicioRutina.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: ejercicio }) => {
            const ejercicioEncontrado = listaEjercicios.find((ej) => ej.id === ejercicio.ejercicioId);

            return (
              <View>
                <View style={{ marginTop: -15 }}>
                  {isFromRutinasCreadas && (
                    <TouchableOpacity
                      style={styles.deleteEjercicioButton}
                      onPress={() => {
                        if (ejercicioEncontrado) {
                          handleEliminarEjercicioDeDia(dia, ejercicio);
                        }
                      }}
                    >
                      <Icon style={{ alignSelf: 'center' }} name="close-circle-outline" size={35} color="black" />
                    </TouchableOpacity>
                  )}


                  {isLoaded ? (
                    <TarjetaEjercicio
                      ejercicio={ejercicioEncontrado as Ejercicio}
                      width={'100%'}
                      height={120}
                      series={ejercicio.series}
                      repeticiones={ejercicio.repeticiones}
                      onDelete={() => { }}
                    />
                  ) : (
                    <View style={{ width: '100%', height: 120, justifyContent: 'center', alignItems: 'center' }}>
                      <ActivityIndicator size="large" color="blue" />
                    </View>
                  )}


                </View>

              </View>
            );
          }}
          contentContainerStyle={styles.ejerciciosList}
        />


        {isFromRutinasCreadas && (
          <TouchableOpacity style={styles.addEjercicioButton} onPress={() => handleaddEjercicioADiaRutina(dia, rutina as ContenidoRutinas)}>
            <Text style={styles.addEjercicioButtonText}>Añadir ejercicio</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };


  const handleaddEjercicioADiaRutina = (dia: DiaRutina, rutina: ContenidoRutinas) => {
    navigation.navigate('AddEjercicioADiaRutinaScreen', { dia, rutina });
  }

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
    navigation.navigate('AddDiaRutinaScreen', { rutina });
  }

  const handleEditarRutina = () => {
    navigation.navigate('EditRutinaScreen', { rutina });
  }

  const handleEliminarRutina = () => {

    Alert.alert('Confirmación', `Vas a eliminar una rutina, ¿estás seguro?`,
      [
        {
          text: 'Aceptar', onPress: async () => {
            if (!token || !rutina) {
              return;
            }
            try {
              const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };
              console.log("Vamos a borrar la rutina con id: ", rutina?.id)
              const response = await routineApi.delete(`/rutinas/${rutina.id}`, config);
              navigation.goBack();
            } catch (error) {
              console.log('Error al borrar  la rutina:', error);
            }
          }
        },
        { text: 'Cancelar', onPress: () => { } }
      ]);
  }

  const handleBorrarDiaRutina = (dia: DiaRutina) => {
    Alert.alert('Confirmación', `Vas a eliminar un día de la rutina, ¿estás seguro?`,
      [
        {
          text: 'Aceptar', onPress: async () => {
            if (!token || !rutina) {
              return; // No realizar la llamada a la API si no hay un token de autenticación o si rutina es undefined
            }
            try {
              const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };

              const response = await routineApi.delete(`/diasrutina/${dia.id}`, config);
              const response2 = await routineApi.get<ContenidoRutinas>(`/rutinas/${rutina.id}`, config);
              navigation.navigate('RutinaDetailsScreen', { rutina: response2.data, isFromRutinasCreadas: true });
            } catch (error) {
              console.log('Error al borrar el dia de la rutina:', error);
            }
          }
        },
        { text: 'Cancelar', onPress: () => { } }
      ]);
  }

  const handleEliminarEjercicioDeDia = async (dia: DiaRutina, ejercicioDiaRutina: EjercicioDiaRutina) => {
    Alert.alert('Confirmación', `Vas a eliminar un ejercicio de la rutina, ¿estás seguro?`,
      [
        {
          text: 'Aceptar', onPress: async () => {
            if (!token || !rutina) {
              return; // No realizar la llamada a la API si no hay un token de autenticación o si rutina es undefined
            }
            try {
              const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };
              const response = await routineApi.delete(`/diasrutina/${dia.id}/removeEjercicio/${ejercicioDiaRutina.id_EjercicioRutina}`, config);
              const response2 = await routineApi.get<ContenidoRutinas>(`/rutinas/${rutina.id}`, config);
              navigation.navigate('RutinaDetailsScreen', { rutina: response2.data, isFromRutinasCreadas: true });
            } catch (error) {
              console.log('Error al eliminar el ejercicio del dia:', error);
            }
          }
        },
        { text: 'Cancelar', onPress: () => { } }
      ]);
  }

  const handlePuntuacion = (numeroEstrellas: number) => {
    setPuntuacion(numeroEstrellas);
    Alert.alert('Confirmación', `Quieres puntuar la rutina ${rutina?.nombre} con ${numeroEstrellas} estrellas? (Para ver la puntuacion media actualizada, por favor, selecciona de nuevo la rutina)`,
      [
        {
          text: 'Aceptar', onPress: async () => {
            if (!token || !rutina) {
              return; // No realizar la llamada a la API si no hay un token de autenticación o si rutina es undefined
            }
            try {
              const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                }
              };
              const response = await routineApi.post<ContenidoRutinas>(`/rutinas/puntuarRutina/${rutina.id}?puntuacion=${numeroEstrellas}`, config);
              
            } catch (error) {
              console.log('Error al puntuar la rutina:', error);
            }
          }
        },
        { text: 'Cancelar', onPress: () => { } }
      ]);
  }

  const handleCommentPress = () => {
    navigation.navigate('CommentsScreen', { rutina });
  }

  const handleEmpezarEntreno = (dia: DiaRutina) => {
    navigation.navigate('EntrenamientoScreen', { dia })
  }

  const startCountdown = (dia:DiaRutina) => {
    setshowCountdownModal(true);
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      setshowCountdownModal(false);
      handleEmpezarEntreno(dia); // Navegar a la pantalla de entrenamiento
    }, 3000);
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
      {!isFromRutinasCreadas && rutinasSeguidasIds?.includes(rutina?.id ?? 0) ? (
        <Text style={{ alignSelf: 'center', marginTop: 10, color: 'black' }}>Ya sigues esta rutina</Text>
      ) : (
        !isFromRutinasCreadas && (
          <TouchableOpacity style={styles.seguirButton} onPress={handleFollowButtonPress}>
            <Text style={styles.seguirButtonText}>Seguir rutina</Text>
          </TouchableOpacity>
        )

      )}
      {!isFromRutinasCreadas && isFromRutinasSeguidas ? (
        <TouchableOpacity onPress={handleUnfollowButtonPress} style={styles.unfollowButton}>
          <Text style={styles.unfollowButtonText}>Dejar de seguir</Text>
        </TouchableOpacity>
      ) : null}

      <Text style={styles.title}>{rutina?.nombre}</Text>
      <View style={{marginBottom:10}}>
        <Text style={styles.rutinaField}>Descripción: {rutina?.descripcion}</Text>
        <Text style={styles.rutinaField}>Creada por: {rutina?.creador}</Text>
        <Text style={styles.rutinaField}>Puntuación media: {rutina?.puntuacion.toFixed(1)}</Text>
      </View>
      <TouchableOpacity
        style={styles.commentButton}
        onPress={handleCommentPress}
      >
        <Icon name='chatbubble-ellipses-outline' size={50} color={'#5856D6'} />
      </TouchableOpacity>

      {isFromRutinasSeguidas ? (
        <View style={styles.puntuacionContainer}>
          {[1, 2, 3, 4, 5].map((numeroEstrellas) => (
            <TouchableOpacity
              key={numeroEstrellas}
              onPress={() => handlePuntuacion(numeroEstrellas)}
              style={styles.estrella}
            >
              <Icon
                name={numeroEstrellas <= puntuacion ? 'star' : 'star-outline'}
                size={25}
                color={numeroEstrellas <= puntuacion ? '#5856D6' : 'grey'}
              />
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
      {isFromRutinasCreadas ? (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <TouchableOpacity style={styles.seguirButton} onPress={handleEditarRutina}>
              <Text style={styles.seguirButtonText}>Editar rutina</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.unfollowButton} onPress={handleEliminarRutina}>
              <Text style={styles.seguirButtonText}>Eliminar rutina</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ color: 'black' }}>Añadir nuevo día a la rutina</Text>

          <TouchableOpacity style={styles.añadirDiaRutinaButton} onPress={handleAddDiarutina}>
            <Icon name="add-outline" color='white' size={20} />
          </TouchableOpacity>

        </View>

      ) : null}

      <FlatList
        data={rutina?.dias_rutina}
        keyExtractor={(dia: DiaRutina) => dia.id.toString()}
        showsVerticalScrollIndicator={false}
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
    color: 'black'
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
    backgroundColor: '#EDEDED'
  },
  rutinaField: {
    color: 'black',
    fontSize: 13,
    marginTop: 10,
    alignSelf: 'center'
  },
  diasRutinaList: {
    paddingBottom: 15,
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
    height: 50,
    width: 100,
    backgroundColor: '#5856D6',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    elevation: 10,
    marginBottom: 10,
  },
  addEjercicioButton: {
    backgroundColor: '#5856D6',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginTop: 4,
  },
  addEjercicioButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  deleteDiaRutinaButton: {
    height: 50,
    width: 80,
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 2,
    marginLeft: 10,
  },
  deleteEjercicioButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: 'center',
    top: 20,
    zIndex: 10,
  },
  puntuacionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom:10,
  },
  estrella: {
    marginHorizontal: 5,
  },
  commentButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 100,
    width: 80,
    height: 80,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 21,
  },
  empezarEntrenoButton: {
    backgroundColor: 'green',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginTop: 10,
  },
  empezarEntrenoButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',

  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  countdownText: {
    fontSize: 48,
    color: 'white',
  },
});