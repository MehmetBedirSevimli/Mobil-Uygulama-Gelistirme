import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import { Text, Button, Card, Avatar } from 'react-native-paper';
import { firestore } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const ListReport = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patientReports, setPatientReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    if (!firstName || !lastName) {
      Alert.alert('Hata', 'Lütfen Ad ve Soyad alanlarını doldurun.');
      return;
    }

    try {
      setLoading(true);

      const patientsCollection = collection(firestore, 'patients');
      const q = query(
        patientsCollection,
        where('firstName', '==', firstName),
        where('lastName', '==', lastName)
      );
      const patientSnapshot = await getDocs(q);

      if (patientSnapshot.empty) {
        Alert.alert('Hata', 'Bu bilgilere sahip bir hasta bulunamadı.');
        setLoading(false);
        return;
      }

      const patientData = patientSnapshot.docs[0].data();
      const patientNumber = patientData.patientNumber;

      const reportsCollection = collection(
        firestore,
        'patients',
        patientNumber,
        'reports'
      );
      const reportsQuery = query(reportsCollection, orderBy('date', 'desc'));
      const reportsSnapshot = await getDocs(reportsQuery);

      const reports = reportsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPatientReports(reports);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Hata', 'Tahliller getirilirken bir sorun oluştu: ' + error.message);
    }
  };

  const getTrend = (current, previous) => {
    if (current === null || previous === null) return null;
    if (current > previous) return { icon: '↑', color: 'green' };
    if (current < previous) return { icon: '↓', color: 'red' };
    return { icon: '↔', color: 'blue' };
  };

  const renderValue = (label, current, previous) => {
    if (previous === undefined) {
      return (
        <Text>
          {label}: {current !== null ? current : 'Boş'}
        </Text>
      );
    }

    const trend = getTrend(current, previous);
    return (
      <Text>
        {label}: {current !== null ? current : 'Boş'}{' '}
        {trend && (
          <Text style={{ color: trend.color, fontSize: 19, fontWeight: 'bold' }}>
            {trend.icon}
          </Text>
        )}
      </Text>
    );
  };

  const renderReport = ({ item, index }) => {
    const previousReport = patientReports[index + 1];
    return (
      <Card style={styles.card}>
        <Card.Title title={`Tarih: ${new Date(item.date).toLocaleDateString()}`} />
        <Card.Content>
          {renderValue('IgA', item.IgA, previousReport?.IgA)}
          {renderValue('IgM', item.IgM, previousReport?.IgM)}
          {renderValue('IgG', item.IgG, previousReport?.IgG)}
          {renderValue('IgG1', item.IgG1, previousReport?.IgG1)}
          {renderValue('IgG2', item.IgG2, previousReport?.IgG2)}
          {renderValue('IgG3', item.IgG3, previousReport?.IgG3)}
          {renderValue('IgG4', item.IgG4, previousReport?.IgG4)}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Avatar.Icon size={100} icon="clipboard-list" style={styles.avatar} />
      <Text style={styles.title}>Tahlil Listesi</Text>
      <TextInput
        mode="outlined"
        label="Ad"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
        placeholder="Hasta Adı"
      />
      <TextInput
        mode="outlined"
        label="Soyad"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
        placeholder="Hasta Soyadı"
      />
      <Button
        mode="contained"
        onPress={fetchReports}
        loading={loading}
        disabled={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonText}
      >
        Tahlilleri Getir
      </Button>
      <FlatList
        data={patientReports}
        renderItem={renderReport}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#80CBC4',
    alignItems: 'center',
    fontFamily: 'fantasy',

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#00796B',
    textAlign: 'center',
    fontFamily: 'fantasy',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
    fontFamily: 'fantasy',
    height: 50,
    width: '100%',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    margin: 10,
    backgroundColor: '#00796B',
  },
  buttonContent: {
    height: 50,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'fantasy',
    color: '#fff',
  },
  list: {
    paddingBottom: 20,
    fontFamily: 'fantasy',
  },
  card: {
    marginBottom: 15,
    backgroundColor: '#fff',
    fontFamily: 'fantasy',
  },
  avatar: {
    backgroundColor: '#B71C1C',
    marginBottom: 20,
    alignItems: 'center',
  },
});

export default ListReport;
