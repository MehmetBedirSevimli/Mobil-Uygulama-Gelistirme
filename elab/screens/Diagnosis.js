import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, TextInput, Button, DataTable, Menu, Provider } from 'react-native-paper';

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

const ageOptions = [
  '0-1 Ay',
  '1-5 Ay',
  '6-8 Ay',
  '9-12 Ay',
  '13-24 Ay',
  '25-36 Ay',
  '37-48 Ay',
  '4-6 Yaş',
  '6-8 Yaş',
  '9-10 Yaş',
  '11-12 Yaş',
  '13-14 Yaş',
  '15-16 Yaş',
  '16+ Yaş',
];

const Diagnosis = () => {
  const [ageGroup, setAgeGroup] = useState('');
  const [IgA, setIgA] = useState('');
  const [IgM, setIgM] = useState('');
  const [IgG, setIgG] = useState('');
  const [IgG1, setIgG1] = useState('');
  const [IgG2, setIgG2] = useState('');
  const [IgG3, setIgG3] = useState('');
  const [IgG4, setIgG4] = useState('');
  const [results, setResults] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleDiagnosis = () => {
    if (!ageGroup) {
      Alert.alert('Hata', 'Lütfen yaş grubunu seçin.');
      return;
    }

    const inputValues = {
      IgA: IgA !== '' ? parseFloat(IgA) : null,
      IgM: IgM !== '' ? parseFloat(IgM) : null,
      IgG: IgG !== '' ? parseFloat(IgG) : null,
      IgG1: IgG1 !== '' ? parseFloat(IgG1) : null,
      IgG2: IgG2 !== '' ? parseFloat(IgG2) : null,
      IgG3: IgG3 !== '' ? parseFloat(IgG3) : null,
      IgG4: IgG4 !== '' ? parseFloat(IgG4) : null,
    };

    const diagnosisResults = [];
    for (const [test, value] of Object.entries(inputValues)) {
      if (value === null) {
        diagnosisResults.push({ test, value: 'Boş', result: 'Bilinmiyor', color: 'gray', range: '' });
        continue;
      }

      const [min, max] = ageGroupMinMax[ageGroup]?.[test] || [null, null];
      if (min === null || max === null) {
        diagnosisResults.push({ test, value, result: 'Bilinmiyor', color: 'gray', range: '' });
      } else if (value < min) {
        diagnosisResults.push({ test, value, result: 'Düşük  ', color: 'red', range: `  ${min} - ${max}` });
      } else if (value > max) {
        diagnosisResults.push({ test, value, result: 'Yüksek  ', color: 'green', range: ` ${min} - ${max}` });
      } else {
        diagnosisResults.push({ test, value, result: 'Normal  ', color: 'blue', range: `  ${min} - ${max}` });
      }
    }

    setResults(diagnosisResults);
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tanılama</Text>

        <View style={styles.menuContainer}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button mode="outlined" onPress={() => setMenuVisible(true)} style={styles.dropdown}>
                {ageGroup || 'Yaş Grubu Seçin'}
              </Button>
            }
          >
            {ageOptions.map((option, index) => (
              <Menu.Item
                key={index}
                onPress={() => {
                  setAgeGroup(option);
                  setMenuVisible(false);
                }}
                title={option}
              />
            ))}
          </Menu>
        </View>

        <TextInput mode="outlined" label="IgA" value={IgA} onChangeText={setIgA} style={styles.input} keyboardType="numeric" />
        <TextInput mode="outlined" label="IgM" value={IgM} onChangeText={setIgM} style={styles.input} keyboardType="numeric" />
        <TextInput mode="outlined" label="IgG" value={IgG} onChangeText={setIgG} style={styles.input} keyboardType="numeric" />
        <TextInput mode="outlined" label="IgG1" value={IgG1} onChangeText={setIgG1} style={styles.input} keyboardType="numeric" />
        <TextInput mode="outlined" label="IgG2" value={IgG2} onChangeText={setIgG2} style={styles.input} keyboardType="numeric" />
        <TextInput mode="outlined" label="IgG3" value={IgG3} onChangeText={setIgG3} style={styles.input} keyboardType="numeric" />
        <TextInput mode="outlined" label="IgG4" value={IgG4} onChangeText={setIgG4} style={styles.input} keyboardType="numeric" />

        <Button mode="contained" onPress={handleDiagnosis} style={styles.button}>
          Ara
        </Button>

        {results.length > 0 && (
          <View style={styles.tableContainer}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Tahlil</DataTable.Title>
                <DataTable.Title numeric>Değer</DataTable.Title>
                <DataTable.Title numeric>Sonuç</DataTable.Title>
                <DataTable.Title numeric>Referans</DataTable.Title>
              </DataTable.Header>
              {results.map(({ test, value, result, color, range }, index) => (
                <DataTable.Row key={index} style={styles.row}>
                  <DataTable.Cell>{test}</DataTable.Cell>
                  <DataTable.Cell numeric>{value}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={{ color }}>{result}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>{range}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </View>
        )}
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#80CBC4',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00796B',
    textAlign: 'center',
    marginBottom: 20,
  },
  menuContainer: {
    marginBottom: 15,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#00796B',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#00796B',
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },
  row: {
    backgroundColor: '#fff',
  },
});

export default Diagnosis;
