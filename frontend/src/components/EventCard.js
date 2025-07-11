import React from 'react';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';

const EventCard = ({ event, onPress }) => (
  <Card onPress={onPress} style={{ marginBottom: 16 }}>
    <Card.Content>
      <Title>{event.name}</Title>
      <Paragraph>{event.description}</Paragraph>
      <Paragraph>Fecha: {event.start_date ? new Date(event.start_date).toLocaleString() : ''}</Paragraph>
      <Paragraph>Precio: ${event.price}</Paragraph>
      <Paragraph>Duración: {event.duration_in_minutes} min</Paragraph>
      <Paragraph>Capacidad: {event.max_assistance}</Paragraph>
      <Paragraph>Inscripción: {event.enabled_for_enrollment ? 'Habilitada' : 'No disponible'}</Paragraph>
      {event.event_location ? (
        <Chip style={{ marginTop: 4 }}>{event.event_location.name}</Chip>
      ) : null}
      {event.tags && event.tags.length > 0 ? (
        <Paragraph>
          Tags: {event.tags.map(tag => tag.name).join(', ')}
        </Paragraph>
      ) : null}
    </Card.Content>
  </Card>
);

export default EventCard;