import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserPanel = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to User Panel!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#80CBC4',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default UserPanel;