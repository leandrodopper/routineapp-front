import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { Ejercicio } from '../interfaces/appInterfaces';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Image, Modal, StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Buffer } from 'buffer';
import FastImage from 'react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import routineApi from '../api/routineApi';

interface Props {
  ejercicio: Ejercicio;
  height?: number | string;
  width?: number | string;
  editable?: boolean;
  onDelete: () => void;
  series?: number;
  repeticiones?: number;
}

export const TarjetaEjercicio = memo(({ ejercicio, height = 420, width = 300, editable = false, onDelete, series, repeticiones }: Props) => {
  const navigation = useNavigation<any>();
  const { token } = useContext(AuthContext);

  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEjercicio, setSelectedEjercicio] = useState<Ejercicio | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoadingThumbnail, setIsLoadingThumbnail] = useState(false);

  const getThumbnail = useCallback(async () => {
    setIsLoadingThumbnail(true);
    if (!token || !ejercicio) {
      return; // No realizar la llamada a la API si no hay un token de autenticación
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`http://192.168.1.38:8080/miniaturas/${ejercicio.imagen}`, {
        responseType: 'arraybuffer',
        ...config,
      });
      const thumbnailUrl = `data:image/gif;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
      setThumbnailUrl(thumbnailUrl);
    } catch (error) {
      console.error(error);
    }
  }, [ejercicio, token]);

  useEffect(() => {
    getThumbnail()
      .then(() => {
        setIsLoadingThumbnail(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoadingThumbnail(false);
      });
  }, [getThumbnail]);

  useEffect(() => {
    if (!token) {
      return; // No realizar la llamada a la API si no hay un token de autenticación
    }
    if (modalVisible && selectedEjercicio) {
      const fetchGifUrl = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.get(`http://192.168.1.38:8080/gifs/${selectedEjercicio?.imagen}`, {
            responseType: 'arraybuffer',
            ...config,
          });
          const gifUrl = `data:image/gif;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
          setGifUrl(gifUrl);
        } catch (error) {
          console.error(error);
        }
      };

      fetchGifUrl();
    }
  }, [modalVisible, selectedEjercicio, token]);

  const handleEdit = (ejercicio: Ejercicio) => {
    setModalVisible(false);
    navigation.navigate('EditEjercicio' as never, { ejercicio } as never);
  };

  const handleDelete = async (ejercicio: Ejercicio) => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas borrar este ejercicio?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            try {
              const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };
              const response = await routineApi.delete(
                `/ejercicios/${ejercicio.id}`,
                config
              );
              closeModal();
              onDelete();
              Alert.alert('Borrado con éxito', 'El ejercicio se ha borrado con éxito');
            } catch (error) {
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEjercicio(null);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        setModalVisible(true);
        setSelectedEjercicio(ejercicio);
      }}
      style={{
        width: width,
        height: 120,
        borderRadius: 20,
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        elevation: 3,
      }}
    >
      <View style={{ flex: 1, flexDirection: 'row', height: height, width: width, alignItems: 'center' }}>
        <View style={{ width: 80, height: 80, borderRadius: 20, marginRight: 10, marginLeft: 5 }}>
          {isLoadingThumbnail ? (
            <ActivityIndicator size="small" color="#5856D6" style={{alignSelf:'center'}}/> // Mostrar el ActivityIndicator mientras se carga la miniatura
          ) : (
            thumbnailUrl && (
              <Image source={{ uri: thumbnailUrl }} style={{ width: '100%', height: '100%', borderRadius: 20 }} />
            )
          )}
        </View>

        <View style={{ flex: 1, height: '90%', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}>{ejercicio?.nombre}</Text>
          <Text style={{ color: 'gray', fontSize: 12 }}>Grupo muscular: {ejercicio?.grupo_muscular}</Text>
          <Text style={{ color: 'gray', fontSize: 12 }}>Dificultad: {ejercicio?.dificultad}</Text>
          {series && repeticiones && (
            <>
              <Text style={{ color: 'gray', fontSize: 12 }}>Series: {series}</Text>
              <Text style={{ color: 'gray', fontSize: 12, marginBottom: 6 }}>Repeticiones: {repeticiones}</Text>
            </>
          )}
        </View>
      </View>
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}

      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {editable && (
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(ejercicio)}>
                  <Icon name="pencil-outline" size={24} color="white" />
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(ejercicio)}>
                  <Icon name="trash-outline" size={24} color="white" />
                  <Text style={styles.editButtonText}>Borrar</Text>
                </TouchableOpacity>
              </View>
            )}
            {/* Contenido del modal */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ alignItems: 'center', marginTop: 10 }}>
                {gifUrl ? (
                  <FastImage
                    source={{ uri: gifUrl }}
                    resizeMode={FastImage.resizeMode.contain}
                    style={{ width: 300, aspectRatio: 1 }}
                  />
                ) : (
                  <View style={{ width: 300, height: 300, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="blue" />
                  </View>
                )}
              </View>

              <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>{selectedEjercicio?.nombre}</Text>
                <Text style={{ fontSize: 13, color: 'black', fontWeight: '200', marginBottom: 10 }}>{selectedEjercicio?.descripcion}</Text>
                <Text style={{ fontSize: 13, color: 'black', marginBottom: 10, fontWeight: '200' }}>
                  <Text style={{ fontWeight: 'bold' }}>Musculos involucrados: </Text>
                  {selectedEjercicio?.grupo_muscular}
                </Text>
                <Text style={{ fontSize: 13, color: 'black', marginBottom: 10, fontWeight: '200' }}>
                  <Text style={{ fontWeight: 'bold' }}>Dificultad: </Text>
                  {selectedEjercicio?.dificultad}
                </Text>
                <Text style={{ fontSize: 13, color: 'black', marginBottom: 10, fontWeight: '200' }}>
                  <Text style={{ fontWeight: 'bold' }}>usuario: </Text>
                  {selectedEjercicio?.username_creador}
                </Text>

              </View>
            </ScrollView>

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    height: '90%'
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: '#5856D6',
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  editButton: {
    alignSelf: 'flex-start',
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: '#5856D6',
    borderRadius: 20,
    marginRight: 60,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    alignSelf: 'flex-start',
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: 'red',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
});