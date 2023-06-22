import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { EjerciciosScreen } from '../screens/EjerciciosScreen';
import { UsuarioEjerciciosScreen } from '../screens/UsuarioEjerciciosScreen';


const Tab = createMaterialTopTabNavigator();

export const TopTabNavigator = () => {
  return (
    
      <Tab.Navigator>
        <Tab.Screen name="App" component={EjerciciosScreen} />
        <Tab.Screen name="Usuario" component={UsuarioEjerciciosScreen} />
      </Tab.Navigator>
  );
}