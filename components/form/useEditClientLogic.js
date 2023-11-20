import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { useIsFocused } from '@react-navigation/native';
import { Alert } from 'react-native';
import { validateFields } from './constrain'

export const useSaveClientLogic = (initialClientData, navigation) => {
  const [editedClientData, setEditedClientData] = useState(initialClientData);
  const isFocused = useIsFocused();

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate] = useState(new Date());

  const [isDatePickerVisibleM, setDatePickerVisibleM] = useState(false);
  const [selectedDateM] = useState(new Date());
  
  const dateArray = editedClientData.FECHA_INSTALACION ? editedClientData.FECHA_INSTALACION.split('/') : '';
  const formattedDate = dateArray != '' ? new Date(
    parseInt(dateArray[2]), // Año
    parseInt(dateArray[0]) - 1, // Mes (restamos 1 porque los meses en JavaScript son 0-indexados)
    parseInt(dateArray[1]) // Día
  ): '';

  const dateArrayM = editedClientData.Fecha_Mantenimiento ? editedClientData.Fecha_Mantenimiento.split('/') : '';
  const formattedDateM = dateArrayM != '' ? new Date(
    parseInt(dateArrayM[2]), // Año
    parseInt(dateArrayM[0]) - 1, // Mes (restamos 1 porque los meses en JavaScript son 0-indexados)
    parseInt(dateArrayM[1]) // Día
  ): '';

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const showDatePickerM = () => {
    setDatePickerVisibleM(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const hideDatePickerM = () => {
    setDatePickerVisibleM(false);
  };

  const handleDateConfirm = (date) => {
    hideDatePicker();
    if (date && !isNaN(date)) {
      const formattedDateString = `${
        date.getMonth() + 1
      }/${date.getDate()}/${date.getFullYear()}`;
      setEditedClientData({ ...editedClientData, FECHA_INSTALACION: formattedDateString });
    } else {
      Alert.alert('Fecha no válida', 'Selecciona una fecha válida.');
    }
  };

  const handleDateConfirmM = (dateM) => {
    hideDatePickerM();
    if (dateM && !isNaN(dateM)) {
      const formattedDateStringM = `${
        dateM.getMonth() + 1
      }/${dateM.getDate()}/${dateM.getFullYear()}`;
      setEditedClientData({ ...editedClientData, Fecha_Mantenimiento: formattedDateStringM });
    } else {
      Alert.alert('Fecha no válida', 'Selecciona una fecha válida.');
    }
  };
  

  useEffect(() => {
    // Verifica si el usuario está autenticado y la pantalla está enfocada
    if (!auth().currentUser && isFocused) {
      navigation.navigate('LoginScreen');
      Alert.alert('Acceso denegado', 'Debes iniciar sesión para crear el cliente.');
    }
  }, [isFocused]);

  const saveChanges = async () => {
    if (auth().currentUser) {
      // Obtén el último ID numérico de la colección
      if (validateFields(editedClientData)) {
        const lastClientIdSnapshot = await database()
          .ref('/Cliente')
          .orderByKey()
          .limitToLast(1)
          .once('value');
    
        let lastClientId = 0;
    
        if (lastClientIdSnapshot.exists()) {
          const lastClientIdData = lastClientIdSnapshot.val();
          // Extrae el número del último ID
          const lastClientIdString = Object.keys(lastClientIdData)[0];
          lastClientId = parseInt(lastClientIdString, 10);
        }
    
        // Incrementa el ID para el nuevo elemento
        const newClientId = lastClientId + 1;
    
        // Actualiza el objeto con el nuevo ID antes de guardarlo
        editedClientData.Id = newClientId.toString();
    
        // Guarda los datos en la ubicación del nuevo elemento
        database()
          .ref(`/Cliente/${newClientId}`)
          .set(editedClientData)
          .then(() => {
            Alert.alert('Cambios guardados', 'Los cambios se guardaron exitosamente.');
            navigation.navigate('FlatListScreen', { refresh: true });
          })
          .catch((error) => {
            console.error('Error al guardar cambios:', error);
            Alert.alert('Error', 'Hubo un error al guardar los cambios. Por favor, inténtalo de nuevo.');
          });
      } 
    }
    else {
      navigation.navigate('LoginScreen');
      Alert.alert('Acceso denegado', 'Debes iniciar sesión para crear el cliente.');
    }
  };
  
  

  return {
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
  };
};
