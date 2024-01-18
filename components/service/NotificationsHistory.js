import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';

const NotificacionesHistorico = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);

  const navigateToShowNotification = async (clientData) => {
    console.log("Data initial: ", clientData);
    await markNotificationAsRead(clientData.id, clientData.id_cliente);
    navigation.navigate('NotificationDetail', { clientData, refresh: true });
  };

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

  const markNotificationAsRead = async (notificationId, clientId) => {
    try {
      await firebase.database().ref(`Notificaciones/${notificationId}`).update({ leido: true });
  
      // Actualizar el estado local al marcar como leída
      const updatedNotifications = { ...notifications };
      Object.keys(updatedNotifications).forEach((dateKey) => {
        updatedNotifications[dateKey] = updatedNotifications[dateKey].map((notification) => {
          if (notification.id === notificationId) {
            return { ...notification, leido: true };
          }
          return notification;
        });
      });
      setNotifications(updatedNotifications);
  
      // Actualizar el campo "notificacionMantenimiento" en el nodo del cliente
      await firebase.database().ref(`Cliente/${clientId}`).update({ notificacionMantenimiento: false });
    } catch (error) {
      console.error('Error al marcar la notificación como leída:', error);
    }
  };

  const compareDates = (a, b) => {
    const dateA = a.fechaGeneracion ? extractDate(a.fechaGeneracion) : 0;
    const dateB = b.fechaGeneracion ? extractDate(b.fechaGeneracion) : 0;
    return dateB - dateA;
  };
  
  const extractDate = (isoDate) => {
    const [month, day, year] = isoDate.split('T')[0].split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: item.leido ? '#fff' : '#C6E9FF' }, // Cambiar el color según leído o no leído
      ]}
      onPress={() => {
        markNotificationAsRead(item.id, item.id_cliente);
        navigateToShowNotification(item);
      }}
    >
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
