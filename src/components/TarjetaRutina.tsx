import React, { memo, useContext, useState } from 'react';
import { ContenidoRutinas, Rutina } from '../interfaces/appInterfaces';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, View, Text, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { RutinasContext } from '../context/RutinasContext';
import Icon from 'react-native-vector-icons/Ionicons';
import routineApi from '../api/routineApi';

interface Props {
    rutina: ContenidoRutinas;
    isFromRutinasSeguidas?: boolean;
    isFromRutinasCreadas?: boolean;
}

export const TarjetaRutina = memo(({ rutina, isFromRutinasSeguidas, isFromRutinasCreadas }: Props) => {
    const navigation = useNavigation<any>();
    const { token } = useContext(AuthContext);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const rutinasContext = useContext(RutinasContext);
    const { rutinasSeguidasIds, setRutinasSeguidasIds, actualizarRutinas, setActualizarRutinas } = rutinasContext;
    const isRutinaSeguida = rutinasSeguidasIds.includes(rutina.id);


    const handleRutinaDetails = () => {
        navigation.navigate('RutinaDetailsScreen', { rutina, rutinasSeguidasIds, isFromRutinasSeguidas, isFromRutinasCreadas });
    };

    const handleFollowButtonPress = async () => {
        if (!token) {
            return; // No realizar la llamada a la API si no hay un token de autenticación
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await routineApi.post(`/rutinas/seguir/${rutina.id}`, config);
            setRutinasSeguidasIds([...rutinasSeguidasIds, rutina.id]);
            setActualizarRutinas(true);
            setActualizarRutinas(false);
            setIsModalVisible(false);
        }
        catch (error) {
            console.log('Error al seguir la rutina:', error);
        };
    };

    const handleLongPress = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleEditarPress = () => {
        navigation.navigate('EditRutinaScreen', { rutina });
    };




    const handleUnfollowButtonPress = async () => {
        if (!token) {
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await routineApi.delete(`/rutinas/dejarseguir/${rutina.id}`, config);
            setRutinasSeguidasIds(prevIds => prevIds.filter(id => id !== rutina.id));
            setIsModalVisible(false);
            setActualizarRutinas(true);
            setActualizarRutinas(false);
        } catch (error) {
            console.log('Error al dejar de seguir la rutina:', error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity
                style={styles.tarjetaRutinaContainer}
                onPress={handleRutinaDetails}
                onLongPress={handleLongPress}
            >
                <Text style={{ ...styles.tarjetaText, fontWeight: 'bold' }}>{rutina.nombre}</Text>
                <Text style={styles.tarjetaText}>{rutina.descripcion}</Text>
                <Text style={styles.tarjetaText}>Creada por: {rutina.creador}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name='star' size={12} color='#5856D6' style={{ alignSelf: 'center' }} />
                    <Text style={{ ...styles.tarjetaText }}>Puntuación: {rutina.puntuacion.toFixed(1)}</Text>
                </View>

            </TouchableOpacity>

            <Modal visible={isModalVisible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={handleCloseModal}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalText}>{rutina.nombre}</Text>

                                {isFromRutinasCreadas ? (
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity style={styles.seguirButton} onPress={handleEditarPress}>
                                            <Text style={styles.cerrarButtonText}>Editar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.cerrarButton} onPress={handleCloseModal}>
                                            <Text style={styles.cerrarButtonText}>Cerrar</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    // Mostrar el bloque condicional actual si isFromRutinasCreadas es false
                                    <>
                                        {isRutinaSeguida ? (
                                            <>
                                                <Text style={styles.modalText}>Ya sigues esta rutina</Text>
                                                <View style={styles.buttonContainer}>
                                                    <TouchableOpacity style={styles.cerrarButton} onPress={handleCloseModal}>
                                                        <Text style={styles.cerrarButtonText}>Cerrar</Text>
                                                    </TouchableOpacity>
                                                    {isFromRutinasSeguidas ? (
                                                        <TouchableOpacity onPress={handleUnfollowButtonPress} style={styles.unfollowButton}>
                                                            <Text style={styles.unfollowButtonText}>Dejar de seguir</Text>
                                                        </TouchableOpacity>
                                                    ) : null}
                                                </View>
                                            </>
                                        ) : (
                                            <>
                                                <Text style={styles.modalText}>{rutina.descripcion}</Text>
                                                <View style={styles.buttonContainer}>
                                                    <TouchableOpacity style={styles.seguirButton} onPress={handleFollowButtonPress}>
                                                        <Text style={styles.seguirButtonText}>Seguir</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.cerrarButton} onPress={handleCloseModal}>
                                                        <Text style={styles.cerrarButtonText}>Cerrar</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        )}
                                    </>
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
});

const styles = StyleSheet.create({
    tarjetaRutinaContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        width: '100%',
        flex: 1,
        alignSelf: 'center',
        marginBottom: 5,
        marginTop: 10,
        justifyContent: 'center',
        elevation: 1,
    },
    tarjetaText: {
        color: 'black',
        textAlign: 'center',
        padding: 3,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 10,
        textAlign: 'center',
        color: 'black',
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
    cerrarButton: {
        backgroundColor: '#D60000',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignSelf: 'center',
        marginTop: 10,
    },
    cerrarButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    }, buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    unfollowButton: {
        backgroundColor: '#D60000',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignSelf: 'center',
        marginTop: 10,
        marginLeft: 20,
    },
    unfollowButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
});