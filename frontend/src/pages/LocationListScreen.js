import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import EventLocationCard from '../components/EventLocationCard';
import { FAB } from 'react-native-paper';

const LocationListScreen = ({ navigation }) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // //codigo del back: GET /api/event-location
  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {locations.map((location) => (
          <EventLocationCard
            key={location.id}
            location={location}
            onPress={() => navigation.navigate('LocationForm', { location })}
          />
        ))}
      </ScrollView>
      <FAB icon="plus" style={{ position: 'absolute', right: 16, bottom: 16 }} onPress={() => navigation.navigate('LocationForm')} />
    </>
  );
};

export default LocationListScreen;