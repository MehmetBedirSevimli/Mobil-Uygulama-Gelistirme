import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, TextInput, Button, DataTable, Provider } from "react-native-paper";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";

const Diagnosis = () => {
  const [age, setAge] = useState("");
  const [IgA, setIgA] = useState("");
  const [IgM, setIgM] = useState("");
  const [IgG, setIgG] = useState("");
  const [IgG1, setIgG1] = useState("");
  const [IgG2, setIgG2] = useState("");
  const [IgG3, setIgG3] = useState("");
  const [IgG4, setIgG4] = useState("");
  const [guides, setGuides] = useState([]);
  const [results, setResults] = useState([]);

  // Firestore'dan guide verilerini çek
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const guideCollection = collection(firestore, "guides");
        const snapshot = await getDocs(guideCollection);
        const guideData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGuides(guideData);
      } catch (error) {
        console.error("Firestore verileri çekilirken hata oluştu:", error);
      }
    };

    fetchGuides();
  }, []);

  const handleDiagnosis = () => {
    if (!age) {
      Alert.alert("Hata", "Lütfen yaş değeri girin.");
      return;
    }
  
    const numericAge = parseFloat(age);
    const inputValues = {
      IgA: IgA !== "" ? parseFloat(IgA) : null,
      IgM: IgM !== "" ? parseFloat(IgM) : null,
      IgG: IgG !== "" ? parseFloat(IgG) : null,
      IgG1: IgG1 !== "" ? parseFloat(IgG1) : null,
      IgG2: IgG2 !== "" ? parseFloat(IgG2) : null,
      IgG3: IgG3 !== "" ? parseFloat(IgG3) : null,
      IgG4: IgG4 !== "" ? parseFloat(IgG4) : null,
    };
  
    const diagnosisResults = [];
  
    guides.forEach((guide) => {
      let selectedAgeGroup = null;
  
      // Yaş grubunu bul
      for (const [ageGroupKey, ageGroupData] of Object.entries(guide.values)) {
        const { minYas, maxYas } = ageGroupData.ageRange || {};
        if (numericAge >= minYas && numericAge <= maxYas) {
          selectedAgeGroup = ageGroupData;
          break;
        }
      }
  
      if (!selectedAgeGroup) {
        diagnosisResults.push({
          guideName: guide.name,
          ageRange: "Yaş Grubu Bulunamadı",
          message: "Bu kılavuzda yaşınıza uygun bir grup bulunamadı.",
          results: [],
        });
        return;
      }
  
      const resultsForGuide = [];
  
      // Tahlil değerlerini değerlendir
      Object.entries(inputValues).forEach(([test, value]) => {
        if (value === null || value === undefined || isNaN(value)) {
          resultsForGuide.push({
            test,
            value: "-",
            result: "-",
            color: "gray",
            range: "-",
            geoOrt: "-",
            ort: "-",
            confidence: "-",
          });
          return;
        }
      
        const testReference = selectedAgeGroup[test];
      
        // Referans aralığı kontrolü
        if (!testReference || testReference.min === undefined || testReference.max === undefined) {
          resultsForGuide.push({
            test,
            value,
            result: "-",
            color: "gray",
            range: "-",
            geoOrt: "-",
            ort: "-",
            confidence: "-",
          });
          return;
        }
      
        const { min, max, minGeo, maxGeo, minMean, maxMean, minConfidence, maxConfidence } = testReference;
      
        resultsForGuide.push({
          test,
          value,
          result:
            value < min
              ? "D"
              : value > max
              ? "Y"
              : "N",
          color: value < min ? "red" : value > max ? "green" : "blue",
          range: `${min || "-"} - ${max || "-"}`,
          geoOrt: `${minGeo || "-"} - ${maxGeo || "-"}`,
          ort: `${minMean || "-"} - ${maxMean || "-"}`,
          confidence: `${minConfidence || "-"} - ${maxConfidence || "-"}`,
        });
      });
      
  
      diagnosisResults.push({
        guideName: guide.name,
        ageRange: `${selectedAgeGroup.ageRange.minYas} - ${selectedAgeGroup.ageRange.maxYas}`,
        message: null,
        results: resultsForGuide,
      });
    });
  
    setResults(diagnosisResults);
  };
  

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tanılama</Text>

        <TextInput
          mode="outlined"
          label="Yaş"
          value={age}
          onChangeText={setAge}
          style={styles.input}
          keyboardType="numeric"
        />
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

        {results.map((guideResult, index) => (
          <View key={index} style={styles.tableContainer}>
            <Text style={styles.guideTitle}>
              {guideResult.guideName} - Yaş Grubu: {guideResult.ageRange}
            </Text>
            {guideResult.message ? (
              <Text style={styles.errorMessage}>{guideResult.message}</Text>
            ) : (
              <ScrollView horizontal>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title style={{ minWidth: 50 }}>Tahlil</DataTable.Title>
                  <DataTable.Title style={{ minWidth: 50 }} numeric>Değer</DataTable.Title>
                  <DataTable.Title style={{ minWidth: 50 }} numeric>Sonuç</DataTable.Title>
                  <DataTable.Title style={{ minWidth: 100 }} numeric>Referans</DataTable.Title>
                  <DataTable.Title style={{ minWidth: 100 }} numeric>GeoOrt</DataTable.Title>
                  <DataTable.Title style={{ minWidth: 100 }} numeric>Ort</DataTable.Title>
                  <DataTable.Title style={{ minWidth: 100 }} numeric>%95 Con</DataTable.Title>
                </DataTable.Header>
                {guideResult.results.map(
                  ({ test, value, result, color, range, geoOrt, ort, confidence }, index) => (
                    <DataTable.Row key={index} style={styles.row}>
                      <DataTable.Cell style={{ minWidth: 50 }}>{test}</DataTable.Cell>
                      <DataTable.Cell style={{ minWidth: 50 }} numeric>
                        {value !== null && value !== undefined ? value : "-"}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ minWidth: 50 }} numeric>
                        <Text style={{ color }}>{result !== null && result !== undefined ? result : "-"}</Text>
                      </DataTable.Cell>
                      <DataTable.Cell style={{ minWidth: 100 }} numeric>
                        {range && range !== "null - null" ? range : "-"}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ minWidth: 100 }} numeric>
                        {geoOrt && geoOrt !== "null - null" ? geoOrt : "-"}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ minWidth: 100 }} numeric>
                        {ort && ort !== "null - null" ? ort : "-"}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ minWidth: 100 }} numeric>
                        {confidence && confidence !== "null - null" ? confidence : "-"}
                      </DataTable.Cell>
                    </DataTable.Row>
                  )
                )}
              </DataTable>
            </ScrollView>
            
            
            

            )}
          </View>
        ))}
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#80CBC4",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00796B",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#00796B",
  },
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },
  guideTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 10,
  },
  errorMessage: {
    color: "red",
    fontSize: 16,
  },
  row: {
    backgroundColor: "#fff",
  },
});

export default Diagnosis;

