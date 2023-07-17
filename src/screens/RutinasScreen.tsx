import React, { useContext, useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { AuthContext } from '../context/AuthContext'
import routineApi from '../api/routineApi'
import { ContenidoRutinas, GetRutinasResponse } from '../interfaces/appInterfaces'
import { TarjetaRutina } from '../components/TarjetaRutina'
import { RutinasContext } from '../context/RutinasContext'
import { useIsFocused, useNavigation } from '@react-navigation/native'




export const RutinasScreen = () => {
    const { token } = useContext(AuthContext);
    const [rutinas, setRutinas] = useState<ContenidoRutinas[]>([]);
    const navigation = useNavigation<any>();
    const { rutinasSeguidasIds, setRutinasSeguidasIds, actualizarRutinas, setActualizarRutinas } = useContext(RutinasContext);
    const [isFocused, setIsFocused] = useState(false);
    const [textoSearch, setTextoSearch] = useState('');


    const fetchData = async (reset: boolean = true) => {
        if (!token) {
            return; // No realizar la llamada a la API si no hay un token de autenticación
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params:{
                    pageNo: 0,
                    pageSize: 100,
                    sortBy:'id',
                    sortDir:'asc',
                }
            };
            const response = await routineApi.get<GetRutinasResponse>('/rutinas', config);
            setRutinas(response.data.contenido);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);

    const handleAddRutina = () => {
        navigation.navigate('AddRutinaScreen');
    }

    const isScreenFocused = useIsFocused();
    useEffect(() => {
        setIsFocused(isScreenFocused);
    }, [isScreenFocused]);

    const handleTextChange = async (text: string) => {
        if (!token) {
            return; // No realizar la llamada a la API si no hay un token de autenticación
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    nombre: text,
                }
            };
            const response = await routineApi.get<ContenidoRutinas[]>('/rutinas/filtrarNombre', config);
            setRutinas(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
            <Text style={{ marginTop: 20, fontWeight: '300', fontSize: 18, textAlign: 'center', color: 'black', padding: 5 }}>Crea una rutina o selecciona una ya creada</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Buscar rutina por nombre"
                onChangeText={handleTextChange}
            />
            <TouchableOpacity style={styles.addrutinaButton} onPress={handleAddRutina}>
                <Icon name="add-outline" color='white' size={20} />
            </TouchableOpacity>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={rutinas}
                renderItem={({ item }) => (
                    <TarjetaRutina rutina={item} isFromRutinasSeguidas={false} />
                )}
                keyExtractor={(item) => item.id.toString()}
                style={{
                    width: '85%',
                    marginTop: 10,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    addrutinaButton: {
        height: 50,
        width: 50,
        backgroundColor: '#5856D6',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        elevation: 10,
    },
    searchInput: {
        width: '85%',
        height: 40,
        marginTop: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: 'white',
    },
});