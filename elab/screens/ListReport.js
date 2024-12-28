import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { Text, Button, Avatar, Card, DataTable } from 'react-native-paper';
import { firestore } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const ageGroupMinMax = {
  '0-1 Ay': {
    IgG: [49.2, 119.0],
    IgA: [0.5, 0.58],
    IgM: [1.73, 2.96],
    IgG1: [43.0, 89.7],
    IgG2: [8.7, 26.3],
    IgG3: [1.8, 7.8],
    IgG4: [1.7, 8.1],
  },
  '1-5 Ay': {
    IgG: [27.0, 79.2],
    IgA: [0.58, 5.8],
    IgM: [1.84, 14.5],
    IgG1: [16.0, 57.4],
    IgG2: [3.2, 10.8],
    IgG3: [1.3, 5.3],
    IgG4: [0.2, 4.8],
  },
  '6-8 Ay': {
    IgG: [26.8, 89.8],
    IgA: [0.58, 8.58],
    IgM: [2.64, 14.6],
    IgG1: [27.9, 82.0],
    IgG2: [3.6, 14.6],
    IgG3: [1.4, 10.0],
    IgG4: [0.2, 5.2],
  },
  '9-12 Ay': {
    IgG: [42.1, 110.0],
    IgA: [1.84, 15.4],
    IgM: [2.35, 18.0],
    IgG1: [32.8, 125.0],
    IgG2: [2.5, 16.1],
    IgG3: [1.8, 11.0],
    IgG4: [0.2, 2.0],
  },
  '13-24 Ay': {
    IgG: [36.5, 120.0],
    IgA: [1.15, 9.43],
    IgM: [2.56, 20.1],
    IgG1: [34.4, 143.5],
    IgG2: [3.1, 26.4],
    IgG3: [1.6, 13.2],
    IgG4: [0.2, 9.9],
  },
  '25-36 Ay': {
    IgG: [43.0, 129.0],
    IgA: [2.3, 13.0],
    IgM: [3.6, 19.9],
    IgG1: [34.0, 147.0],
    IgG2: [4.3, 38.0],
    IgG3: [1.4, 12.5],
    IgG4: [0.2, 17.1],
  },
  '37-48 Ay': {
    IgG: [53.9, 129.0],
    IgA: [4.07, 11.5],
    IgM: [2.61, 18.8],
    IgG1: [43.9, 133.3],
    IgG2: [6.0, 41.0],
    IgG3: [1.5, 12.0],
    IgG4: [0.4, 18.5],
  },
  '4-6 Yaş': {
    IgG: [52.8, 149.0],
    IgA: [2.3, 20.51],
    IgM: [3.33, 20.7],
    IgG1: [46.8, 133.3],
    IgG2: [8.5, 44.0],
    IgG3: [1.5, 10.7],
    IgG4: [0.8, 22.7],
  },
  '6-8 Yaş': {
    IgG: [52.7, 159.0],
    IgA: [3.61, 26.8],
    IgM: [3.05, 22.0],
    IgG1: [42.0, 147.0],
    IgG2: [6.7, 46.0],
    IgG3: [2.1, 18.6],
    IgG4: [0.2, 19.8],
  },
  '9-10 Yaş': {
    IgG: [64.6, 162.0],
    IgA: [5.4, 26.8],
    IgM: [3.37, 25.7],
    IgG1: [38.0, 184.0],
    IgG2: [7.0, 54.3],
    IgG3: [2.0, 18.6],
    IgG4: [0.5, 20.2],
  },
  '11-12 Yaş': {
    IgG: [57.9, 161.0],
    IgA: [2.7, 19.8],
    IgM: [3.0, 18.7],
    IgG1: [59.9, 156.0],
    IgG2: [11.1, 51.5],
    IgG3: [2.9, 20.0],
    IgG4: [0.4, 16.0],
  },
  '13-14 Yaş': {
    IgG: [74.1, 165.0],
    IgA: [5.24, 22.5],
    IgM: [4.4, 20.6],
    IgG1: [49.0, 156.0],
    IgG2: [10.0, 57.3],
    IgG3: [2.8, 22.3],
    IgG4: [1.0, 14.4],
  },
  '15-16 Yaş': {
    IgG: [66.6, 137.0],
    IgA: [4.8, 15.8],
    IgM: [3.3, 20.5],
    IgG1: [49.8, 146.0],
    IgG2: [11.0, 39.8],
    IgG3: [3.0, 12.0],
    IgG4: [0.9, 18.7],
  },
  '16+ Yaş': {
    IgG: [83.0, 182.0],
    IgA: [4.65, 22.1],
    IgM: [7.5, 19.85],
    IgG1: [52.8, 138.4],
    IgG2: [14.7, 61.0],
    IgG3: [2.1, 15.2],
    IgG4: [1.5, 20.2],
  },
};

