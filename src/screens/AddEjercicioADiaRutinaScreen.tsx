import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ContenidoRutinas, DiaRutina, Ejercicio, GetEjerciciosResponse } from '../interfaces/appInterfaces';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import routineApi from '../api/routineApi';

import { TarjetaEjercicio } from '../components/TarjetaEjercicio';
import Icon from 'react-native-vector-icons/Ionicons';


type AddEjercicioADiaRutinaScreenProps = {
    route: RouteProp<{ params: { dia: DiaRutina, rutina: ContenidoRutinas } }, 'params'>;
};

type EjercicioData = {
    id: number;
    series: string;
    repeticiones: string;
};

export const AddEjercicioADiaRutinaScreen = ({ route }: AddEjercicioADiaRutinaScreenProps) => {
    const { dia, rutina } = route.params;
    const { token } = useContext(AuthContext);
    const navigation = useNavigation<any>();
    const pageSize = 10;
    const [isCheckedMap, setIsCheckedMap] = useState<{ [key: number]: boolean }>({});
    const [isAddButtonVisible, setIsAddButtonVisible] = useState(false);
    const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>([]);
    const [isFromAddEjercicioADiaRutina, setIsFromAddEjercicioADiaRutina] = useState(false);
    const [newEjercicioData, setNewEjercicioData] = useState<EjercicioData>({
        id: 0,
        series: "",
        repeticiones: "",
    });
    const [ejerciciosMarcados, setEjerciciosMarcados] = useState<EjercicioData[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [ejercicios, setEjercicios] = useState<GetEjerciciosResponse>({
        contenido: [],
        numPagina: 0,
        tamPagina: 0,
        totalElementos: 0,
        totalPaginas: 0,
        ultima: false,
    });
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [nombreEjercicio, setNombreEjercicio] = useState('');
    const [page, setPage] = useState(0);

    const handleCheckboxToggle = (id: number) => {
        const isChecked = isCheckedMap[id];

        setIsCheckedMap((prevMap) => ({
            ...prevMap,
            [id]: !isChecked,
        }));

        setSelectedExerciseIds((prevIds) => {
            if (!isChecked) {
                return [...prevIds, id];
            } else {
                return prevIds.filter((exerciseId) => exerciseId !== id);
            }
        });

        if (!isChecked) {
            setNewEjercicioData((prevData) => ({
                ...prevData,
                id: id,
            }));
            setModalVisible(true);
        } else {
            setEjerciciosMarcados((prevEjercicios) =>
                prevEjercicios.filter((ejercicio) => ejercicio.id !== id)
            );
            setModalVisible(false);
        }
    };

    useEffect(() => {
        const tieneEjercicios = Object.values(isCheckedMap).some((value) => value);
        setIsAddButtonVisible(tieneEjercicios);
    }, [isCheckedMap]);

    const fetchData = async (reset: boolean = true) => {
        if (!token) {
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await routineApi.get('/ejercicios/filtrarKeyword', {
                ...config,
                params: {
                    keyword: nombreEjercicio,
                    pageNo: reset ? 0 : page,
                    pageSize: pageSize,
                    sortBy: 'id',
                    sortDir: 'asc',
                },
            });

            const ejerciciosAdmin = response.data.contenido.filter((ejercicio: Ejercicio) => ejercicio.username_creador === 'admin' || 'admin@admin.com');
            setEjercicios((prevEjercicios) => ({
                contenido: reset ? ejerciciosAdmin : [...prevEjercicios.contenido, ...ejerciciosAdmin],
                numPagina: response.data.numPagina,
                tamPagina: response.data.tamPagina,
                totalElementos: response.data.totalElementos,
                totalPaginas: response.data.totalPaginas,
                ultima: response.data.ultima,
            }));
            setPage((prevPage) => reset ? 1 : prevPage + 1);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEndReached = () => {
        if (!loading && !loadingMore && !ejercicios.ultima) {
            setLoadingMore(true);
            fetchData(false);
        }
    };

    const handleSearch = () => {
        setLoading(true);
        setPage(0);
        fetchData(true);
    };

    const refreshEjercicios = async () => {
        await fetchData(true);
    };

    const handleAceptEjercicios = () => {
        if (newEjercicioData.series && newEjercicioData.repeticiones) {
            const nuevoEjercicio: EjercicioData = {
                id: newEjercicioData.id,
                series: newEjercicioData.series,
                repeticiones: newEjercicioData.repeticiones,
            };

            setEjerciciosMarcados((prevEjercicios) => [...prevEjercicios, nuevoEjercicio]);

            setNewEjercicioData({
                id: 0,
                series: "",
                repeticiones: "",
            });
            setModalVisible(false);
        } else {
            console.log("Completa los campos de series y repeticiones");
            Alert.alert('Error', 'Faltan los campos series y/o repeticiones', [{ text: 'Aceptar', onPress: () => { } }]);
        }
    };

    const handleAnadirEjercicios = async (rutina: ContenidoRutinas) => {
        const data = ejerciciosMarcados.map((ejercicio) => ({
            repeticiones: ejercicio.repeticiones,
            series: ejercicio.series,
            ejercicioId: ejercicio.id,
        }));

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await routineApi.post(`/diasrutina/${dia.id}/addListEjercicios`, data, config);
            setIsFromAddEjercicioADiaRutina(true);
            await new Promise((resolve) => {
                Alert.alert('Éxito', 'Los ejercicios se han añadido correctamente', [{ text: 'Aceptar', onPress: resolve }]);
            });
            const response2 = await routineApi.get<ContenidoRutinas>(`/rutinas/${rutina.id}`, config);
            navigation.navigate('RutinaDetailsScreen', { rutina: response2.data, isFromRutinasCreadas: true });

            console.log(response.data);
        } catch (error) {

            console.error(error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#EDEDED' }}>
            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={{ color: 'black', textAlign: 'center' }}>
                            Indica cuantas series y repeticiones se harán en este ejercicio
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Series"
                            placeholderTextColor="grey"
                            value={newEjercicioData.series}
                            onChangeText={(text) =>
                                setNewEjercicioData((prevData) => ({
                                    ...prevData,
                                    series: text,
                                }))
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Repeticiones"
                            placeholderTextColor="grey"
                            value={newEjercicioData.repeticiones}
                            onChangeText={(text) =>
                                setNewEjercicioData((prevData) => ({
                                    ...prevData,
                                    repeticiones: text,
                                }))
                            }
                        />
                        <TouchableOpacity onPress={handleAceptEjercicios} style={styles.acceptButton}>
                            <Text style={{ color: 'black', textAlign: 'center' }}>Aceptar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
            >
                <Icon name="arrow-back-outline" size={25} color="#5856D6" />
                <Text style={{ ...styles.buttonTextVolver, fontSize: 20 }}>Volver</Text>
            </TouchableOpacity>
            <View style={{ flex: 1, marginHorizontal: 12, marginTop: 10 }}>
                <Text style={{ color: 'grey' }}>Busca un ejercicio por nombre o selecciona un grupo muscular para filtrar</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        placeholder="Ej: press banca"
                        placeholderTextColor='grey'
                        selectionColor='blue'
                        onChangeText={setNombreEjercicio}
                        onSubmitEditing={handleSearch}
                        style={{ flex: 1, backgroundColor: 'white', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, color: 'black', marginBottom: 5 }}
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                        <Icon name="search-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    style={{ flex: 1 }}
                    data={ejercicios.contenido}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: isCheckedMap[item.id] ? '#A2FFA8' : '#CCCCCC',
                                    width: 60,
                                    height: 60,
                                    borderRadius: 100,
                                    marginRight: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={() => handleCheckboxToggle(item.id)}
                            >
                                <Icon
                                    name={isCheckedMap[item.id] ? 'checkmark-outline' : 'add-outline'}
                                    size={30}
                                    color={'black'}
                                />
                            </TouchableOpacity>
                            <View style={{ flex: 1 }}>
                                <TarjetaEjercicio
                                    ejercicio={item}
                                    width={'100%'}
                                    height={120}
                                    editable={false}
                                    onDelete={refreshEjercicios}
                                />
                            </View>
                        </View>
                    )}
                    ListFooterComponent={
                        loadingMore ? (
                            <ActivityIndicator size="large" animating={loadingMore} color="blue" />
                        ) : null
                    }
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.5}
                    windowSize={3}
                    showsVerticalScrollIndicator={false}
                />
                {isAddButtonVisible && (
                    <View style={styles.addButtonContainer}>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => handleAnadirEjercicios(rutina)}
                        >
                            <Text style={styles.buttonText}>Añadir ejercicios</Text>
                        </TouchableOpacity>
                    </View>


                )}
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    searchButton: {
        backgroundColor: 'rgba(88,86,214,0.5)',
        height: 49,
        width: 50,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5
    },
    addButton: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        width: 200,
        height: 100,
        backgroundColor: '#A2FFA8',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginBottom: 25,
    },
    addButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center',
        color: 'black'
    },
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
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    acceptButton: {
        height: 40,
        width: 100,
        backgroundColor: '#A2FFA8',
        borderRadius: 20,
        justifyContent: 'center',
        marginTop: 10,
    },
    input: {
        color: 'black',
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        width: 150,
        marginBottom: 5,
        marginTop: 5,
    }, button: {
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
      buttonTextVolver: {
        color: '#5856D6',
        textAlign: 'center',
      },
});
