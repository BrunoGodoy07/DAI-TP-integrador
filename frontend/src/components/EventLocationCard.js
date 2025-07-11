import React from 'react';
import { Card, Title, Paragraph } from 'react-native-paper';

const EventLocationCard = ({ location, onPress }) => {
  if (!location) return null;
  return (
    <Card onPress={onPress} style={{ marginBottom: 16 }}>
      <Card.Content>
        <Title>{location.name}</Title>
        <Paragraph>{location.full_address}</Paragraph>
        <Paragraph>Capacidad máxima: {location.max_capacity}</Paragraph>
        {location.location && (
          <>
            <Paragraph>Localidad: {location.location.name}</Paragraph>
            <Paragraph>Provincia: {location.location.province?.name}</Paragraph>
          </>
        )}
        <Paragraph>Lat: {location.latitude}, Lng: {location.longitude}</Paragraph>
      </Card.Content>
    </Card>
  );
};

export default EventLocationCard;