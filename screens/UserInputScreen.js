import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";

const UserInputScreen = ({ route }) => {
  const { formData } = route.params;

  console.log("Form data received:", formData);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.resultContainer}>
        <Text style={styles.resultHeader}>Submitted Data:</Text>
        {formData && Object.keys(formData).map((key, index) => {
          const value = formData[key];
          // Check if the value is a Date object and format it
          const displayValue = value instanceof Date ? value.toLocaleDateString() : value;

          return (
            <View key={index} style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>{key}:</Text>
              <Text style={styles.fieldValue}>{displayValue}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  resultHeader: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  fieldContainer: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  fieldValue: {
    fontSize: 16,
    color: "#444",
  },
});

export default UserInputScreen;
