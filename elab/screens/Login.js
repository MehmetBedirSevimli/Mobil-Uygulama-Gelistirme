import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, Avatar } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sabit admin bilgileri
  const ADMIN_EMAIL = 'b201210045@gmail.com';
  const ADMIN_PASSWORD = '123456789';

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    // Admin giriş kontrolü
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      Alert.alert('Başarılı', 'Admin olarak giriş yapıldı!');
      navigation.navigate('AdminPanelNavigator'); // Admin paneline yönlendirme
      return;
    }

    try {
      // Firebase Authentication ile normal kullanıcı girişini kontrol et
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore'dan kullanıcı bilgilerini al
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.role === 'user') {
          Alert.alert('Başarılı', 'Kullanıcı olarak giriş yapıldı!');
          navigation.navigate('UserPanelNavigator'); // Kullanıcı paneline yönlendirme
        } else {
          Alert.alert('Hata', 'Kullanıcı rolü tanımlanamıyor.');
        }
      } else {
        Alert.alert('Hata', 'Kullanıcı bilgileri bulunamadı.');
      }
    } catch (error) {
      Alert.alert('Hata', 'E-posta veya şifre yanlış.');
    }
  };

  return (
    <View style={styles.container}>
      <Avatar.Icon size={100} icon="account" style={styles.avatar} />
      <Text style={styles.title}>Giriş Yap</Text>
      <TextInput
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        placeholder="example@gmail.com"
        autoCapitalize="none"
        theme={{
          fonts: { regular: { fontFamily: 'fantasy' } },
          colors: { placeholder: '#B71C1C', primary: '#B71C1C' },
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
          colors: { placeholder: '#B71C1C', primary: '#B71C1C' },
        }}
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonText}
      >
        Giriş Yap
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#80CBC4',
    padding: 20,
  },
  avatar: {
    backgroundColor: '#B71C1C',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#00796B',
  },
  input: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    marginTop: 10,
    backgroundColor: '#00796B',
  },
  buttonContent: {
    height: 50,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Login;