const ListReport = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patientReports, setPatientReports] = useState([]);
  const [ageGroup, setAgeGroup] = useState('');
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
      setAgeGroup(patientData.age); // Hasta yaş grubunu al
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

  const checkValueStatus = (testName, value) => {
    if (!ageGroup || value === undefined || value === null)
      return { status: ' ', color: 'gray' };

    const [min, max] = ageGroupMinMax[ageGroup]?.[testName] || [null, null];
    if (min === null || max === null) return { status: ' ', color: 'gray' };

    if (value < min) return { status: '       Düşük', color: 'red' };
    if (value > max) return { status: '       Yüksek', color: 'green' };
    return { status: '       Normal', color: 'blue' };
  };

  const getTrendIcon = (current, previous) => {
    if (current === undefined || previous === undefined) return null;
    if (current > previous) return { icon: '       ↑', color: 'green' };
    if (current < previous) return { icon: '       ↓', color: 'red' };
    return { icon: '       ↔', color: 'blue' };
  };

  const renderReportCard = (report, index) => {
    const previousReport = patientReports[index + 1]; // Bir önceki raporu al
  
    return (
      <Card style={styles.card} key={report.id}>
        <Card.Title title={`Tarih: ${new Date(report.date).toLocaleDateString()}`} />
        <Card.Content>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={styles.smallCell}>Tahlil</DataTable.Title>
              <DataTable.Title numeric style={styles.smallCell}>Sonuç</DataTable.Title>
              <DataTable.Title style={styles.smallCell}>Durum</DataTable.Title>
              <DataTable.Title numeric style={styles.mediumCell}>Referans</DataTable.Title>
              <DataTable.Title numeric style={styles.smallCell}>Trend</DataTable.Title>
            </DataTable.Header>
            {['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4'].map((test) => {
              const value = report[test];
              const previousValue = previousReport?.[test];
              const { status, color } = checkValueStatus(test, value);
  
              const trend = getTrendIcon(value, previousValue);
  
              // Referans aralığını getir
              const [min, max] = ageGroupMinMax[ageGroup]?.[test] || [null, null];
              const referenceRange =
                min !== null && max !== null ? `${min}-${max}` : 'Yok';
  
              if (value === undefined || value === null) {
                return (
                  <DataTable.Row key={test}>
                    <DataTable.Cell style={styles.smallCell}>{test}</DataTable.Cell>
                    <DataTable.Cell numeric style={styles.smallCell}>{'Boş'}</DataTable.Cell>
                    <DataTable.Cell style={styles.smallCell} />
                    <DataTable.Cell numeric style={styles.mediumCell}>{referenceRange}</DataTable.Cell>
                    <DataTable.Cell style={styles.smallCell} />
                  </DataTable.Row>
                );
              }
  
              return (
                <DataTable.Row key={test}>
                  <DataTable.Cell style={styles.smallCell}>{test}</DataTable.Cell>
                  <DataTable.Cell numeric style={styles.smallCell}>{value}</DataTable.Cell>
                  <DataTable.Cell style={styles.smallCell}>
                    <Text style={{ color }}>{status}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric style={styles.mediumCell}>{referenceRange}</DataTable.Cell>
                  <DataTable.Cell style={styles.smallCell}>
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
        onPress={fetchReports}
        loading={loading}
        disabled={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonText}
      >
        Tahlilleri Getir
      </Button>

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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00796B',
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#fff',
    height: 40,
    width: '90%',
    alignSelf: 'center',
    fontSize: 14,
    paddingHorizontal: 8,
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#00796B',
    width: '90%',
    alignSelf: 'center',
    height: 40,
    justifyContent: 'center',
  },
  buttonContent: {
    height: 40,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    marginBottom: 8,
    marginHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 8,
  },
  avatar: {
    backgroundColor: '#B71C1C',
    marginBottom: 8,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9e9e9e',
    marginTop: 10,
  },
  smallCell: {
    flex: 1,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediumCell: {
    flex: 1.5,
    paddingHorizontal: 6,
  },
  table: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 4,
    marginVertical: 5,
  },
});



export default ListReport;
