import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { useIsFocused } from '@react-navigation/native';
import { Alert } from 'react-native';
import { validateFields } from './constrain'

export const useEditClientLogic = (route, navigation) => {
    const { clientData } = route.params;
    const [editedClientData, setEditedClientData] = useState(clientData);
    const isFocused = useIsFocused();
  
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedDate] = useState(new Date());
  
    const [isDatePickerVisibleM, setDatePickerVisibleM] = useState(false);
    const [selectedDateM] = useState(new Date());
  
    //const dateArray = editedClientData.FECHA_INSTALACION.split('/');
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
      if (!auth().currentUser && isFocused) {
        navigation.navigate('LoginScreen');
        Alert.alert('Acceso denegado', 'Debes iniciar sesión para editar el cliente.');
      }
    }, [isFocused]);
  
    const saveChanges = () => {
      if (auth().currentUser) {
        // Guarda los cambios en la base de datos de Firebase
        if (validateFields(editedClientData)) {
            database()
            .ref(`/Cliente/${clientData.Id}`)
            .update(editedClientData)
            .then(() => {
                Alert.alert('Cambios guardados', 'Los cambios se guardaron exitosamente.');
                //navigation.goBack(); // Vuelve a la pantalla anterior
                navigation.navigate('FlatListScreen',{ refresh: true });
            })
            .catch((error) => {
                console.error('Error al guardar cambios:', error);
                Alert.alert('Error', 'Hubo un error al guardar los cambios. Por favor, inténtalo de nuevo.');
            });
        }
      } else {
        navigation.navigate('LoginScreen');
        Alert.alert('Acceso denegado', 'Debes iniciar sesión para editar el cliente.');
      }
    };

  return {
    editedClientData,
    formattedDate,
    formattedDateM,
    showDatePicker,
    showDatePickerM,
    saveChanges,
    isDatePickerVisible,
    isDatePickerVisibleM,
    selectedDate,
    selectedDateM,
    handleDateConfirm,
    handleDateConfirmM,
    setEditedClientData
  };
};
