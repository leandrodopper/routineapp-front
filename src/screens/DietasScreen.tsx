import React, { useContext, useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import routineApi from '../api/routineApi';
import { GetDietasResponse, GetUsuarioResponse, Usuario } from '../interfaces/appInterfaces';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { TarjetaDieta } from '../components/TarjetaDieta'; // Asegúrate de importar la TarjetaDieta correcta
import { loginStyles } from '../theme/loginTheme';
import { TarjetaUsuario } from '../components/TarjetaUsuario';

export const DietasScreen = () => {
  const [nombreDieta, setNombreDieta] = useState("");
  const { user, token, logOut } = useContext(AuthContext);
  const [dietas, setDietas] = useState<GetDietasResponse[]>([]);
  const [searching, setSearching] = useState(false);
  const navigation = useNavigation();
  const [roleData, setRoleData] = useState();
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState<GetUsuarioResponse>();
  const [modalVisible, setModalVisible] = useState(false);


  const hasNutricionistRole = user?.roles?.some(role => role.nombre === 'ROLE_NUTRICIONISTA') || false;
  const hasAdminRole = user?.roles?.some(role => role.nombre === 'ROLE_ADMIN') || false;


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

  const handleAddNutricionistaRole = (usuario: GetUsuarioResponse) => {
    if (!token) {
      return;
    }
  
    Alert.alert(
      'Confirmación',
      `¿Desea convertir en nurticionista al usuario ${usuario?.username}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => {
            try {
              const idUsuario = usuario.id;
              const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };
              routineApi.post(`/auth/agregar-rol?usuarioId=${idUsuario}&nuevoRol=ROLE_NUTRICIONISTA`, config)
                .then(response => {
                  setRoleData(response.data);
                })
                .catch(error => {
                  if (error.response?.status === 400) {
                    Alert.alert('Error', 'El usuario ya tiene el rol de nutricionista');
                  } else {
                    console.error('Error al agregar rol Nutricionista:', error);
                  }
                });
            } catch (error) {
              console.error('Error al agregar rol Nutricionista:', error);
            }
          },
        },
      ]
    );
  };
  
  


  const handleSearchUser = async (username: String) => {
    if (!token) {
      return;
    }
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await routineApi.get<GetUsuarioResponse>(`/auth/username?username=${username}`, config);
  
      setUserData(response.data);
    } catch (error) {
      Alert.alert("Usuario no encontrado", "No se ha encontrado ningún usuario con ese nombre de usuario.");
      setUserData(undefined);
    }
  };
  

  const closeModal = () => {
    setModalVisible(false);
    setUserData(undefined);
  };

  return (
    <View style={{ flex: 1, marginHorizontal: 12, marginTop: 20 }}>
      {hasNutricionistRole && (
        <TouchableOpacity style={styles.crearDietaButton} onPress={handleAddDieta}>
          <Icon name='add-circle-outline' size={20} color={'#5856D6'} />
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Añadir dieta</Text>
        </TouchableOpacity>
      )}
      {hasAdminRole && (
        <View>
          <TouchableOpacity
            style={styles.premiumButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Añadir nuevo nutricionista</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.crearDietaButton} onPress={handleAddDieta}>
            <Icon name='add-circle-outline' size={20} color={'#5856D6'} />
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Añadir dieta</Text>
          </TouchableOpacity>
          <Modal
            visible={modalVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={closeModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text>Busca el usuario a partir de su username al que quieras conceder el rol de nutricionista</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TextInput
                    placeholder="Nombre de usuario"
                    placeholderTextColor='grey'
                    selectionColor='blue'
                    onChangeText={setUsername}
                    onSubmitEditing={() => handleSearchUser(username)}
                    style={{ flex: 1, backgroundColor: '#F0F0F0', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, color: 'black' }}
                  />
                  <TouchableOpacity style={styles.searchButton} onPress={() => handleSearchUser(username)}>
                    <Icon name="search-outline" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center', marginTop: 40, flexDirection: 'row', padding: 10 }}>
                  {userData && (
                    <>
                      <TarjetaUsuario usuario={userData} />
                      <TouchableOpacity style={styles.addbutton} onPress={()=>handleAddNutricionistaRole(userData)}>
                        <Icon name='arrow-forward-outline' size={30} color={'black'} />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

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
          <TarjetaDieta dieta={item} />
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
    marginHorizontal: 45,
  },
  premiumButton: {
    height: 100,
    width: 300,
    backgroundColor: '#5856D6',
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    height: '90%'
  },
  input: {
    color: 'black',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    width: 150,
    marginBottom: 5,
    marginTop: 5,
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: '#5856D6',
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  addbutton: {
    backgroundColor: '#A2FFA8',
    height: 60,
    width: 60,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20
  }
});
