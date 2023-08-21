import React, { useContext, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { AuthContext } from '../context/AuthContext';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useForm } from '../hooks/useForm';
import routineApi from '../api/routineApi';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { loginStyles } from '../theme/loginTheme';
import Icon from 'react-native-vector-icons/Ionicons';
import { GetDietasResponse } from '../interfaces/appInterfaces';

type EditDietaScreenProps = {
    route: RouteProp<{ params: { dieta: GetDietasResponse } }, 'params'>;
};

export const EditDietaScreen = ({ route }: EditDietaScreenProps) => {
    const { user, token } = useContext(AuthContext);
    const { dieta } = route.params;
    const navigation = useNavigation<any>();

    const { nombre, onChange } = useForm({
        nombre: dieta.nombre,
    });

    const onEditarDieta = async () => {
        const dietaData = {
            nombre: nombre,
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await routineApi.put(`/dietas/actualizar/${dieta.id}`, dietaData, config);

            const response2 = await routineApi.get<GetDietasResponse>(`/dietas/getById/${dieta.id}`, config);
            Alert.alert("Éxito", "Dieta editada con éxito")
            navigation.navigate('DietaDetailsScreen', { dieta: response2.data });

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <View style={loginStyles.title}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                >
                    <Icon name='arrow-back-outline' size={25} color='white' />
                    <Text style={{ ...styles.buttonText, fontSize: 20 }}>Volver</Text>
                </TouchableOpacity>
                <Text style={{ ...loginStyles.title, }}>Editando dieta: {dieta.nombre}</Text>
                <Text style={loginStyles.label}>Nuevo nombre de la dieta:</Text>
                <TextInput style={styles.input} selectionColor='white' placeholderTextColor="rgba(255,255,255,0.4)" underlineColorAndroid='white' placeholder="Nombre dieta" value={nombre} onChangeText={(value) => onChange(value, 'nombre')} />
            </View>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity activeOpacity={0.8} style={{ ...styles.button, marginBottom: 100, marginTop: 50 }} onPress={onEditarDieta}>
                    <Text style={styles.buttonText}>Editar dieta</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#5856D6',
        padding: 25,
    },
    form: {
        marginBottom: 15,
    },
    input: {
        height: 40,
        marginBottom: 15,
        paddingHorizontal: 10,
        color: 'white',
    },
    button: {
        backgroundColor: '#5856D6',
        paddingVertical: 10,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'white',
        width: 100,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',

    },
    avisoContainer: {
        backgroundColor: 'green',
        padding: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    avisoText: {
        color: 'white',
        fontWeight: 'bold',
    },
});