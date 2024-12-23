import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, TextInput, Button, Avatar } from 'react-native-paper';
import { firestore } from '../firebase';
import { doc, collection, addDoc, getDoc } from 'firebase/firestore';

const AddReport = () => {
  const [patientNumber, setPatientNumber] = useState('');
  const [IgA, setIgA] = useState('');
  const [IgM, setIgM] = useState('');
  const [IgG, setIgG] = useState('');
  const [IgG1, setIgG1] = useState('');
  const [IgG2, setIgG2] = useState('');
  const [IgG3, setIgG3] = useState('');
  const [IgG4, setIgG4] = useState('');

  const handleAddReport = async () => {
    if (!patientNumber) {
      Alert.alert('Hata', 'Lütfen hasta numarasını doldurun.');
      return;
    }

    try {
      const patientDocRef = doc(firestore, 'patients', patientNumber);
      const patientDoc = await getDoc(patientDocRef);

      if (!patientDoc.exists()) {
        Alert.alert('Hata', 'Bu hasta numarasına sahip bir hasta bulunamadı.');
        return;
      }

      const reportData = {
        IgA: IgA !== '' ? parseFloat(IgA) : null,
        IgM: IgM !== '' ? parseFloat(IgM) : null,
        IgG: IgG !== '' ? parseFloat(IgG) : null,
        IgG1: IgG1 !== '' ? parseFloat(IgG1) : null,
        IgG2: IgG2 !== '' ? parseFloat(IgG2) : null,
        IgG3: IgG3 !== '' ? parseFloat(IgG3) : null,
        IgG4: IgG4 !== '' ? parseFloat(IgG4) : null,
        date: new Date().toISOString(),
      };

      const reportsCollectionRef = collection(patientDocRef, 'reports');
      await addDoc(reportsCollectionRef, reportData);

      Alert.alert('Başarılı', 'Tahlil bilgisi başarıyla eklendi.');
      setPatientNumber('');
      setIgA('');
      setIgM('');
      setIgG('');
      setIgG1('');
      setIgG2('');
      setIgG3('');
      setIgG4('');
    } catch (error) {
      Alert.alert('Hata', 'Tahlil bilgisi eklenirken bir sorun oluştu: ' + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Avatar.Icon size={100} icon="test-tube" style={styles.avatar} />
        <Text style={styles.title}>Tahlil Ekle</Text>
        <TextInput
          mode="outlined"
          label="Hasta Numarası"
          value={patientNumber}
          onChangeText={setPatientNumber}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          mode="outlined"
          label="IgA"
          value={IgA}
          onChangeText={setIgA}
          style={styles.input}
          keyboardType="numeric"
          placeholder="IgA değeri"
          theme={{ colors: { placeholder: '#B71C1C', primary: '#B71C1C' } }}
        />
        <TextInput
          mode="outlined"
          label="IgM"
          value={IgM}
          onChangeText={setIgM}
          style={styles.input}
          keyboardType="numeric"
          placeholder="IgM değeri"
          theme={{ colors: { placeholder: '#B71C1C', primary: '#B71C1C' } }}
        />
        <TextInput
          mode="outlined"
          label="IgG"
          value={IgG}
          onChangeText={setIgG}
          style={styles.input}
          keyboardType="numeric"
          placeholder="IgG değeri"
          theme={{ colors: { placeholder: '#B71C1C', primary: '#B71C1C' } }}
        />
        <TextInput
          mode="outlined"
          label="IgG1"
          value={IgG1}
          onChangeText={setIgG1}
          style={styles.input}
          keyboardType="numeric"
          placeholder="IgG1 değeri"
          theme={{ colors: { placeholder: '#B71C1C', primary: '#B71C1C' } }}
        />
        <TextInput
          mode="outlined"
          label="IgG2"
          value={IgG2}
          onChangeText={setIgG2}
          style={styles.input}
          keyboardType="numeric"
          placeholder="IgG2 değeri"
          theme={{ colors: { placeholder: '#B71C1C', primary: '#B71C1C' } }}
        />
        <TextInput
          mode="outlined"
          label="IgG3"
          value={IgG3}
          onChangeText={setIgG3}
          style={styles.input}
          keyboardType="numeric"
          placeholder="IgG3 değeri"
          theme={{ colors: { placeholder: '#B71C1C', primary: '#B71C1C' } }}
        />
        <TextInput
          mode="outlined"
          label="IgG4"
          value={IgG4}
          onChangeText={setIgG4}
          style={styles.input}
          keyboardType="numeric"
          placeholder="IgG4 değeri"
          theme={{ colors: { placeholder: '#B71C1C', primary: '#B71C1C' } }}
        />
        <Button
          mode="contained"
          onPress={handleAddReport}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Tahlil Ekle
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#80CBC4',
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
    backgroundColor: '#00796B',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default AddReport;