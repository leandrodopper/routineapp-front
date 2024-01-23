import React from 'react'
import { GetUsuarioResponse } from '../interfaces/appInterfaces';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
    usuario: GetUsuarioResponse;

}

export const TarjetaUsuario = ({ usuario}: Props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Nombre: {usuario?.nombre}</Text>
            <Text style={styles.text}>Apellidos: {usuario?.apellidos}</Text>
            <Text style={styles.text}>Username: {usuario?.username}</Text>
            <Text style={{...styles.text}}>Email: {usuario?.email}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        width: 200,
        backgroundColor: '#F0F0F0',
        padding: 10,
        borderRadius: 10,

    },
    text: {
        color: 'black',
        fontSize: 14,
        marginBottom: 5,
    },
});