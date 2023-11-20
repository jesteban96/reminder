import React, { useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation para acceder a la navegación

const NavigationHeader = ({ onSearch, onLogout}) => {
    const [searchText, setSearchText] = useState('');
    const navigation = useNavigation();

    const handleAddClient = () => {
      navigation.navigate('AddClient');
    };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleAddClient}>
        <Text style={styles.logoutButtonText}>Cliente +</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.searchInput}
        placeholderTextColor="gray"
        placeholder="Buscar por CLIENTE"
        value={searchText}
        onChangeText={(text) => {
            setSearchText(text); // Actualizamos el estado
            onSearch(text); // Llamamos a la función de búsqueda con el nuevo texto
          }}
      />

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingStart: 0,
    paddingEnd: 0,
    paddingTop:0,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    paddingLeft: 10,
  },
  logoutButton: {
    marginLeft: 16,
    backgroundColor: 'red', // Cambia el color según tus preferencias
    padding: 10,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white',
  },
  addButton: {
    marginLeft: 0,
    backgroundColor: 'blue', // Cambia el color según tus preferencias
    padding: 10,
    borderRadius: 8,
    marginRight: 10
  },
});

export default NavigationHeader;
