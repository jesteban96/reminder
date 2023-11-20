import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import NavigationHeader from '../navigation/NavigationHeader';
import database from '@react-native-firebase/database';


const firebaseConfig = {
  // Tu configuración de Firebase aquí
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

const FlatListScreen = ({ onLogout, navigation,route }) => {
    const [clients, setClients] = useState([]);

    const [filteredClients, setFilteredClients] = useState([]);
    const [searchText, setSearchText] = useState('');

    const shouldRefresh = route.params?.refresh;
    const [refreshData, setRefreshData] = useState(true);

    useEffect(() => {
      
      if (shouldRefresh || refreshData) {
        const ref = db.ref('Cliente'); // Reemplaza 'Cliente' con la ruta de tu nodo de datos
        
        ref.once('value')
          .then(snapshot => {
            if (snapshot.exists()) {
              
              const data = snapshot.val();
              const clientsArray = Object.values(data); // Convierte los datos en un array
              
              clientsArray.sort((a, b) => a.CLIENTE.localeCompare(b.CLIENTE));
              
              setClients(clientsArray);
              setFilteredClients(clientsArray);
            } else {
              console.log('No se encontraron datos.');
            }
          })
          .catch(error => {
            console.error('Error al obtener datos:', error);
          });

          if (shouldRefresh) {
            navigation.setParams({ refresh: false }); // Establece shouldRefresh en false
          }
          setRefreshData(false); // Establece refreshData en false
        }
      
    },  [shouldRefresh, refreshData]); // El [] garantiza que esta función se ejecute solo una vez

    const handleSearch = (text) => {
      setSearchText(text); // Actualizamos el estado de búsqueda
      const filtered = clients.filter(client =>
        client.CLIENTE.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredClients(filtered); // Actualizamos la lista filtrada
    };

    const renderItem = ({ item }) => {
        return (
          <TouchableOpacity style={styles.card} onPress={() => navigateToEditClient(item)}>
            <Text style={[styles.clientName,{ color: 'black' }]}>{item.CLIENTE}</Text>
            <Text style={[styles.filterType,{ color: 'black' }]}>Tipo de filtro: {item.TIPO_FILTRO}</Text>
            <Text style={{ color: 'black' }}>Fecha de Instalación: {item.FECHA_INSTALACION}</Text>
            <Text style={{ color: 'black' }}>Número de Cuotas: {item.Cuotas}</Text>
          </TouchableOpacity>
        );
      };

  const handleLogout = async () => {
    await auth().signOut();
    onLogout(); // Llama a la función onLogout para cambiar de vuelta al componente de inicio de sesión
  };

  const navigateToEditClient = (clientData) => {
    navigation.navigate('EditClient', { clientData, refresh: true });
  };

  return (
    <View style={styles.container}>
      <NavigationHeader onSearch={handleSearch} onLogout={onLogout} />
      <FlatList
        data={filteredClients}
        renderItem={renderItem}
        keyExtractor={(item) => item.Id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    card: {
      backgroundColor: '#fff',
      padding: 16,
      marginBottom: 16,
      borderRadius: 8,
      elevation: 4,
    },
    clientName: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    filterType: {
      fontSize: 16,
    },
  });
  

export default FlatListScreen;
