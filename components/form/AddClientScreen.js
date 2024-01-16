import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown';
import { format } from 'date-fns';
import { useSaveClientLogic } from './useEditClientLogic'; // Importa la lógica

const AddClientScreen = ({ route, navigation }) => {

  const {
    editedClientData,
    formattedDate,
    showDatePicker,
    hideDatePicker,
    handleDateConfirm,
    saveChanges,
    isDatePickerVisible,
    selectedDate,
    setEditedClientData,
    handleDateConfirmM,
    showDatePickerM,
    formattedDateM,
    isDatePickerVisibleM,
    selectedDateM,
  } = useSaveClientLogic({}, navigation); // Pasa datos iniciales vacíos

  const days = [
    { label: '0 días', value: 0 },
    { label: '1 día', value: 1 },
    { label: '2 días', value: 2 },
    { label: '5 días', value: 5 },
  ];

  const [daysBeforeMaintenance, setDaysBeforeMaintenance] = useState(1);

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Crear Cliente</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Nombre del Cliente:</Text>
          <TextInput
            style={styles.input}
            value={editedClientData.CLIENTE}
            onChangeText={(text) => setEditedClientData({ ...editedClientData, CLIENTE: text })}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Tipo de Filtro:</Text>
          <TextInput
            style={styles.input}
            value={editedClientData.TIPO_FILTRO}
            onChangeText={(text) => setEditedClientData({ ...editedClientData, TIPO_FILTRO: text })}
          />
        </View>

        <View style={styles.fieldContainer}>
        <Text style={styles.label}>Celular o Dirección:</Text>
        <TextInput
          style={styles.input}
          value={editedClientData.CELULAR_DIRECCION ? editedClientData.CELULAR_DIRECCION.toString() : ''}
          onChangeText={(text) => setEditedClientData({ ...editedClientData, CELULAR_DIRECCION: text })}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Teléfono de WhatsApp:</Text>
        <TextInput
          style={styles.input}
          value={editedClientData.Telefono_WhatsApp ? editedClientData.Telefono_WhatsApp.toString(): ''}
          onChangeText={(text) => setEditedClientData({ ...editedClientData, Telefono_WhatsApp: text })}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Detalles:</Text>
        <TextInput
          style={styles.input}
          value={editedClientData.DETALLE}
          onChangeText={(text) => setEditedClientData({ ...editedClientData, DETALLE: text })}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Fecha de Instalación:</Text>
        <Text style={styles.input} onPress={showDatePicker}>
        {formattedDate != '' ? format(formattedDate, 'MM/dd/yyyy'): ''}
        </Text>
      </View>

      {isDatePickerVisible && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => handleDateConfirm(date)}
        />
      )}

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Fecha de Mantenimiento:</Text>
        <Text
          style={styles.input}
          onPress={showDatePickerM}
        >
          {formattedDateM != '' ? format(formattedDateM, 'MM/dd/yyyy') : ''}
        </Text>
      </View>

      {isDatePickerVisibleM && (
        <DateTimePicker
          value={selectedDateM}
          mode="date"
          display="default"
          onChange={(event, dateM) => handleDateConfirmM(dateM)}
        />
      )}

  <View style={styles.fieldContainer}>
    <Text style={styles.label}>Días Previos a Mantenimiento (Notificación):</Text>
    <SelectDropdown
      style={styles.input}
      data={days}
      defaultValue={days[0]} // Establece el valor predeterminado al primer elemento del array
      onSelect={(selectedItem, index) => {
        const selectedValue = selectedItem.value;
        setEditedClientData({ ...editedClientData, daysBeforeMaintenance: selectedValue });
        setDaysBeforeMaintenance(selectedValue);
      }}
      buttonTextAfterSelection={(selectedItem, index) => {
        return selectedItem.label; // Aseguramos que el texto mostrado sea la etiqueta (label)
      }}
      rowTextForSelection={(item, index) => item.label} // También aseguramos que el texto de cada opción sea la etiqueta (label)
    />
  </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Número de Cuotas:</Text>
        <TextInput
          style={styles.input}
          value={editedClientData.Cuotas ? editedClientData.Cuotas.toString() : ''} // Convierte el valor a cadena
          onChangeText={(text) => {
            if (/^\d+$/.test(text)) { // Asegura que solo se ingresen números
              setEditedClientData({ ...editedClientData, Cuotas: text });
            }
          }}
          keyboardType="numeric" // Muestra el teclado numérico
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Valor del Filtro:</Text>
        <TextInput
          style={styles.input}
          value={editedClientData.VALOR_FILTRO ? editedClientData.VALOR_FILTRO.toString() : ''}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) {
              // Verifica si el texto es una cadena que contiene solo dígitos
              setEditedClientData({ ...editedClientData, VALOR_FILTRO: text });
            }
          }}
          keyboardType="numeric"
        />
      </View>

        <Button title="Guardar Cliente" onPress={saveChanges} />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
  },
});


export default AddClientScreen;