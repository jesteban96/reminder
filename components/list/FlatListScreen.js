import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import NavigationHeader from '../navigation/NavigationHeader';
import database from '@react-native-firebase/database';
import notifications from '../service/notifications';
import { FloatingAction } from 'react-native-floating-action';

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
              const clientsArray = Object.values(data);
    
              // Filtrar y ordenar clientes
              const filteredAndSortedClients = clientsArray
                .filter(client => client && client.CLIENTE)
                .sort((a, b) => (a.CLIENTE && b.CLIENTE) ? a.CLIENTE.localeCompare(b.CLIENTE) : 0);
    
              setClients(filteredAndSortedClients);
              setFilteredClients(filteredAndSortedClients);
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
        notifications();
      }
    
    }, [shouldRefresh, refreshData]); // El [] garantiza que esta función se ejecute solo una vez    

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

  const actions = [
    {
      text: 'Ver Notificaciones',
      icon: require('../../src/images/campanita.png'),
      name: 'btnNotificaciones',
      position: 2,
    },
  ];

  const handleActionPress = (name) => {
    if (name === 'btnNotificaciones') {
      navigation.navigate('NotificacionesHistorico');
    }
  };

  return (
    <View style={styles.container}>
      <NavigationHeader onSearch={handleSearch} onLogout={onLogout} />
      <FlatList
        data={filteredClients}
        renderItem={renderItem}
        keyExtractor={(item) => item.Id.toString()}
      />
      <FloatingAction
        actions={actions}
        onPressItem={(name) => handleActionPress(name)}
        color="#FFD700" // Color amarillo para la campanita
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
