import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { EjerciciosScreen } from '../screens/EjerciciosScreen';
import { UsuarioEjerciciosScreen } from '../screens/UsuarioEjerciciosScreen';
import { RutinasScreen } from '../screens/RutinasScreen';
import { RutinasSeguidasScreen } from '../screens/RutinasSeguidasScreen';
import { RutinasUsuarioScreen } from '../screens/RutinasUsuarioScreen';
import { RutinasContext, RutinasContextType } from '../context/RutinasContext';


const Tab = createMaterialTopTabNavigator();

export const TopTabNavigatorRutinas = () => {
  const [rutinasSeguidasIds, setRutinasSeguidasIds] = useState<number[]>([]);
  const [actualizarRutinas, setActualizarRutinas]= useState<boolean>(false);
  const rutinasContextValue: RutinasContextType = {
    rutinasSeguidasIds,
    setRutinasSeguidasIds,
    actualizarRutinas,
    setActualizarRutinas,
  };
  return (

    <RutinasContext.Provider value={rutinasContextValue}>
      <Tab.Navigator>
        <Tab.Screen name="Siguiendo" component={RutinasSeguidasScreen} />
        <Tab.Screen name="Rutinas" component={RutinasScreen} />
        <Tab.Screen name="Tus rutinas" component={RutinasUsuarioScreen} />
      </Tab.Navigator>
    </RutinasContext.Provider>

  );
}