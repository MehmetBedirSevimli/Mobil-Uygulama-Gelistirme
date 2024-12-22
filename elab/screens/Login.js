import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, Avatar } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Admin bilgilerini burada tanımlayın
  const adminEmail = 'b201210045@gmail.com';
  const adminPassword = '123456789'; // Şifreyi doğrudan buraya gömüyorsunuz

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    // Admin girişini kontrol et
    if (email === adminEmail && password === adminPassword) {
      Alert.alert('Başarılı', 'Admin olarak giriş yapıldı!');
      navigation.navigate('AdminPanel');
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
          navigation.navigate('UserPanel');
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
          fonts: { regular: { fontFamily: 'fantasy' } }, // Placeholder ve yazı fontu
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
        onPress={handleLogin}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonText}
      >
        Giriş Yap
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate('Signup')}
        style={styles.linkButton}
        labelStyle={styles.linkButtonText}
      >
        Henüz bir hesabınız yok mu? Kayıt Ol
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

export default Login;
