import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View, VirtualizedList } from 'react-native';
import { TarjetaEjercicio } from '../components/TarjetaEjercicio';
import routineApi from '../api/routineApi';
import { Ejercicio, GetEjerciciosResponse } from '../interfaces/appInterfaces';
import { FlatList} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export const EjerciciosScreen = () => {
  const { token } = useContext(AuthContext);
  const navigation= useNavigation();
  const pageSize = 10; // Tamaño de página para cargar más elementos

  const [ejercicios, setEjercicios] = useState<GetEjerciciosResponse>({
    contenido: [],
    numPagina: 0,
    tamPagina: 0,
    totalElementos: 0,
    totalPaginas: 0,
    ultima: false,
  });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false); // Estado para controlar la carga de más elementos
  const [nombreEjercicio, setNombreEjercicio] = useState('');
  const [page, setPage] = useState(0); // Estado para almacenar el número de página actual

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
      const response = await routineApi.get('/ejercicios/filtrarKeyword', {
        ...config,
        params: {
          keyword: nombreEjercicio,
          pageNo: reset ? 0 : page, // Utilizar el número de página actual en la llamada a la API si no es un reset
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
      setPage((prevPage) => reset ? 1 : prevPage + 1); // Reiniciar el número de página a 1 si es un reset, de lo contrario, aumentarlo en 1
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
      setLoadingMore(true); // Establece el estado para mostrar el indicador de carga de más elementos
      fetchData(false); // No resetear los ejercicios y la página en este caso
    }
  };

  const handleSearch = () => {
    setLoading(true);
    setPage(0);
    fetchData(true);
  };

  const handleCrearEjercicio = () =>{
    navigation.navigate('AddEjercicioScreen' as never);
  }


  const refreshEjercicios = async () => {
    console.log('Entra ejercicios');
    await fetchData(true);
  };


  return (
    <View style={{ flex: 1, marginHorizontal: 12 }}>
      <TouchableOpacity style={styles.crearEjercicioButton} onPress={handleCrearEjercicio}>
        <Icon name='add-circle-outline' size={20} color={'#5856D6'}/>
        <Text style={{fontSize:18,fontWeight:'bold'}}>Añadir ejercicio personalizado</Text>
      </TouchableOpacity>
      <Text style={{color:'grey'}}>Busca un ejercicio por nombre o selecciona un grupo muscular para filtrar</Text>
      <View style={{ flexDirection: 'row', alignItems:'center'}}>
        <TextInput
          placeholder="Ej: press banca"
          placeholderTextColor='grey'
          selectionColor='blue'
          onChangeText={setNombreEjercicio}
          onSubmitEditing={handleSearch}
          style={{ flex: 1, backgroundColor:'white', borderTopLeftRadius:10,borderBottomLeftRadius:10,color:'black' }}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Icon name="search-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={ejercicios.contenido}
        keyExtractor={(item,index) => index.toString()}
        renderItem={({ item }) => <TarjetaEjercicio ejercicio={item} width={'100%'} height={120} editable={false} onDelete={refreshEjercicios}/>}
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
    </View>
  );
};

const styles = StyleSheet.create({
    crearEjercicioButton: {
      marginVertical:10,
      backgroundColor: 'rgba(88,86,214,0.5)',
      borderWidth:1,
      borderRadius:10,
      borderColor:'#5856D6',
      flexDirection:'row',
      alignContent:'center',
      justifyContent:'center',
      alignItems:'center',
      height:100,
    },
    searchButton:{
      backgroundColor: 'rgba(88,86,214,0.5)',
      height:50,
      width:50,
      borderTopRightRadius:10,
      borderBottomRightRadius:10,
      alignItems:'center',
      justifyContent:'center',
    }
});