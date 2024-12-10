// DatePickerModal.js
import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const DatePickerModal = ({ isVisible, onClose, onDateChange }) => {
  // Get today's date and set the minimum date to one day before today
  const today = new Date();
  today.setDate(today.getDate() - 1);

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    onDateChange(date); // Pass the selected date to the parent
    onClose(); // Close the modal after selection
  };

  return (
    <View>
      <DateTimePickerModal
        isVisible={isVisible}
        mode="date" // Display date picker mode only
        onConfirm={handleConfirm}
        onCancel={onClose} // Close the modal when cancelled
        maximumDate={today} // Only allow dates before today
      />
    </View>
  );
};

export default DatePickerModal;
