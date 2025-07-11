import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import EventLocationCard from '../components/EventLocationCard';

const EventDetailScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);

  useEffect(() => {
    // //codigo del back: GET /api/event/{id}
  }, [eventId]);

  if (!event) return <Text>Cargando...</Text>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="headlineMedium">{event.name}</Text>
      <Text>{event.description}</Text>
      <Text>Fecha: {event.start_date}</Text>
      <Text>Duración: {event.duration_in_minutes} min</Text>
      <Text>Precio: ${event.price}</Text>
      <Text>Capacidad: {event.max_assistance}</Text>
      <Text>Inscripción habilitada: {event.enabled_for_enrollment ? 'Sí' : 'No'}</Text>
      <EventLocationCard location={event.event_location} />
      <Text>Tags: {event.tags.map(tag => tag.name).join(', ')}</Text>
      <Text>Creador: {event.creator_user.first_name} {event.creator_user.last_name}</Text>

      <Button mode="contained" onPress={() => {
        // //codigo del back: POST /api/event/{id}/enrollment/
      }}>Inscribirme</Button>
      
      <Button mode="outlined" onPress={() => {
        // //codigo del back: DELETE /api/event/{id}/enrollment/
      }} style={{ marginTop: 8 }}>Cancelar inscripción</Button>

      <Button mode="text" onPress={() => navigation.navigate('Participants', { eventId })} style={{ marginTop: 8 }}>
        Ver participantes
      </Button>
      {/* Si sos el creador, mostrar editar y eliminar */}
      {/* //codigo del back: PUT y DELETE /api/event/ */}
    </ScrollView>
  );
};

export default EventDetailScreen;