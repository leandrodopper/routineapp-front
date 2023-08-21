import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import { useForm } from '../hooks/useForm';
import { loginStyles } from '../theme/loginTheme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Usuario } from '../interfaces/appInterfaces';
import { AuthContext } from '../context/AuthContext';

export const EditPassScreen = () => {
    const route = useRoute();
    const { user }: { user?: Usuario } = route.params || {};
    const navigation = useNavigation();
    const { signUp, logOut, signIn } = useContext(AuthContext);
    const {
        nuevaContrasena,
        confirmarContrasena,
        onChange,
    } = useForm({
        nuevaContrasena: '',
        confirmarContrasena: '',
    });

    const handleChangePassword = () => {
        if (nuevaContrasena === confirmarContrasena) {
            // Aquí realizar la lógica para cambiar la contraseña en la API
            // Por ejemplo, hacer una llamada a la API con la nueva contraseña
            Alert.alert('Éxito', 'La contraseña ha sido cambiada exitosamente');
            // Lógica para regresar a la pantalla anterior o realizar otras acciones
        } else {
            Alert.alert('Error', 'Las contraseñas no coinciden');
        }
    };

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={()=>navigation.goBack()}
                activeOpacity={0.8}
            >
                <Icon name='arrow-back-outline' size={25} color='white' />
                <Text style={{ ...styles.buttonText, fontSize: 20 }}>Volver</Text>
            </TouchableOpacity>
            <View style={loginStyles.title}>
                <Text style={loginStyles.title}>Cambiar Contraseña</Text>
            </View>


            <Text style={loginStyles.label}>Nueva Contraseña:</Text>
            <TextInput
                style={loginStyles.inputField}
                selectionColor='white'
                placeholderTextColor="rgba(255,255,255,0.4)"
                underlineColorAndroid='white'
                secureTextEntry
                value={nuevaContrasena}
                onChangeText={(value) => onChange(value, 'nuevaContrasena')}
            />



            <Text style={loginStyles.label}>Confirmar Contraseña:</Text>
            <TextInput
                style={loginStyles.inputField}
                selectionColor='white'
                placeholderTextColor="rgba(255,255,255,0.4)"
                underlineColorAndroid='white'
                secureTextEntry
                value={confirmarContrasena}
                onChangeText={(value) => onChange(value, 'confirmarContrasena')}
            />


            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity activeOpacity={0.8} style={{ ...styles.button, marginBottom: 100, marginTop: 50 }} onPress={handleChangePassword}>
                    <Text style={styles.buttonText}>Editar usuario</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
};

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
