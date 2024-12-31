import React, { useState } from 'react'; 
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, Avatar } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      // Firebase Authentication ile giriş
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Giriş Başarılı:', user.email);

      // Admin kontrolü
      const adminQuery = query(
        collection(firestore, 'admins'),
        where('email', '==', email)
      );
      const adminSnapshot = await getDocs(adminQuery);

      if (!adminSnapshot.empty) {
        console.log('Admin Girişi Başarılı:', adminSnapshot.docs[0].data());
        Alert.alert('Başarılı', 'Admin olarak giriş yapıldı!');
        navigation.navigate('AdminPanelNavigator'); // Admin Paneline Yönlendirme
        return;
      }

      // Kullanıcı kontrolü
      const userQuery = query(
        collection(firestore, 'users'),
        where('email', '==', email)
      );
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        console.log('Kullanıcı Verisi:', userData);
        if (userData.role === 'user') {
          Alert.alert('Başarılı', 'Kullanıcı olarak giriş yapıldı!');
          navigation.navigate('UserPanelNavigator'); // Kullanıcı Paneline Yönlendirme
        } else {
          Alert.alert('Hata', 'Kullanıcı rolü tanımlanamıyor.');
        }
        return;
      }

      // Eğer kullanıcı bulunamazsa
      Alert.alert('Hata', 'Kullanıcı bilgileri bulunamadı.');
    } catch (error) {
      console.error('Hata:', error.code, error.message);
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Hata', 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Hata', 'Yanlış şifre girdiniz.');
      } else if (error.code === 'auth/invalid-credential') {
        Alert.alert('Hata', 'Geçersiz giriş kimlik bilgisi. Lütfen tekrar deneyin.');
      } else {
        Alert.alert('Hata', 'Giriş sırasında bir sorun oluştu.');
      }
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
