import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Card, Avatar, DataTable } from "react-native-paper";
import { auth, firestore } from "../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

const PastReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    fetchPatientReports();
  }, []);

  const fetchPatientReports = async () => {
    setLoading(true);
    try {
      const userEmail = auth.currentUser?.email;
      if (!userEmail) {
        Alert.alert("Hata", "Oturum açmış bir kullanıcı bulunamadı.");
        setLoading(false);
        return;
      }

      const patientsRef = collection(firestore, "patients");
      const patientQuery = query(patientsRef, where("email", "==", userEmail));
      const patientSnapshot = await getDocs(patientQuery);

      if (patientSnapshot.empty) {
        Alert.alert("Hata", "E-posta adresinizle eşleşen bir hasta bulunamadı.");
        setLoading(false);
        return;
      }

      const patient = patientSnapshot.docs[0].data();
      const patientNumber = patient.patientNumber;

      setPatientData(patient);

      const reportsRef = collection(firestore, "patients", patientNumber, "reports");
      const reportsQuery = query(reportsRef, orderBy("testRequestTime", "desc"));
      const reportsSnapshot = await getDocs(reportsQuery);

      const reportsList = reportsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          testRequestTime: data.testRequestTime?.toDate?.() || null,
        };
      });

      setReports(reportsList);
    } catch (error) {
      console.error("Hata:", error.message);
      Alert.alert("Hata", "Tahlil bilgileri alınırken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (current, previous) => {
    if (previous === undefined || previous === null || current === undefined || current === null)
      return null;
    if (current > previous) return { icon: "↑", color: "green" };
    if (current < previous) return { icon: "↓", color: "red" };
    return { icon: "↔", color: "blue" };
  };

  const renderReportCard = (report, index) => {
    const nextReport = index < reports.length - 1 ? reports[index + 1] : null;

    return (
      <Card style={styles.card} key={report.id}>
        <Card.Title
          title={`Rapor Tarihi: ${
            report.testRequestTime ? report.testRequestTime.toLocaleDateString() : "-"
          }`}
          subtitle={`Rapor Grubu: ${report.reportGroup || "-"}`}
          left={(props) => <Avatar.Icon {...props} icon="file-document" style={styles.avatar} />}
        />
        <Card.Content>
          <ScrollView horizontal>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={[styles.tableHeader, styles.columnTest]}>Tahlil</DataTable.Title>
                <DataTable.Title style={[styles.tableHeader, styles.columnValue]} numeric>
                  Sonuç
                </DataTable.Title>
                <DataTable.Title style={[styles.tableHeader, styles.columnTrend]} numeric>
                  Trend
                </DataTable.Title>
              </DataTable.Header>
              {["IgA", "IgM", "IgG", "IgG1", "IgG2", "IgG3", "IgG4"].map((test) => {
                const value = report[test];
                const nextValue = nextReport?.[test];
                const trend =
                  nextValue !== undefined && nextValue !== null ? getTrendIcon(value, nextValue) : null;

                return (
                  <DataTable.Row key={test} style={styles.tableRow}>
                    <DataTable.Cell style={styles.columnTest}>{test}</DataTable.Cell>
                    <DataTable.Cell style={styles.columnValue} numeric>
                      {value ?? "-"}
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.columnTrend} numeric>
                      {trend && (
                        <Text style={{ color: trend.color, fontSize: 16, fontWeight: "bold" }}>
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
      <Text style={styles.title}>Geçmiş Tahliller</Text>
      {loading ? (
        <Text>Yükleniyor...</Text>
      ) : (
        <View>
          {patientData && (
            <Card style={styles.patientCard}>
              <Card.Title title="Bilgilerim" />
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
          {reports.length > 0 ? (
            reports.map((report, index) => renderReportCard(report, index))
          ) : (
            <Text style={styles.noDataText}>Henüz tahlil bulunamadı.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#80CBC4",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00796B",
    textAlign: "center",
    marginVertical: 20,
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  patientCard: {
    marginVertical: 10,
    marginHorizontal: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  avatar: {
    backgroundColor: "#00796B",
  },
  tableHeader: {
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
  },
  columnTest: {
    width: 100,
    textAlign: "left",
  },
  columnValue: {
    width: 80,
    textAlign: "right",
  },
  columnTrend: {
    width: 80,
    textAlign: "center",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#B71C1C",
    marginTop: 20,
  },
});

export default PastReports;
