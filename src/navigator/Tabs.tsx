import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProtectedScreen } from '../screens/ProtectedScreen';
import { DietasScreen} from '../screens/DietasScreen';
import { EjerciciosScreen } from '../screens/EjerciciosScreen';
import { TopTabNavigator } from './TopTabNavigator';
import { RutinasScreen } from '../screens/RutinasScreen';
import { TopTabNavigatorRutinas } from './TopTabNavigatorRutinas';
import { RutinasSeguidasScreen } from '../screens/RutinasSeguidasScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import { EstadisticasScreen } from '../screens/EstadisticasScreen';

const Tab = createBottomTabNavigator();

export const Tabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="ProtectedScreen" component={ProtectedScreen} />
            <Tab.Screen name="DietasScreen" component={DietasScreen} />
            <Tab.Screen name="RutinasScreen" component={TopTabNavigatorRutinas} options={{ tabBarLabel: 'Rutinas' }} />
            <Tab.Screen name="EjerciciosScreen" component={TopTabNavigator} options={{ tabBarLabel: 'Ejercicios' }} />
            <Tab.Screen name="EstadisticasScreen" component={EstadisticasScreen} options={{ tabBarLabel: 'Estadisticas' }} />

        </Tab.Navigator>
    );
}