import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, Avatar } from 'react-native-paper';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Email ve şifre alanları boş olamaz.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore'a kullanıcı bilgilerini kaydet
      await setDoc(doc(firestore, 'users', user.uid), {
        email: user.email,
        role: 'user', // Varsayılan rol
      });

      Alert.alert('Başarılı', 'Kayıt işlemi tamamlandı!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Avatar.Icon size={100} icon="account-plus" style={styles.avatar} />
      <Text style={styles.title}>Kayıt Ol</Text>
      <TextInput
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        placeholder="ornek@gmail.com"
        autoCapitalize="none"
        theme={{
          fonts: { regular: { fontFamily: 'fantasy' } },
          colors: {
            placeholder: '#B71C1C', // Placeholder yazı rengi
            primary: '#B71C1C', // Odaklanıldığında çerçeve kırmızı
          },
        }}
      />
      <TextInput
        mode="outlined"
        label="Şifre"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        placeholder="********"
        theme={{
          fonts: { regular: { fontFamily: 'fantasy' } },
          colors: {
            placeholder: '#B71C1C', // Placeholder yazı rengi
            primary: '#B71C1C', // Odaklanıldığında çerçeve kırmızı
          },
        }}
      />
      <Button
        mode="contained"
        onPress={handleSignUp}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonText}
      >
        Kayıt Ol
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate('Login')}
        style={styles.linkButton}
        labelStyle={styles.linkButtonText}
      >
        Zaten bir hesabın var mı? Giriş Yap
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
    backgroundColor: '#80CBC4', // Açık zümrüt yeşili arka plan
    fontFamily: 'fantasy', // Yazı fontu
  },
  avatar: {
    backgroundColor: '#B71C1C', // Kırmızı avatar rengi
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#00796B', // Koyu zümrüt yeşili başlık
    fontFamily: 'fantasy', // Yazı fontu
  },
  input: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    marginTop: 10,
    backgroundColor: '#00796B', // Koyu zümrüt yeşili buton
  },
  buttonContent: {
    height: 50,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'fantasy', // Yazı fontu
  },
  linkButton: {
    marginTop: 20,
  },
  linkButtonText: {
    color: '#B71C1C', // Kırmızı link rengi
    fontWeight: 'bold',
    fontFamily: 'fantasy', // Yazı fontu
  },
});

export default Signup;
