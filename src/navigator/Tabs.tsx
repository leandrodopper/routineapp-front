import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProtectedScreen } from '../screens/ProtectedScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { EjerciciosScreen } from '../screens/EjerciciosScreen';
import { TopTabNavigator } from './TopTabNavigator';
import { RutinasScreen } from '../screens/RutinasScreen';
import { TopTabNavigatorRutinas } from './TopTabNavigatorRutinas';
import { RutinasSeguidasScreen } from '../screens/RutinasSeguidasScreen';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export const Tabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="ProtectedScreen" component={ProtectedScreen} />
            <Tab.Screen name="HomeScreen" component={HomeScreen} />
            <Tab.Screen name="RutinasScreen" component={TopTabNavigatorRutinas} options={{ tabBarLabel: 'Rutinas' }} />
            <Tab.Screen name="EjerciciosScreen" component={TopTabNavigator} options={{ tabBarLabel: 'Ejercicios' }} />
        </Tab.Navigator>
    );
}