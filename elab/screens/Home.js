import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Avatar } from 'react-native-paper';

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>E-LAB</Text>
      <Avatar.Icon size={120} icon="clipboard-text" style={styles.avatar} />
      <Text style={styles.slogan}>Sağlığı Takip Edin</Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Login')}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonText}
      >
        Giriş Yap
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('Signup')}
        style={styles.buttonOutlined}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonText}
      >
        Kayıt Ol
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#80CBC4',
  },
  avatar: {
    backgroundColor: '#b71c1c',
    marginBottom: 20,
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'fantasy', // Özel font (Roboto)

  },
  slogan: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'fantasy', // Özel font (Roboto)

  },
  button: {
    marginVertical: 10,
    width: '80%',
    backgroundColor: '#00796B',
    fontFamily: 'fantasy', // Özel font (Roboto)

  },
  buttonOutlined: {
    marginVertical: 10,
    width: '80%',
    borderColor: '#00796B',
    borderWidth: 1.5,

  },
  buttonContent: {
    height: 50,
    fontFamily: 'fantasy', // Özel font (Roboto)
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'fantasy', // Özel font (Roboto)
  },
});

export default Home;
