import { Alert } from 'react-native';

export const validateFields = (editedClientData) => {
    if (!editedClientData.CLIENTE) {
      Alert.alert('Campo requerido', 'El campo CLIENTE es obligatorio.');
      return false;
    }
    
    if (!editedClientData.Fecha_Mantenimiento) {
        Alert.alert('Campo requerido', 'El campo Fecha Mantenimiento es obligatorio.');
        return false;
    }
    
    if (!editedClientData.FECHA_INSTALACION) {
        Alert.alert('Campo requerido', 'El campo Fecha Instalación es obligatorio.');
        return false;
    }

    if (!editedClientData.TIPO_FILTRO || editedClientData.TIPO_FILTRO == "" || editedClientData.TIPO_FILTRO == undefined) {
        Alert.alert('Campo requerido', 'El campo Tipo Filtro es obligatorio.');
        return false;
    }

    return true;
};