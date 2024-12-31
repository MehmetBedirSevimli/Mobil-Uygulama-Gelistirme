import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, Avatar, Card, DataTable } from 'react-native-paper';
import { firestore } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const ListReport = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [patientReports, setPatientReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPatientData = async () => {
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
        Alert.alert('Hata', 'Bu ad ve soyada sahip bir hasta bulunamadı.');
        setLoading(false);
        return;
      }

      const patient = patientSnapshot.docs[0].data();
      const patientNumber = patient.patientNumber;

      setPatientData(patient);

      const reportsCollection = collection(
        firestore,
        'patients',
        patientNumber,
        'reports'
      );
      const reportsQuery = query(reportsCollection, orderBy('testRequestTime', 'desc'));
      const reportsSnapshot = await getDocs(reportsQuery);

      if (reportsSnapshot.empty) {
        Alert.alert('Bilgi', 'Bu hasta için tahlil bulunamadı.');
        setPatientReports([]);
        setLoading(false);
        return;
      }

      const reports = reportsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          testRequestTime: data.testRequestTime?.toDate?.() || null,
        };
      });

      setPatientReports(reports);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Hata', 'Bilgiler getirilirken bir sorun oluştu: ' + error.message);
    }
  };

  const getTrendIcon = (current, previous) => {
    if (previous === undefined || previous === null || current === undefined || current === null)
      return null;
    if (current > previous) return { icon: '↑', color: 'green' };
    if (current < previous) return { icon: '↓', color: 'red' };
    return { icon: '↔', color: 'blue' };
  };

  const renderReportCard = (report, index) => {
    const nextReport = index < patientReports.length - 1 ? patientReports[index + 1] : null;

    return (
      <Card style={styles.card} key={report.id}>
        <Card.Title
          title={`Rapor Tarihi: ${
            report.testRequestTime ? report.testRequestTime.toLocaleDateString() : '-'
          }`}
          subtitle={`Rapor Grubu: ${report.reportGroup || '-'}`}
        />
        <Card.Content>
          <ScrollView horizontal>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={styles.tableHeader}>Tahlil</DataTable.Title>
                <DataTable.Title style={styles.tableHeader} numeric>
                  Sonuç
                </DataTable.Title>
                <DataTable.Title style={styles.tableHeader} numeric>
                  Trend
                </DataTable.Title>
              </DataTable.Header>
              {['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4'].map((test) => {
                const value = report[test];
                const nextValue = nextReport?.[test];
                const trend =
                  nextValue !== undefined && nextValue !== null ? getTrendIcon(value, nextValue) : null;

                return (
                  <DataTable.Row key={test} style={styles.tableRow}>
                    <DataTable.Cell style={styles.tableCell}>{test}</DataTable.Cell>
                    <DataTable.Cell style={styles.tableCell} numeric>
                      {value ?? '-'}
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.tableCell} numeric>
                      {trend && (
                        <Text style={{ color: trend.color, fontSize: 16, fontWeight: 'bold' }}>
                          {trend.icon}
                        </Text>
                      )}
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              })}
            </DataTable>
          </ScrollView>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon size={100} icon="clipboard-list" style={styles.avatar} />
        <Text style={styles.title}>Tahlil Listesi</Text>
      </View>

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
        onPress={fetchPatientData}
        loading={loading}
        disabled={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonText}
      >
        Tahlilleri Getir
      </Button>

      {patientData && (
        <Card style={styles.patientCard}>
          <Card.Title title="Hasta Bilgileri" />
          <Card.Content>
            <Text>Ad: {patientData.firstName}</Text>
            <Text>Soyad: {patientData.lastName}</Text>
            <Text>Doğum Tarihi: {new Date(patientData.birthDate).toLocaleDateString()}</Text>
            <Text>Yaş: {patientData.age} ay</Text>
            <Text>Email: {patientData.email}</Text>
            <Text>Cinsiyet: {patientData.gender}</Text>
            <Text>Hasta Numarası: {patientData.patientNumber}</Text>
          </Card.Content>
        </Card>
      )}

      {patientReports.length > 0 ? (
        <View>{patientReports.map(renderReportCard)}</View>
      ) : (
        <Text style={styles.noDataText}>Henüz tahlil bulunamadı.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#80CBC4',
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796B',
  },
  input: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: 10,
    marginHorizontal: 16,
    backgroundColor: '#00796B',
  },
  buttonContent: {
    height: 48,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    marginVertical: 12, // Kartlar arası boşluk
    marginHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  patientCard: {
    marginVertical: 10,
    marginHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  avatar: {
    backgroundColor: '#B71C1C',
    marginBottom: 16,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#B71C1C',
    marginTop: 20,
  },
  tableHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    borderRadius: 5,
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
  },
  tableCell: {
    textAlign: 'center',
    minWidth: 100,
  },
});

export default ListReport;
