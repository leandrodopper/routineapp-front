import React, { useContext } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { AuthContext } from '../context/AuthContext'

export const ProtectedScreen = () => {
  const {token,user, logOut} = useContext(AuthContext)
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Protected Screen</Text>

        <Button
          title='Logout'
          color='#5856D6'
          onPress={logOut}
        />

        <Text style={{color:'black'}}>
          {JSON.stringify(user, null,5)}
        </Text>

        <Text style={{color:'black'}}>
          {token}
        </Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      justifyContent: 'center',
      alignItems:'center'
    }, 
    title:{
      fontSize:20,
      marginBottom:20,
      color:'black',
    }
});