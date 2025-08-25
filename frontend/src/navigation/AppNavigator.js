import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../pages/LoginScreen';
import RegisterScreen from '../pages/RegisterScreen';
import HomeScreen from '../pages/HomeScreen';
import EventListScreen from '../pages/EventListScreen';
import EventDetailScreen from '../pages/EventDetailScreen';
import EventFormScreen from '../pages/EventFormScreen';
import MyEventsScreen from '../pages/MyEventsScreen';
import MyEnrollmentsScreen from '../pages/MyEnrollmentsScreen';
import ParticipantsScreen from '../pages/ParticipantsScreen';
import LocationListScreen from '../pages/LocationListScreen';
import LocationFormScreen from '../pages/LocationFormScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2D3748',
        },
        headerTintColor: '#F7FAFC',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Ingresar" }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Registro" }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
      <Stack.Screen name="EventList" component={EventListScreen} options={{ title: "Explorar Eventos" }} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} options={{ title: "Detalle de Evento" }} />
      <Stack.Screen name="EventForm" component={EventFormScreen} options={{ title: "Crear/Editar Evento" }} />
      <Stack.Screen name="MyEvents" component={MyEventsScreen} options={{ title: "Mis Eventos" }} />
      <Stack.Screen name="MyEnrollments" component={MyEnrollmentsScreen} options={{ title: "Mis Inscripciones" }} />
      <Stack.Screen name="Participants" component={ParticipantsScreen} options={{ title: "Participantes" }} />
      <Stack.Screen name="LocationList" component={LocationListScreen} options={{ title: "Ubicaciones" }} />
      <Stack.Screen name="LocationForm" component={LocationFormScreen} options={{ title: "Crear/Editar Ubicación" }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;