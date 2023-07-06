import React, { useContext, useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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


    const fetchData = async (reset: boolean = true) => {
        if (!token) {
            return; // No realizar la llamada a la API si no hay un token de autenticación
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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


    return (
        <View style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
            <Text style={{ marginTop: 20, fontWeight: '300', fontSize: 18, textAlign: 'center', color: 'black', padding: 5 }}>Crea una rutina o selecciona una ya creada</Text>
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