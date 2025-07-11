import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import ParticipantCard from '../components/ParticipantCard';

const ParticipantsScreen = ({ route }) => {
  const { eventId } = route.params;
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    // //codigo del back: GET /api/event/{id}/participants
  }, [eventId]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {participants.map((p, idx) => (
        <ParticipantCard key={idx} participant={p} />
      ))}
    </ScrollView>
  );
};

export default ParticipantsScreen;