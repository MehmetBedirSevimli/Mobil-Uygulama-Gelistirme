import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Text,
} from "react-native";
import { TextInput, Button, Avatar } from "react-native-paper";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";

const AddGuide = () => {
  const [guideName, setGuideName] = useState(""); // Kılavuz adı
  const [ageRange, setAgeRange] = useState({ minYas: "", maxYas: "" }); // Yaş aralığı
  const initialIgValues = {
    min: "",
    max: "",
    minGeo: "",
    maxGeo: "",
    minMean: "",
    maxMean: "",
    minConfidence: "",
    maxConfidence: "",
  };
  const [igValues, setIgValues] = useState({
    IgA: { ...initialIgValues },
    IgM: { ...initialIgValues },
    IgG: { ...initialIgValues },
    IgG1: { ...initialIgValues },
    IgG2: { ...initialIgValues },
    IgG3: { ...initialIgValues },
    IgG4: { ...initialIgValues },
  });
  const [ageGroups, setAgeGroups] = useState({}); // Tüm yaş gruplarını tutar

  const handleInputChange = (igKey, field, value) => {
    setIgValues((prevState) => ({
      ...prevState,
      [igKey]: { ...prevState[igKey], [field]: value },
    }));
  };

  const handleAgeRangeChange = (field, value) => {
    setAgeRange((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleAddAgeGroup = async () => {
    if (!guideName.trim()) {
      Alert.alert("Hata", "Lütfen önce kılavuz adını girin.");
      return;
    }

    if (!ageRange.minYas || !ageRange.maxYas) {
      Alert.alert("Hata", "Yaş aralığı bilgilerini doldurun.");
      return;
    }

    const ageGroupKey = `${ageRange.minYas}-${ageRange.maxYas}`;
    const newAgeGroup = {
      ageRange: {
        minYas: Number(ageRange.minYas),
        maxYas: Number(ageRange.maxYas),
      },
      ...Object.fromEntries(
        Object.entries(igValues).map(([key, values]) => [
          key,
          Object.fromEntries(
            Object.entries(values).map(([field, value]) => [
              field,
              value === "" ? null : Number(value),
            ])
          ),
        ])
      ),
    };

    // Firestore'da güncelle
    try {
      const guideRef = doc(collection(firestore, "guides"), guideName.trim());

      // Kılavuz yoksa oluştur
      if (!Object.keys(ageGroups).length) {
        await setDoc(guideRef, {
          name: guideName.trim(),
          values: { [ageGroupKey]: newAgeGroup },
        });
      } else {
        // Kılavuz varsa sadece güncelle
        await updateDoc(guideRef, {
          [`values.${ageGroupKey}`]: newAgeGroup,
        });
      }

      Alert.alert("Başarılı", `Yaş grubu (${ageGroupKey}) eklendi.`);

      // State'e ekle
      setAgeGroups((prevState) => ({
        ...prevState,
        [ageGroupKey]: newAgeGroup,
      }));

      // Alanları sıfırla
      setAgeRange({ minYas: "", maxYas: "" });
      setIgValues({
        IgA: { ...initialIgValues },
        IgM: { ...initialIgValues },
        IgG: { ...initialIgValues },
        IgG1: { ...initialIgValues },
        IgG2: { ...initialIgValues },
        IgG3: { ...initialIgValues },
        IgG4: { ...initialIgValues },
      });
    } catch (error) {
      console.error("Hata:", error.message);
      Alert.alert("Hata", "Yaş grubu eklenirken bir sorun oluştu: " + error.message);
    }
  };

  const handleAddGuide = async () => {
    if (!guideName.trim()) {
      Alert.alert("Hata", "Lütfen kılavuz adını girin.");
      return;
    }

    if (!Object.keys(ageGroups).length) {
      Alert.alert("Hata", "Lütfen en az bir yaş grubu ekleyin.");
      return;
    }

    const guideData = {
      name: guideName.trim(),
      values: ageGroups,
    };

    try {
      const guideRef = doc(collection(firestore, "guides"), guideName.trim());
      await setDoc(guideRef, guideData);

      Alert.alert("Başarılı", "Kılavuz başarıyla kaydedildi.");
      setGuideName(""); // Form sıfırlama
      setAgeGroups({});
    } catch (error) {
      console.error("Hata:", error.message);
      Alert.alert("Hata", "Kılavuz eklenirken bir sorun oluştu: " + error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconContainer}>
          <Avatar.Icon size={100} icon="book-plus" style={styles.avatar} />
        </View>
        <TextInput
          mode="outlined"
          label="Kılavuz Adı"
          value={guideName}
          onChangeText={setGuideName}
          style={styles.input}
        />
        <View style={styles.card}>
          <Text style={styles.header}>Yaş Aralığı</Text>
          <TextInput
            mode="outlined"
            label="Yaş Min"
            value={ageRange.minYas}
            onChangeText={(value) => handleAgeRangeChange("minYas", value)}
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            mode="outlined"
            label="Yaş Max"
            value={ageRange.maxYas}
            onChangeText={(value) => handleAgeRangeChange("maxYas", value)}
            style={styles.input}
            keyboardType="numeric"
          />
          {Object.keys(igValues).map((igKey) => (
            <View key={igKey} style={styles.card}>
              <Text style={styles.igHeader}>{igKey} Değerleri</Text>
              {Object.keys(initialIgValues).map((field) => (
                <TextInput
                  key={field}
                  mode="outlined"
                  label={`${field}`}
                  value={igValues[igKey][field]}
                  onChangeText={(value) => handleInputChange(igKey, field, value)}
                  style={styles.input}
                  keyboardType="numeric"
                />
              ))}
            </View>
          ))}
          <Button
            mode="outlined"
            onPress={handleAddAgeGroup}
            style={styles.addButton}
          >
            Yaş Grubu Ekle
          </Button>
        </View>
        <Button mode="contained" onPress={handleAddGuide} style={styles.button}>
          Kılavuz Ekle
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#80CBC4",
  },
  scrollContent: {
    padding: 20,
  },
  avatar: {
    backgroundColor: "#B71C1C",
    marginBottom: 20,
    alignSelf: "center",
  },
  input: {
    marginBottom: 15,
  },
  card: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#B71C1C",
    borderRadius: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#00796B",
  },
  igHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#00796B",
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#B71C1C",
    marginTop: 10,
  },
});

export default AddGuide;
