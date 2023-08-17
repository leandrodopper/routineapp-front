import React, { useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import routineApi from '../api/routineApi';
import { Ejercicio, GetTiemposResponse } from '../interfaces/appInterfaces';
import { LineChart, PieChart } from 'react-native-chart-kit';

type DataEntry = [number, string, boolean];

export const EstadisticasScreen = () => {
    const { user, token } = useContext(AuthContext);

    const hasPremiumRole = user?.roles?.some(role => role.nombre === 'ROLE_PREMIUM') || false;

    const [selectedStat, setSelectedStat] = useState('progreso');
    const [nombresEjercicios, setNombresEjercicios] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState('');
    const [exerciseData, setExerciseData] = useState<Ejercicio | null>(null); // Estado para almacenar los datos del ejercicio
    const [weightData, setWeightData] = useState([]); // Estado para almacenar los datos de peso y fecha
    const [rpeData, setRpeData] = useState([]);
    const [tiempoData, setTiempoData] = useState<GetTiemposResponse>();
    const [datosMusculares, setDatosMusculares] = useState([]);
    const [segmentColors, setSegmentColors] = useState<string[]>([]);


    const generateRandomColors = (count: number) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(getRandomColor());
        }
        return colors;
    };



    useEffect(() => {
        if (selectedStat === 'progreso') {
            routineApi.get('/ejercicios/nombres')
                .then(response => {
                    setNombresEjercicios(response.data);
                })
                .catch(error => {
                    console.error('Error al obtener los nombres de ejercicios:', error);
                });
        }
    }, [selectedStat]);

    useEffect(() => {
        if (selectedExercise !== '') {
            if (!token) {
                return;
            }
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                };
                routineApi.get(`/ejercicios/buscarNombre/${selectedExercise}`)
                    .then(response => {
                        setExerciseData(response.data);
                    })
                    .catch(error => {
                        console.error('Error al obtener los datos del ejercicio:', error);
                    });
            } catch (error) {
                console.error('Error al obtener los datos del ejercicio:', error);
            }
        }
    }, [selectedExercise]);

    useEffect(() => {
        if (selectedExercise !== '' && exerciseData?.id) {
            if (!token) {
                return;
            }
            try {
                routineApi.get(`/entrenos/usuario/${user?.id}/ejercicio/${exerciseData?.id}`)
                    .then(response => {
                        setWeightData(response.data);
                    })
                    .catch(error => {
                        console.error('Error al obtener los datos del entrenamiento:', error);
                    });
            } catch (error) {
                console.error('Error al obtener los datos del entrenamiento:', error);
            }
        }
    }, [selectedExercise, exerciseData?.id, user?.id, token]);

    useEffect(() => {
        if (selectedExercise !== '' && exerciseData?.id) {
            if (!token) {
                return;
            }
            try {
                routineApi.get(`/entrenos/esfuerzos/usuario/${user?.id}/ejercicio/${exerciseData?.id}`)
                    .then(response => {
                        setRpeData(response.data);
                    })
                    .catch(error => {
                        console.error('Error al obtener los datos RPE:', error);
                    });
            } catch (error) {
                console.error('Error al obtener los datos RPE:', error);
            }
        }
    }, [selectedExercise, exerciseData?.id, user?.id, token]);

    useEffect(() => {
        if (selectedStat === "tiempo_promedio") {
            // Fetch the average time data here based on your requirements
            if (!token) {
                return;
            }
            try {
                routineApi.get<GetTiemposResponse>(`/entrenos/tiempos/usuario/${user?.id}`)
                    .then(response => {
                        setTiempoData(response.data);
                    })
                    .catch(error => {
                        console.error('Error al obtener los datos de tiempo promedio:', error);
                    });
            } catch (error) {
                console.error('Error al obtener los datos de tiempo promedio:', error);
            }
        }
    }, [selectedStat, user?.id, token]);

    useEffect(() => {
        if (selectedStat === "trabajo_musculo") {
            // Fetch the average time data here based on your requirements
            if (!token) {
                return;
            }
            try {
                routineApi.get(`/entrenos/grupos/usuario/${user?.id}`)
                    .then(response => {
                        setDatosMusculares(response.data);
                        setSegmentColors(generateRandomColors(response.data.length));
                    })
                    .catch(error => {
                        console.error('Error al obtener los datos de grupos musculares:', error);
                    });
            } catch (error) {
                console.error('Error al obtener los datos de de grupos musculares:', error);
            }
        }
    }, [selectedStat, user?.id, token]);


    const getMaxWeight = (data: DataEntry[]) => {
        const filteredData = data.filter(entry => entry[2] === true); // Filtrar por objetivo cumplido
        if (filteredData.length === 0) {
            return 'No hay registros de levantamientos cumplidos';
        }
        const maxWeight = Math.max(...filteredData.map(entry => entry[0])); // Encontrar el peso máximo
        return maxWeight;
    };

    const getMaxWeightDate = (data: DataEntry[]) => {
        const filteredData = data.filter(entry => entry[2] === true); // Filtrar por objetivo cumplido
        if (filteredData.length === 0) {
            return 'No hay registros de levantamientos cumplidos';
        }
        const maxWeight = Math.max(...filteredData.map(entry => entry[0])); // Encontrar el peso máximo
        const maxWeightEntry = filteredData.find(entry => entry[0] === maxWeight); // Encontrar la entrada correspondiente
        if (!maxWeightEntry) {
            return 'No se encontró la entrada del peso máximo';
        }
        return new Date(maxWeightEntry[1]).toLocaleDateString(); // Obtener la fecha formateada
    };

    const componentToHex = (component: number) => {
        const hex = component.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }
    const getRandomColor = () => {
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
        return `#${componentToHex(red)}${componentToHex(green)}${componentToHex(blue)}`;
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Estadísticas</Text>


            {hasPremiumRole ? (
                <>
                    <Picker
                        selectedValue={selectedStat}
                        onValueChange={(itemValue, itemIndex) => setSelectedStat(itemValue)}
                        style={styles.dropdown}
                        itemStyle={{...styles.dropdownItem, color:'black'}}
                    >
                        <Picker.Item label="Gráfica de Progreso" value="progreso" />
                        <Picker.Item label="Record Personal" value="record" />
                        <Picker.Item label="Evolución RPE" value="evolucion" />
                        <Picker.Item label="Tiempo promedio entreno" value="tiempo_promedio" />
                        <Picker.Item label="Porcentaje de trabajo por musculo" value="trabajo_musculo" />
                    </Picker>

                    {selectedStat === "progreso" && (
                        <View style={styles.exercisePickerContainer}>
                            <Text style={{ marginBottom: 5 }}>Selecciona un ejercicio para mostrar tu progreso</Text>
                            <Picker
                                selectedValue={selectedExercise}
                                onValueChange={(itemValue) => setSelectedExercise(itemValue)}
                                style={styles.fixedDropdown} // Estilo con ancho fijo
                                itemStyle={styles.dropdownItem}
                            >
                                {nombresEjercicios.map((nombre, index) => (
                                    <Picker.Item key={index} label={nombre} value={nombre} />
                                ))}
                            </Picker>
                            {selectedExercise !== '' && (
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    {weightData.length > 0 ? (

                                        <LineChart
                                            data={{
                                                labels: [],
                                                datasets: [
                                                    {
                                                        data: weightData.filter(data => data[2] === true).map(data => data[0]), // Pesos como datos en el eje Y
                                                    },
                                                ],
                                            }}
                                            width={350} // Ancho de la gráfica
                                            height={300} // Alto de la gráfica
                                            fromZero
                                            yAxisSuffix="kg" // Sufijo para los valores en el eje Y
                                            yAxisInterval={1} // Intervalo entre valores en el eje Y
                                            xLabelsOffset={5}
                                            chartConfig={{
                                                backgroundColor: '#FFFFFF',
                                                backgroundGradientFrom: '#FFFFFF',
                                                backgroundGradientTo: '#FFFFFF',
                                                decimalPlaces: 1, // Cantidad de decimales en los valores de la gráfica
                                                color: (opacity = 1) => `rgba(88, 86, 214, ${opacity})`, // Color de la línea de la gráfica
                                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Color de las etiquetas
                                                style: {
                                                    borderRadius: 16,
                                                },
                                                propsForDots: {
                                                    r: '1', // Radio de los puntos en la gráfica
                                                    strokeWidth: '2',
                                                    stroke: '#5856D6',
                                                },
                                            }}
                                            bezier // Tipo de gráfica (curva de Bezier)                                    
                                        />
                                    ) : (
                                        <Text>No hay datos disponibles para esta gráfica</Text>
                                    )}


                                </View>

                            )}

                        </View>
                    )}
                    {selectedStat === "record" && (
                        <View style={styles.exercisePickerContainer}>
                            <Text style={{ marginBottom: 5 }}>Selecciona un ejercicio para mostrar tu record</Text>
                            <Picker
                                selectedValue={selectedExercise}
                                onValueChange={(itemValue) => setSelectedExercise(itemValue)}
                                style={styles.fixedDropdown} // Estilo con ancho fijo
                                itemStyle={styles.dropdownItem}
                            >
                                {nombresEjercicios.map((nombre, index) => (
                                    <Picker.Item key={index} label={nombre} value={nombre} />
                                ))}
                            </Picker>
                            {selectedExercise !== '' && (
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    {weightData.length > 0 ? (

                                        <View style={styles.maxWeightContainer}>
                                            <Text style={styles.maxWeightLabel}>Detalles del Record Personal</Text>
                                            <Text style={styles.exerciseName}><Text style={styles.boldText}>Nombre del ejercicio:</Text> {selectedExercise}</Text>
                                            <Text style={styles.maxWeight}><Text style={styles.boldText}>Peso máximo levantado:</Text> {getMaxWeight(weightData)} kg</Text>
                                            <Text style={styles.liftDate}><Text style={styles.boldText}>Fecha del levantamiento:</Text> {getMaxWeightDate(weightData)}</Text>
                                        </View>

                                    ) : (
                                        <Text>No hay datos disponibles para esta estadística</Text>
                                    )}


                                </View>

                            )}

                        </View>
                    )}
                    {selectedStat === "evolucion" && (
                        <View style={styles.exercisePickerContainer}>
                            <Text style={{ marginBottom: 5 }}>Selecciona un ejercicio para mostrar tu evolución de RPE</Text>
                            <Picker
                                selectedValue={selectedExercise}
                                onValueChange={(itemValue) => setSelectedExercise(itemValue)}
                                style={styles.fixedDropdown} // Estilo con ancho fijo
                                itemStyle={styles.dropdownItem}
                            >
                                {nombresEjercicios.map((nombre, index) => (
                                    <Picker.Item key={index} label={nombre} value={nombre} />
                                ))}
                            </Picker>
                            {selectedExercise !== '' && (
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    {rpeData.length > 0 ? (
                                        <LineChart
                                            data={{
                                                labels: [],
                                                datasets: [
                                                    {
                                                        data: rpeData,
                                                    },
                                                ],
                                            }}
                                            width={400}
                                            height={300}
                                            fromZero
                                            yAxisSuffix=" "
                                            yAxisInterval={1}
                                            xLabelsOffset={5}
                                            chartConfig={{
                                                backgroundColor: '#FFFFFF',
                                                backgroundGradientFrom: '#FFFFFF',
                                                backgroundGradientTo: '#FFFFFF',
                                                decimalPlaces: 0,
                                                color: (opacity = 1) => `rgba(88, 86, 214, ${opacity})`,
                                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                                style: {
                                                    borderRadius: 16,
                                                },
                                                propsForDots: {
                                                    r: "6",
                                                    strokeWidth: "2",
                                                },
                                            }}
                                            bezier
                                            renderDotContent={({ x, y, index }) => (
                                                <Text
                                                    key={index}
                                                    style={{
                                                        position: 'absolute',
                                                        top: y - 20, // Adjust the position of the text as needed
                                                        left: x,
                                                        textAlign: 'center',
                                                        fontSize: 12,
                                                        color: '#000000', // Adjust the color as needed
                                                    }}
                                                >
                                                    {rpeData[index]} {/* Accede al valor utilizando el índice */}
                                                </Text>
                                            )}
                                        />

                                    ) : (
                                        <Text>No hay datos disponibles para esta estadística</Text>
                                    )}


                                </View>

                            )}

                        </View>
                    )}
                    {selectedStat === "tiempo_promedio" && (

                        <View style={styles.maxWeightContainer}>
                            <Text style={styles.maxWeightLabel}>Tiempos de entreno</Text>
                            <Text style={styles.exerciseName}><Text style={styles.boldText}>Entrenamiento más largo:</Text> {tiempoData?.maximo} minutos</Text>
                            <Text style={styles.maxWeight}><Text style={styles.boldText}>Entrenamiento más corto:</Text> {tiempoData?.minimo} minutos</Text>
                            <Text style={styles.liftDate}><Text style={styles.boldText}>Tiempo promedio de entrenamiento:</Text> {tiempoData?.promedio.toFixed(2)} minutos</Text>
                        </View>

                    )}
                    {selectedStat === "trabajo_musculo" && (
                        <View style={styles.pieChartContainer}>
                            <Text style={styles.pieChartTitle}>Distribución de Series por Grupo Muscular</Text>
                            {datosMusculares.length > 0 ? (
                                <PieChart
                                    data={datosMusculares.map((data, index) => ({
                                        name: data[1], // Name of the muscle group
                                        series: data[0], // Number of series
                                        color: segmentColors[index] // Use the pre-generated color for each segment
                                    }))}
                                    width={400}
                                    height={200}
                                    chartConfig={{
                                        backgroundColor: '#FFFFFF',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(88, 86, 214, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    }}
                                    accessor="series"
                                    backgroundColor="transparent"
                                    paddingLeft="0"
                                    absolute
                                />
                            ) : (
                                <Text>No hay datos disponibles para esta estadística</Text>
                            )}
                        </View>
                    )}
                </>

            ) : (
                <View>
                    <Icon name="alert-circle-outline" size={64} color="#FF6B6B" style={styles.icon} />
                    <TouchableOpacity activeOpacity={0.7} style={styles.messageContainer}>
                        <Text style={styles.messageText}>
                            Para acceder a estadísticas avanzadas, actualiza a una cuenta Premium.
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#5856D6',
        padding: 10,
    },
    messageContainer: {
        backgroundColor: '#F1F1F1',
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#5856D6',
        maxWidth: 300,
    },
    messageText: {
        color: '#333333',
        textAlign: 'center',
        fontSize: 16,
    },
    icon: {
        marginBottom: 10,
    },
    dropdown: {
        width: 200,
        marginBottom: 20,
        backgroundColor: '#EAEAEA',
        borderRadius: 5,
    },
    fixedDropdown: {
        width: 200, // Ajusta el ancho fijo
        marginBottom: 20,
        backgroundColor: '#EAEAEA',
        borderRadius: 5,
    },
    dropdownItem: {
        fontSize: 16,
        textAlign: 'center',
    },
    exercisePickerContainer: {
        flex: 1,
        alignItems: 'center', // Alinea verticalmente en el centro
        marginLeft: 10, // Margen izquierdo para separar del borde izquierdo
        marginBottom: 20,

    },
    weightDataItem: {
        marginBottom: 10,
    },
    maxWeightContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        width: '80%',
    },
    maxWeightLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#5856D6',
    },
    exerciseName: {
        fontSize: 16,
        marginBottom: 5,
        color:'black',
    },
    maxWeight: {
        fontSize: 16,
        marginBottom: 5,
        color:'black'
    },
    liftDate: {
        fontSize: 16,
        color:'black'
    },
    boldText: {
        fontWeight: 'bold',
    },
    pieChartContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    pieChartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#5856D6',
    },
});




