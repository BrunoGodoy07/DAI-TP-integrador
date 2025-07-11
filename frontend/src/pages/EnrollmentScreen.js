import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import EventCard from '../components/EventCard';

const EnrollmentScreen = ({ navigation }) => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    // //codigo del back: GET /api/user/enrollments (o el endpoint para listar eventos en los que está inscripto el usuario)
    // setEnrollments(response.data.collection)
  }, []);

  const handleUnenroll = (eventId) => {
    // //codigo del back: DELETE /api/event/{eventId}/enrollment/
    // Luego refrescar la lista
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Mis Inscripciones</Text>
      {enrollments.length === 0 ? (
        <Text>No estás inscripto en ningún evento.</Text>
      ) : (
        enrollments.map((enrollment) => (
          <View key={enrollment.event.id} style={{ marginBottom: 16 }}>
            <EventCard event={enrollment.event} onPress={() => navigation.navigate('EventDetail', { eventId: enrollment.event.id })} />
            <Button mode="outlined" onPress={() => handleUnenroll(enrollment.event.id)} style={{ marginTop: 8 }}>
              Cancelar inscripción
            </Button>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default EnrollmentScreen;