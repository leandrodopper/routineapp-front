import React, { useContext, useState } from 'react';
import { GetDietasResponse, Comida, Alimento } from '../interfaces/appInterfaces';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { AuthContext } from '../context/AuthContext';
import routineApi from '../api/routineApi';



type DietaDetailsScreenProps = {
    route: RouteProp<{ params: { dieta: GetDietasResponse } }, 'params'>;
};

export const DietaDetailsScreen = ({ route }: DietaDetailsScreenProps) => {
    const { user, token } = useContext(AuthContext);

    const { dieta } = route.params;
    const navigation = useNavigation<any>();
    const [isModalVisible, setModalVisible] = useState(false);
    const [pdfFilePath, setPdfFilePath] = useState('');

    const generateDietaDetailsHTML = (dieta: GetDietasResponse) => {
        const htmlContent = `
            <html>
                <head>
                    <title>Detalles de la Dieta</title>
                </head>
                <body>
                    <h1>Detalles de la Dieta</h1>
                    <p><strong>Nombre:</strong> ${dieta.nombre}</p>
                    <p><strong>Creada por:</strong> ${dieta.usernameCreador}</p>
                    <h2>Comidas:</h2>
                    ${dieta.comidas.map((comida, index) => `
                        <div key="${index}">
                            <h3>${comida.nombre}</h3>
                            <ul>
                                ${comida.alimentos.map((alimento, subIndex) => `
                                    <li key="${subIndex}">
                                        ${alimento.nombre} - ${alimento.cantidad} gr.
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </body>
            </html>
        `;

        return htmlContent;
    };



    const generatePDF = async (dieta: GetDietasResponse) => {
        const htmlContent = generateDietaDetailsHTML(dieta);

        const options = {
            html: htmlContent,
            fileName: dieta.nombre,
            directory: 'Documents',
        };

        try {
            const pdf = await RNHTMLtoPDF.convert(options);
            console.log(pdf.filePath);
            setPdfFilePath(pdf.filePath || '');
            setModalVisible(true);
        } catch (error) {
            console.error('Error generando PDF:', error);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleAddComida = (dieta: GetDietasResponse) => {
        navigation.navigate('AddComidaScreen', { dieta });
    }

    const handleAddAlimento = (dieta: GetDietasResponse, comida: Comida) => {
        navigation.navigate('AddAlimentoScreen', { dieta, comida });
    }

    const handleDeleteAlimento = async (alimento: Alimento, comida: Comida, dieta: GetDietasResponse) => {
        Alert.alert('Confirmación', `Vas a eliminar un alimento (${alimento.nombre}) de la comida, ¿estás seguro?`,
            [
                {
                    text: 'Aceptar', onPress: async () => {
                        if (!token) {
                            return; // No realizar la llamada a la API si no hay un token de autenticación o si rutina es undefined
                        }
                        try {
                            const config = {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            };

                            const response = await routineApi.delete(`/dietas/comida/${comida.id}/alimento/${alimento.id}`, config);
                            const response2 = await routineApi.get<GetDietasResponse>(`/dietas/getById/${dieta.id}`, config);
                            Alert.alert("Éxito", "Alimento eliminado con éxito")
                            navigation.navigate('DietaDetailsScreen', { dieta: response2.data });
                        } catch (error) {
                            console.log('Error al borrar el alimento:', error);
                        }
                    }
                },
                { text: 'Cancelar', onPress: () => { } }
            ]);
    }

    const handleDeleteComida = async (comida: Comida, dieta: GetDietasResponse) => {
        Alert.alert('Confirmación', `Vas a eliminar una comida (${comida.nombre}) de la dieta, ¿estás seguro?`,
            [
                {
                    text: 'Aceptar', onPress: async () => {
                        if (!token) {
                            return; // No realizar la llamada a la API si no hay un token de autenticación o si rutina es undefined
                        }
                        try {
                            const config = {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            };

                            const response = await routineApi.delete(`/dietas/dieta/${dieta.id}/comida/${comida.id}`, config);
                            const response2 = await routineApi.get<GetDietasResponse>(`/dietas/getById/${dieta.id}`, config);
                            Alert.alert("Éxito", "Comida eliminada con éxito")
                            navigation.navigate('DietaDetailsScreen', { dieta: response2.data });
                        } catch (error) {
                            console.log('Error al borrar el alimento:', error);
                        }
                    }
                },
                { text: 'Cancelar', onPress: () => { } }
            ]);
    }

    const editDietaPressed = (dieta: GetDietasResponse) => {
        navigation.navigate('EditDietaScreen', { dieta })
    }

    const handleEliminarDieta = (dieta:GetDietasResponse) => {
        Alert.alert('Confirmación', `Vas a eliminar la dieta (${dieta.nombre}), ¿estás seguro?`,
        [
            {
                text: 'Aceptar', onPress: async () => {
                    if (!token) {
                        return; // No realizar la llamada a la API si no hay un token de autenticación o si rutina es undefined
                    }
                    try {
                        const config = {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        };

                        const response = await routineApi.delete(`/dietas/deleteById/${dieta.id}`, config);
                        Alert.alert("Éxito", "Dieta eliminada con éxito")
                        navigation.goBack();
                    } catch (error) {
                        console.log('Error al borrar la dieta:', error);
                    }
                }
            },
            { text: 'Cancelar', onPress: () => { } }
        ]);
    }

    return (
        <ScrollView style={styles.container}>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                >
                    <Icon name="arrow-back-outline" size={25} color="#5856D6" />
                    <Text style={{ ...styles.buttonText, fontSize: 20 }}>Volver</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonPDF}
                    onPress={() => generatePDF(dieta)}
                    activeOpacity={0.8}
                >
                    <Icon name="download-outline" size={25} color="#5856D6" />
                    <Text style={{fontWeight:'bold'}}>PDF</Text>
                </TouchableOpacity>

            </View>

            <Text style={styles.title}>Detalles de la Dieta</Text>
            {user?.username === dieta.usernameCreador && ( // Muestra el botón si el usuario es el creador
                 <TouchableOpacity style={styles.unfollowButton} onPress={()=>handleEliminarDieta(dieta)}>
                 <Text style={styles.unfollowButtonText}>Eliminar dieta</Text>
               </TouchableOpacity>
            )}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Nombre:</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.sectionText}>{dieta?.nombre}</Text>
                    {user?.username === dieta.usernameCreador && ( // Muestra el botón si el usuario es el creador
                        <TouchableOpacity style={{ ...styles.buttonPDF, height: 40, marginLeft: 20, width: 40 }}
                            onPress={() => editDietaPressed(dieta)}
                        >
                            <Icon name="pencil-outline" size={15} color="#5856D6" />
                        </TouchableOpacity>
                    )}
                </View>


            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Creada por:</Text>
                <Text style={styles.sectionText}>{dieta.usernameCreador}</Text>
            </View>
            {user?.username === dieta.usernameCreador && ( // Muestra el botón si el usuario es el creador
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddComida(dieta)}
                    activeOpacity={0.8}
                >
                    <Icon name='add-circle-outline' size={20} color={'#5856D6'} />
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Comida</Text>
                </TouchableOpacity>
            )}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Comidas:</Text>
                {dieta.comidas.map((comida, index) => (
                    <View key={index} style={styles.comidaContainer}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            {user?.username === dieta.usernameCreador && ( // Muestra el botón si el usuario es el creador
                                <TouchableOpacity
                                    style={styles.deleteAlimentoButton}
                                    onPress={() => handleDeleteComida(comida, dieta)}
                                >
                                    <View style={styles.iconContainer}>
                                        <Icon name="trash-outline" size={20} color="black" />
                                    </View>
                                </TouchableOpacity>
                            )}

                            <Text style={styles.comidaTitle}>{comida.nombre}</Text>
                            {user?.username === dieta.usernameCreador && ( // Muestra el botón si el usuario es el creador
                                <TouchableOpacity
                                    style={{ ...styles.addButton, width: 70, height: 40, marginLeft: 30 }}
                                    onPress={() => handleAddAlimento(dieta, comida)}
                                    activeOpacity={0.8}
                                >
                                    <Icon name='add-circle-outline' size={20} color={'#5856D6'} />
                                    <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Alimento</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={styles.alimentosContainer}>
                            {comida.alimentos.map((alimento, subIndex) => (
                                <View key={subIndex} style={styles.alimentoContainer}>
                                    <View style={styles.alimentoInfoContainer}>

                                        {user?.username === dieta.usernameCreador && ( // Muestra el botón si el usuario es el creador
                                            <TouchableOpacity
                                                style={styles.deleteAlimentoButton}
                                                onPress={() => handleDeleteAlimento(alimento, comida, dieta)}
                                            >
                                                <View style={styles.iconContainer}>
                                                    <Icon name="close-circle-outline" size={20} color="black" />
                                                </View>
                                            </TouchableOpacity>
                                        )}

                                        <Text style={styles.alimentoText}>{alimento.nombre}</Text>
                                        <View style={styles.cantidadContainer}>
                                            <Text style={styles.cantidadText}>
                                                {alimento.cantidad} gr.
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>
                            El PDF se ha generado exitosamente. Puedes encontrarlo en la ruta:
                        </Text>
                        <Text style={styles.filePathText}>{pdfFilePath}</Text>
                        <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={closeModal}
                        >
                            <Text style={styles.closeModalButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333333',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#5856D6',
    },
    sectionText: {
        fontSize: 16,
        color: '#333333',
    },
    comidaContainer: {
        marginBottom: 15,
    },
    comidaTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#5856D6',
        marginLeft: 10,
        marginTop: 5,
    },
    subsectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#5856D6',
        marginLeft: 20,
    },
    alimentosContainer: {
        marginLeft: 40,
    },
    alimentoContainer: {
        marginBottom: 5,
        marginTop: 5,
    },
    alimentoInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    alimentoText: {
        fontSize: 15,
        color: '#333333',
        flex: 1,
        maxWidth: '70%', // Limita el ancho del nombre del alimento
    },
    cantidadContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cantidadText: {
        fontSize: 15,
        marginLeft: 5,
        color: '#333333',
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
        marginBottom: 20,
    },
    buttonText: {
        color: '#5856D6',
        textAlign: 'center',
    },
    buttonPDF: {
        height: 70,
        width: 70,
        borderRadius: 100,
        backgroundColor: 'rgba(128, 128, 128, 0.2)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', // Alinea verticalmente los botones
        marginBottom: 20,
        padding: 10
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscurecido
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    filePathText: {
        fontSize: 14,
        color: '#666666',
        fontStyle: 'italic',
        marginBottom: 15,
        textAlign: 'center',
    },
    closeModalButton: {
        backgroundColor: '#5856D6',
        padding: 10,
        borderRadius: 5,
    },
    closeModalButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    addButton: {
        marginVertical: 10,
        backgroundColor: 'rgba(88,86,214,0.5)',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#5856D6',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        width: 175,
    },
    deleteAlimentoButton: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
    },
    iconContainer: {
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
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
