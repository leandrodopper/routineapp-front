import React, { useContext, useEffect, useState } from 'react'
import { Alert, Dimensions, FlatList, Modal, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { DiaRutina, Ejercicio, EjercicioDiaRutina, EjerciciosRealizado, PostEntreno, SeriesRealizada } from '../interfaces/appInterfaces';
import { RouteProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import routineApi from '../api/routineApi';
import { TarjetaEjercicio } from '../components/TarjetaEjercicio';
import { AuthContext } from '../context/AuthContext';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { ScrollView } from 'react-native-gesture-handler';

type EntrenamientoScreenProps = {
    route: RouteProp<{ params: { dia: DiaRutina } }, 'params'>;
};

type RPEColors = {
    [key: number]: string;
};

type RPEDescriptions = {
    [key: number]: string;
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


export const EntrenamientoScreen = ({ route }: EntrenamientoScreenProps) => {

    const { dia } = route.params;
    const { token, user } = useContext(AuthContext);
    const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
    const { ejerciciosDiaRutina } = dia;
    const navigation = useNavigation<any>();
    const allExerciseIds = ejerciciosDiaRutina.map(exercise => exercise.ejercicioId);
    const [exerciseDetails, setExerciseDetails] = useState<Ejercicio[]>([]);
    const [showModal, setShowModal] = useState(false);

    const [esfuerzoPorEjercicio, setEsfuerzoPorEjercicio] = useState<{ [key: number]: number | null }>({});

    const [pesos, setPesos] = useState<string[][]>(
        Array(ejerciciosDiaRutina.length).fill([]).map(() => Array(0).fill(''))
    );
    const [isPressed, setIsPressed] = useState<number[][]>(
        Array(ejerciciosDiaRutina.length).fill([]).map(() => Array(0).fill(0))
    );
    const [repeticiones, setRepeticiones] = useState<number[][]>(
        Array(ejerciciosDiaRutina.length)
            .fill([])
            .map(() => Array(0).fill(0))
    );
    const [showRPEScreen, setShowRPEScreen] = useState(false);

    const rpeColors: RPEColors = {
        0: '#99CCFF', // Azul claro
        1: '#99CCFF', // Azul claro
        2: '#99CCFF', // Azul claro
        3: '#66FF66', // Verde claro
        4: '#66FF66', // Verde claro
        5: 'yellow', // Amarillo
        6: 'yellow', // Amarillo
        7: 'orange', // Naranja claro
        8: 'orange', // Naranja claro
        9: 'red', // Rojo claro
        10: 'red', // Rojo claro
    };

    const rpeDescriptions: RPEDescriptions = {
        0: 'Reposo',
        1: 'Muy Muy Ligero',
        2: 'Muy Ligero',
        3: 'Ligero',
        4: 'Moderado',
        5: 'Difícil',
        6: 'Muy Difícil',
        7: 'Extremadamente Difícil',
        8: 'Casi Máximo',
        9: 'Máximo',
        10: 'Muy Máximo',
    };

    const [totalSeriesCompletadas, setTotalSeriesCompletadas] = useState(0);
    const [totalRepeticionesCompletadas, setTotalRepeticionesCompletadas] = useState(0);
    const [totalPesoLevantado, setTotalPesoLevantado] = useState(0);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);

    const [chartData, setChartData] = useState([
        { name: 'Series completadas', value: 0, color: '#66FF66' },
        { name: 'No completadas', value: 0, color: 'red' },
    ]);

    const totalEjercicios = ejerciciosDiaRutina.length;
    const totalRPE = Object.values(esfuerzoPorEjercicio)
        .map(rpe => typeof rpe === 'number' ? rpe : 0) // Convierte valores no numéricos en 0
        .reduce((total, rpe) => total + rpe, 0);
    const rpePromedio = totalEjercicios !== 0 ? totalRPE / totalEjercicios : 0;




    const handleWeightChange = (exerciseIndex: number, serieIndex: number, weight: string) => {
        const weightValue = weight.replace(',', '.');
        if (weightValue !== '') {
            const newPesos = [...pesos];
            newPesos[exerciseIndex][serieIndex] = weightValue;
            setPesos(newPesos);
        } else {
            Alert.alert('Valor inválido', 'El peso no puede ser negativo.');
            const newPesos = [...pesos];
            newPesos[exerciseIndex][serieIndex] = ''; // Limpiar el contenido del TextInput
            setPesos(newPesos);
        }
    };

    const handleRepeticionesChange = (exerciseIndex: number, serieIndex: number, repeticionesValue: number) => {
        if (repeticionesValue >= 0 && Number.isInteger(repeticionesValue)) {
            const newRepeticiones = [...repeticiones];
            newRepeticiones[exerciseIndex][serieIndex] = repeticionesValue;
            setRepeticiones(newRepeticiones);
        } else {
            Alert.alert('Valor inválido', 'Las repeticiones deben ser un número entero no negativo.');
        }
    };

    const handleButtonPress = (exerciseIndex: number, serieIndex: number, isCumplido: boolean) => {
        const newIsPressed = [...isPressed];
        newIsPressed[exerciseIndex][serieIndex] = isCumplido ? 1 : -1;
        setIsPressed(newIsPressed);
    };

    useEffect(() => {
        const fetchExerciseDetails = async () => {
            const exercisePromises = allExerciseIds.map(async exerciseId => {
                if (!token) {
                    return;
                }
                try {
                    const response = await routineApi.get<Ejercicio>(`/ejercicios/${exerciseId}`);
                    return response.data;
                } catch (error) {
                    console.error(error);
                    return null;
                }
            });

            const resolvedExerciseDetails = await Promise.all(exercisePromises);
            const filteredDetails = resolvedExerciseDetails.filter(detail => detail !== null) as Ejercicio[];
            setExerciseDetails(filteredDetails);
        };

        fetchExerciseDetails();
    }, []);

    const [timeElapsed, setTimeElapsed] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeElapsed(prevTime => prevTime + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };



    const handleFinalizarEntreno = () => {

        const ejerciciosRealizados: EjerciciosRealizado[] = ejerciciosDiaRutina.map((ejercicio, exerciseIndex) => {
            const seriesRealizadas: SeriesRealizada[] = [];

            for (let serieIndex = 0; serieIndex < ejercicio.series; serieIndex++) {
                const repeticionesRealizadas = repeticiones[exerciseIndex][serieIndex] || 0;
                const pesoUtilizado = pesos[exerciseIndex][serieIndex] ? parseFloat(pesos[exerciseIndex][serieIndex]) : 0;
                const objetivoCumplido = isPressed[exerciseIndex][serieIndex] === 1;
                const objetivoNoCumplido = isPressed[exerciseIndex][serieIndex] === -1;

                const esSerieCompleta = (repeticionesRealizadas > 0 && pesoUtilizado > 0) && (objetivoCumplido || objetivoNoCumplido);

                if (esSerieCompleta) {
                    seriesRealizadas.push({
                        numeroSerie: serieIndex + 1,
                        repeticionesRealizadas,
                        objetivoCumplido: objetivoCumplido,
                        pesoUtilizado,
                    });
                }
            }

            return {
                ejercicioId: ejercicio.ejercicioId,
                nivelEsfuerzoPercibido: esfuerzoPorEjercicio[exerciseIndex] !== null ? esfuerzoPorEjercicio[exerciseIndex] : 0,
                seriesRealizadas,
            };
        }).filter(ejercicioRealizado => ejercicioRealizado.seriesRealizadas.length > 0);

        const postEntrenoData: PostEntreno = {
            diaRutinaId: dia.id,
            duracionMinutos: Math.floor(timeElapsed / 60),
            ejerciciosRealizados: ejerciciosRealizados,
        };
        ejerciciosRealizados.forEach((ejercicioRealizado) => {
            ejercicioRealizado.seriesRealizadas.forEach((serieRealizada) => {
                if (serieRealizada.objetivoCumplido) {
                    // Actualizar las variables de estado directamente
                    setTotalSeriesCompletadas(prevTotal => prevTotal + 1);
                    setTotalRepeticionesCompletadas(prevTotal => prevTotal + serieRealizada.repeticionesRealizadas);
                    setTotalPesoLevantado(prevTotal => prevTotal + serieRealizada.pesoUtilizado);
                }
            });
        });
        setTotalTimeElapsed(timeElapsed);
        handleAddEntreno(postEntrenoData);

        const totalSeries = ejerciciosRealizados.reduce(
            (total, ejercicioRealizado) =>
                total + ejercicioRealizado.seriesRealizadas.length,
            0
        );

        const totalSeriesCompletadas = ejerciciosRealizados.reduce(
            (total, ejercicioRealizado) =>
                total +
                ejercicioRealizado.seriesRealizadas.filter(
                    serieRealizada => serieRealizada.objetivoCumplido
                ).length,
            0
        );

        const totalSeriesNoCompletadas = totalSeries - totalSeriesCompletadas;

        const chartData = [
            { name: 'Series completadas', value: totalSeriesCompletadas, color: '#00CC00', legendFontSize: 10, legendFontColor: "#7F7F7F" },
            { name: 'No completadas', value: totalSeriesNoCompletadas, color: 'red', legendFontSize: 10, legendFontColor: "#7F7F7F" },
        ];

        setChartData(chartData);

    };

    const handleAddEntreno = async (postEntrenoData: PostEntreno) => {
        if (!token) {
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await routineApi.post('/entrenos', postEntrenoData, config);

            if (response.status === 201) {
                // Mostrar el modal
                setShowModal(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        navigation.goBack();
        ToastAndroid.show('Entrenamiento finalizado. Los datos válidos han sido registrados', ToastAndroid.SHORT);
    };

    const handlePuntuarRPE = (exerciseIndex: number, puntuacionRPE: number) => {
        const updatedEsfuerzo = { ...esfuerzoPorEjercicio };
        updatedEsfuerzo[exerciseIndex] = puntuacionRPE;
        setEsfuerzoPorEjercicio(updatedEsfuerzo);
    };


    return (
        <ScrollView style={styles.container}>
            <View style={styles.timerContainer}>
                <Text style={styles.timerText}>En curso: {formatTime(timeElapsed)}</Text>
            </View>
            <Text style={styles.instructionsText}>
                Puedes deslizarte hacia la izquierda o derecha entre la lista de ejercicios. Para ver en detalle el ejercicio, puedes pulsar en la tarjeta de abajo
            </Text>
            <Text style={styles.ejercicioTitle}>
                {dia.nombre}
            </Text>
            <FlatList
                horizontal
                pagingEnabled
                data={ejerciciosDiaRutina}
                keyExtractor={(item: EjercicioDiaRutina) => item.id_EjercicioRutina.toString()}
                renderItem={({ item, index }: { item: EjercicioDiaRutina; index: number }) => {
                    const exerciseId = item.ejercicioId;
                    const exerciseDetail = exerciseDetails.find(detail => detail.id === exerciseId);

                    return (
                        <View style={styles.ejercicioContainer}>
                            {exerciseDetail && <TarjetaEjercicio ejercicio={exerciseDetail} onDelete={() => { }} series={item.series} repeticiones={item.repeticiones} />}
                            {Array(item.series)
                                .fill(0)
                                .map((_, serieIndex) => (
                                    <View style={styles.serieContainer} key={serieIndex.toString()}>
                                        <Text style={styles.serieText}>Serie {serieIndex + 1}</Text>
                                        <TextInput
                                            style={styles.repeticionesInput}
                                            keyboardType="decimal-pad"
                                            placeholder="Peso"
                                            value={
                                                pesos[index] &&
                                                pesos[index][serieIndex]
                                            }
                                            onChangeText={(weight) =>
                                                handleWeightChange(index, serieIndex, weight)
                                            }
                                        />
                                        <TextInput
                                            style={styles.repeticionesInput}
                                            keyboardType="numeric"
                                            placeholder="Reps"
                                            value={
                                                repeticiones[index] &&
                                                    repeticiones[index][serieIndex] !== undefined
                                                    ? repeticiones[index][serieIndex].toString()
                                                    : ''
                                            }
                                            onChangeText={(repeticionesValue) =>
                                                handleRepeticionesChange(
                                                    index,
                                                    serieIndex,
                                                    repeticionesValue ? Number(repeticionesValue) : 0
                                                )
                                            }
                                        />
                                        <TouchableOpacity
                                            style={[
                                                styles.buttonCumplido,
                                                isPressed[index][serieIndex] === 1 && styles.buttonCumplidoPressed,
                                            ]}
                                            onPress={() => handleButtonPress(index, serieIndex, true)}
                                        >
                                            <Icon name="checkmark-outline" size={20} color="black" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                styles.buttonNoCumplido,
                                                isPressed[index][serieIndex] === -1 && styles.buttonNoCumplidoPressed,
                                            ]}
                                            onPress={() => handleButtonPress(index, serieIndex, false)}
                                        >
                                            <Icon name="close-outline" size={20} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            <Text style={styles.esfuerzoUserText}>
                                Nivel de esfuerzo percibido: {esfuerzoPorEjercicio[index] !== undefined ? esfuerzoPorEjercicio[index] : 'No establecido'}
                            </Text>
                            <TouchableOpacity
                                style={styles.RPEButton}
                                onPress={() => {
                                    const exerciseIndex = index;
                                    setShowRPEScreen(true);
                                    setCurrentExerciseIndex(exerciseIndex);
                                }}
                            >
                                <Text style={styles.RPEButtonText}>Puntuar RPE</Text>
                            </TouchableOpacity>
                        </View>
                    );
                }}
                style={{ width: screenWidth }}
            />
            <TouchableOpacity
                style={styles.finalizarButton}
                onPress={handleFinalizarEntreno}
            >
                <Text style={styles.finalizarButtonText}>
                    Finalizar entrenamiento
                </Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Estadísticas del entrenamiento:</Text>
                        <Text>Tiempo total de entrenamiento: {formatTime(totalTimeElapsed)}</Text>
                        <Text>Total de repeticiones completadas: {totalRepeticionesCompletadas}</Text>
                        <Text>Total de peso levantado: {totalPesoLevantado}</Text>
                        <Text>Total de series completadas: {totalSeriesCompletadas}</Text>
                        <View style={{ marginBottom: 20 }}>
                            <PieChart
                                data={chartData}
                                width={300} // Aumenta el ancho
                                height={150} // Aumenta la altura
                                accessor="value"
                                backgroundColor="transparent"
                                chartConfig={{
                                    color: (opacity = 1) => `rgba(102, 255, 102, ${opacity})`,
                                }}
                                paddingLeft='-10' // Asegura un poco de espacio a la izquierda para el texto
                            />
                            <Text>Esfuerzo RPE promedio: {rpePromedio.toFixed(2)}</Text>

                        </View>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleCloseModal}
                        >
                            <Text style={{ color: 'white', alignSelf: 'center' }}>Finalizar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showRPEScreen}
                onRequestClose={() => setShowRPEScreen(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Selecciona el nivel de esfuerzo RPE:</Text>

                        <View style={styles.rpeColorsContainer}>
                            {Object.keys(rpeColors).map((rpeValue) => (
                                <TouchableOpacity
                                    key={rpeValue}
                                    style={styles.rpeButton}
                                    onPress={() => {
                                        if (currentExerciseIndex !== null) {
                                            handlePuntuarRPE(currentExerciseIndex, parseInt(rpeValue));
                                            setShowRPEScreen(false); // Opcionalmente, cerrar el modal aquí
                                        }
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.rpeColorSquare,
                                            { backgroundColor: rpeColors[Number(rpeValue)] },
                                        ]}
                                    >
                                        <Text style={styles.rpeColorText}>{rpeValue}</Text>
                                    </View>
                                    <Text style={styles.rpeDescriptionText}>{rpeDescriptions[Number(rpeValue)]}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowRPEScreen(false)}
                        >
                            <Text style={styles.RPEButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    ejercicioContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        width: screenWidth, // Asegura que cada página tenga el ancho de la pantalla
    },
    ejercicioTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        marginTop: 10,
    },
    serieContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    serieText: {
        fontSize: 16,
        marginRight: 10,
    },
    repeticionesInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        width: 100,
        borderRadius: 20,
        marginRight: 5,
    },
    buttonCumplido: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 10,
        backgroundColor: 'gray',
        borderRadius: 4,
        marginLeft: 10,
    },
    buttonNoCumplido: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 10,
        backgroundColor: 'gray',
        borderRadius: 4,
    },
    buttonCumplidoPressed: {
        backgroundColor: 'green',
    },
    buttonNoCumplidoPressed: {
        backgroundColor: 'red',
    },
    timerContainer: {
        position: 'absolute',
        top: 20,
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 10,
        padding: 5,
    },
    timerText: {
        color: 'white',
        fontSize: 18,
    },
    instructionsText: {
        marginTop: 100,
        color: '#666',
        textAlign: 'center',
    },
    finalizarButton: {
        height: 100,
        width: 200,
        backgroundColor: '#5856D6',
        borderRadius: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 50,
        marginTop: 20
    },
    finalizarButtonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#5856D6',
        borderRadius: 5,
        width: 75,
        alignSelf: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    RPEButton: {
        height: 50,
        width: 100,
        backgroundColor: '#5856D6',
        borderRadius: 15,
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 50,
        marginTop: 20
    },
    RPEButtonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 15,

    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    rpeColorsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20,
    },
    rpeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    rpeColorSquare: {
        width: 30,
        height: 30,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    rpeColorText: {
        color: 'black',
        fontSize: 14,
        fontWeight: 'bold',
    },
    rpeDescriptionText: {
        flex: 1,
        fontSize: 14,
    },
    esfuerzoUserText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },

});