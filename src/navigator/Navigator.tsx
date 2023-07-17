import React, { useContext, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ProtectedScreen } from '../screens/ProtectedScreen';
import { AuthContext } from '../context/AuthContext';
import { LoadingScreen } from '../screens/LoadingScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { EjerciciosScreen } from '../screens/EjerciciosScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import { AddEjercicioScreen } from '../screens/AddEjercicioScreen';
import { TopTabNavigator } from './TopTabNavigator';
import { EditEjercicio } from '../screens/EditEjercicio';
import { UsuarioEjerciciosScreen } from '../screens/UsuarioEjerciciosScreen';
import { RutinasScreen } from '../screens/RutinasScreen';
import { TopTabNavigatorRutinas } from './TopTabNavigatorRutinas';
import { RutinaDetailsScreen } from '../screens/RutinaDetailsScreen';
import { RutinasSeguidasScreen } from '../screens/RutinasSeguidasScreen';
import { AddRutinaScreen } from '../screens/AddRutinaScreen';
import { EditRutinaScreen } from '../screens/EditRutinaScreen';
import { AddDiaRutinaScreen } from '../screens/AddDiaRutinaScreen';
import { AddEjercicioADiaRutinaScreen } from '../screens/AddEjercicioADiaRutinaScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const Navigator = () => {

  const { status } = useContext(AuthContext);


  if (status === 'checking') return <LoadingScreen />

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white'
        }
      }}
    >

      {
        (status !== 'authenticated')
          ? (
            <>
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            </>
          )
          : (
            <Stack.Screen name="MainScreen">
              {() => (
                <Tab.Navigator screenOptions={{
                  headerShown: false,
                  tabBarStyle: {
                    borderTopWidth: 0,
                    elevation: 0,
                    backgroundColor: 'rgba(88,86,214,0.8)',
                  },
                  tabBarActiveTintColor: 'white',
                  tabBarInactiveTintColor: 'black',
                  tabBarLabelStyle: {
                    fontSize: 12,
                  },
                }}>
                  <Tab.Screen name="HomeScreen"
                    component={HomeScreen}
                    options={{
                      tabBarIcon: ({ focused }) => (
                        <Icon name='home-outline' size={30} color={focused ? 'white' : 'black'} />
                      ),
                    }} />
                  <Tab.Screen name="ProtectedScreen" component={ProtectedScreen} />
                  <Tab.Screen name="RutinasScreen" component={TopTabNavigatorRutinas}
                    options={{
                      tabBarIcon: ({ focused }) => (
                        <Icon name='bookmark-outline' size={30} color={focused ? 'white' : 'black'} />
                      ),
                    }} />
                  <Tab.Screen name="EjerciciosScreen" component={TopTabNavigator}
                    options={{
                      tabBarIcon: ({ focused }) => (
                        <Icon name='barbell-outline' size={30} color={focused ? 'white' : 'black'} />
                      ),
                    }} />
                </Tab.Navigator>
              )}
              
            </Stack.Screen>
          )
      }
      {status === 'authenticated' && (
        <>
          <Stack.Screen name="AddEjercicioScreen" component={AddEjercicioScreen} />
          <Stack.Screen name="EditEjercicio" component={EditEjercicio} />
          <Stack.Screen name="RutinaDetailsScreen" component={RutinaDetailsScreen} />
          <Stack.Screen name="RutinasSeguidasScreen" component={RutinasSeguidasScreen} />
          <Stack.Screen name="AddRutinaScreen" component={AddRutinaScreen} />
          <Stack.Screen name="EditRutinaScreen" component={EditRutinaScreen} />
          <Stack.Screen name="AddDiaRutinaScreen" component={AddDiaRutinaScreen} />
          <Stack.Screen name="AddEjercicioADiaRutinaScreen" component={AddEjercicioADiaRutinaScreen} />

        </>
      )}
    </Stack.Navigator>
  );
}