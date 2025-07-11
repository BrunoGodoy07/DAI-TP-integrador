import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const LocationFormScreen = ({ route, navigation }) => {
  const location = route.params?.location;
  const [name, setName] = useState(location?.name || '');
  // ...otros campos...

  const handleSubmit = () => {
    if (location) {
      // //codigo del back: PUT /api/event-location/
    } else {
      // //codigo del back: POST /api/event-location/
    }
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <CustomInput label="Nombre" value={name} onChangeText={setName} />
      {/* Otros campos: dirección, lat/lng, provincia, etc */}
      <CustomButton onPress={handleSubmit}>{location ? 'Actualizar' : 'Crear'}</CustomButton>
    </ScrollView>
  );
};

export default LocationFormScreen;