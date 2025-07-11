import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import CustomButton from '../components/CustomButton';

const HomeScreen = ({ navigation }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="headlineMedium" style={{ marginBottom: 24 }}>Bienvenido al TP Integrador</Text>
    <CustomButton onPress={() => navigation.navigate('ItemList')}>Ver Items</CustomButton>
    {/* Agrega más botones o accesos directos a otras features */}
  </View>
);

export default HomeScreen;