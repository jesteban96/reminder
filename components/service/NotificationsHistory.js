import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';

const NotificacionesHistorico = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);

  const navigateToShowNotification = (clientData) => {
    console.log("Data initial: ", clientData);
    navigation.navigate('NotificationDetail', { clientData, refresh: true });
  };

  const compareDates = (a, b) => new Date(b.fechaGeneracion) - new Date(a.fechaGeneracion);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await firebase.database().ref('Notificaciones').once('value');

        if (snapshot.exists()) {
          const data = snapshot.val();
          const notificationsArray = Object.values(data);

          // Ordenar las notificaciones por fecha (de más reciente a más antigua)
          notificationsArray.sort(compareDates);

          // Agrupar las notificaciones por fecha
          const groupedNotifications = groupNotificationsByDate(notificationsArray);

          // Actualizar el estado con las notificaciones agrupadas
          setNotifications(groupedNotifications);
        } else {
          console.log('No se encontraron datos de notificaciones.');
        }
      } catch (error) {
        console.error('Error al obtener datos de notificaciones:', error);
      }
    };

    fetchData();
  }, []);

  // Función para agrupar notificaciones por fecha
  const groupNotificationsByDate = (notificationsArray) => {
    const groupedNotifications = {};

    notificationsArray.forEach((notification) => {
      const dateKey = notification.fechaGeneracion.split('T')[0]; // Obtener la parte de la fecha (sin la hora)

      if (!groupedNotifications[dateKey]) {
        groupedNotifications[dateKey] = [];
      }

      groupedNotifications[dateKey].push(notification);
    });

    return groupedNotifications;
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigateToShowNotification(item)}>
      <Text key={item.id} style={[styles.dateHeader, { color: 'black' }]}>
        {item.titulo}
      </Text>
      <Text style={[styles.filterType, { color: 'black' }]}>{item.mensaje}</Text>
      {/* Agrega más campos según sea necesario */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.entries(notifications)}
        keyExtractor={(item) => item[0]} // La clave es la fecha
        renderItem={({ item }) => (
          <View>
            <Text style={styles.dateHeader}>{item[0]}</Text>
            <FlatList
              data={item[1]}
              keyExtractor={(notification) => notification.id}
              renderItem={renderNotificationItem}
            />
          </View>
        )}
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
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 4,
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  filterType: {
    fontSize: 16,
  },
});

export default NotificacionesHistorico;
