import React, { useContext } from 'react'
import { Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AuthContext } from '../context/AuthContext'
import { PersonLogo } from '../components/PersonLogo'
import Icon from 'react-native-vector-icons/Ionicons'
import { Usuario } from '../interfaces/appInterfaces'
import { useNavigation } from '@react-navigation/native'

export const ProtectedScreen = () => {
  const { token, user, logOut } = useContext(AuthContext)
  const navigation = useNavigation<any>();

  const handleEdit = (user: Usuario) => {
    navigation.navigate('EditUserScreen', { user })
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>
      <View style={{ justifyContent: 'flex-end', width: '100%', flexDirection: 'row' }}>
        <TouchableOpacity style={styles.editButton}
          onPress={() => {
            if (user) {
              handleEdit(user);
            }
          }}
        >
          <Icon name="pencil-outline" size={20} color="white" />
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.userInfoContainer}>
        {user?.imagen ? (
          <Image source={{ uri: user.imagen }} style={styles.userImage} />
        ) : (
          <PersonLogo />
        )}
        <Text style={styles.userName}>{user?.nombre} {user?.apellidos}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoLabel}>Nombre de usuario:</Text>
        <Text style={styles.userInfoText}>{user?.username}</Text>
      </View>

      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoLabel}>Edad:</Text>
        <Text style={styles.userInfoText}>{user?.edad}</Text>
      </View>

      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoLabel}>Teléfono:</Text>
        <Text style={styles.userInfoText}>{user?.telefono}</Text>
      </View>


      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoLabel}>Altura:</Text>
        <Text style={styles.userInfoText}>{user?.altura} cm</Text>
      </View>

      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoLabel}>Peso:</Text>
        <Text style={styles.userInfoText}>{user?.peso} kg</Text>
      </View>

      {/* <TouchableOpacity
        onPress={() => { navigation.navigate('EditPassScreen') }}
      >
        <Text style={{ color: '#5856D6', marginBottom: 30, fontSize: 16, marginTop: 5 }}>Cambiar contraseña</Text>
      </TouchableOpacity> */}

      <Button title="Cerrar sesión" color="#5856D6" onPress={logOut} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'black',
  },
  userInfoContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  userEmail: {
    fontSize: 16,
    color: 'gray',
  },
  userInfoLabel: {
    fontSize: 16,
    color: '#5856D6',
  },
  userInfoText: {
    fontSize: 18,
    color: 'black',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5856D6',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 20,
  },
  editButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
});