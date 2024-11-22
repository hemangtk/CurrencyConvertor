import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function Layout() {
  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#f0f0f0" 
      />
      <Stack 
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007bff',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitle: 'Back',
        }} 
      />
    </>
  );
}