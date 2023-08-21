import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import routineApi from '../api/routineApi';
import { GetDietasResponse } from '../interfaces/appInterfaces';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { TarjetaDieta } from '../components/TarjetaDieta'; // Asegúrate de importar la TarjetaDieta correcta

export const DietasScreen = () => {
  const [nombreDieta, setNombreDieta] = useState("");
  const { user, token } = useContext(AuthContext);
  const [dietas, setDietas] = useState<GetDietasResponse[]>([]);
  const [searching, setSearching] = useState(false);
  const navigation = useNavigation();

  const hasNutricionistRole = user?.roles?.some(role => role.nombre === 'ROLE_NUTRICIONISTA') || false;

  const fetchData = async () => {
    if (!token) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await routineApi.get<GetDietasResponse[]>('/dietas/all', config);
      setDietas(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!searching) {
        fetchData();
      }
    }, [searching])
  );

  const filterData = async () => {
    if (!token) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await routineApi.get<GetDietasResponse[]>('/dietas/buscar', {
        ...config,
        params: {
          searchTerm: nombreDieta,
        },
      });
      setDietas(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = () => {
    filterData();
    setSearching(true);
  }

  const handleAddDieta = () => {
    navigation.navigate('AddDietaScreen' as never)
  }

  return (
    <View style={{ flex: 1, marginHorizontal: 12, marginTop: 20 }}>
      {hasNutricionistRole && (
        <TouchableOpacity style={styles.crearDietaButton} onPress={handleAddDieta}>
          <Icon name='add-circle-outline' size={20} color={'#5856D6'} />
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Añadir dieta</Text>
        </TouchableOpacity>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          placeholder="Ej: dieta definicion"
          placeholderTextColor='grey'
          selectionColor='blue'
          onChangeText={setNombreDieta}
          onSubmitEditing={handleSearch}
          style={{ flex: 1, backgroundColor: 'white', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, color: 'black' }}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Icon name="search-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={dietas}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Mostrar dos tarjetas por fila
        columnWrapperStyle={styles.flatListWrapper} // Estilo para el contenedor de cada fila
        renderItem={({ item }) => (
          <TarjetaDieta dieta={item}/>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  crearDietaButton: {
    marginVertical: 10,
    backgroundColor: 'rgba(88,86,214,0.5)',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#5856D6',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  searchButton: {
    backgroundColor: 'rgba(88,86,214,0.5)',
    height: 50,
    width: 50,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatListWrapper: {
    justifyContent: 'space-between', // Espacio entre las columnas
    marginBottom: 15, // Espacio inferior entre las filas
    marginHorizontal:45,
  },
});
