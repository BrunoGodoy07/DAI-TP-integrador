import React from 'react';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import UserAvatar from './UserAvatar';

const ParticipantCard = ({ participant }) => {
  if (!participant?.user) return null;
  return (
    <Card style={{ marginBottom: 12 }}>
      <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
        <UserAvatar
          firstName={participant.user.first_name}
          lastName={participant.user.last_name}
        />
        <Title style={{ marginLeft: 8 }}>
          {participant.user.first_name} {participant.user.last_name}
        </Title>
      </Card.Content>
      <Card.Content>
        <Paragraph>Username: {participant.user.username}</Paragraph>
        <Paragraph>Asistió: {participant.attended ? 'Sí' : 'No'}</Paragraph>
        {participant.rating !== null && (
          <Chip>Calificación: {participant.rating}</Chip>
        )}
        {participant.description && (
          <Paragraph>Comentario: {participant.description}</Paragraph>
        )}
      </Card.Content>
    </Card>
  );
};

export default ParticipantCard;