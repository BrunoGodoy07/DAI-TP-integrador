import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Searchbar, FAB } from 'react-native-paper';
import EventCard from '../components/EventCard';

const EventListScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchEvents = async (query = '') => {
    setLoading(true);
    // //codigo del back: GET /api/event/?name=...&startdate=...&tag=...
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      <Searchbar
        placeholder="Buscar evento..."
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={() => fetchEvents(search)}
        style={{ margin: 16 }}
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
          />
        ))}
      </ScrollView>
      <FAB
        icon="plus"
        style={{ position: 'absolute', right: 16, bottom: 16 }}
        onPress={() => navigation.navigate('EventForm')}
        label="Crear evento"
      />
    </>
  );
};

export default EventListScreen;