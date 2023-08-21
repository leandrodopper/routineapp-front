import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GetDietasResponse } from '../interfaces/appInterfaces'; // Asegúrate de importar la interfaz correcta
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

interface Props {
  dieta: GetDietasResponse; // Cambiar a la interfaz correcta
}

export const TarjetaDieta = ({ dieta}: Props) => {
    const navigation = useNavigation<any>();

    const handleDietaPress = (dieta:GetDietasResponse) => {
        navigation.navigate('DietaDetailsScreen', {dieta})
    }

  return (
    <TouchableOpacity style={styles.tarjetaDietaContainer} onPress={()=>{handleDietaPress(dieta)}}>
      <View style={styles.iconContainer}>
        <Icon name="document-text-outline" size={60} color="#5856D6" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.nombreDieta} numberOfLines={2}>{dieta.nombre}</Text>
        <Text style={styles.creadorDieta} numberOfLines={1}>Creador: {dieta.usernameCreador}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    tarjetaDietaContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        width: 130,
        height: 180,
        alignSelf: 'center',
        marginBottom: 15,
        marginTop: 10,
        justifyContent: 'flex-start', // Alinear el contenido al principio
        elevation: 2,
        flexDirection: 'column', // Cambiar a columna para apilar elementos verticalmente
        alignItems: 'center', // Centrar horizontalmente
        paddingVertical: 15,
      },
      iconContainer: {
        marginTop: 10, // Ajustar el margen superior para centrar el icono
      },
      textContainer: {
        marginTop: 10, // Espacio entre el icono y el texto
        alignItems: 'center', // Centrar horizontalmente
        marginHorizontal:5
      },
      nombreDieta: {
        fontSize: 14, // Tamaño del nombre de la dieta
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black',
        textAlign: 'center', // Centrar el texto
      },
      creadorDieta: {
        fontSize: 14,
        color: 'gray',
        textAlign: 'center', // Centrar el texto
      },
});


