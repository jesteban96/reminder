import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking,Image,Alert  } from 'react-native';

const NotificationDetail = ({ route }) => {
  const data = route.params.clientData;

  const sendNotificationWhatsApp = async (Telefono_WhatsApp, notificationMessage) => {
    if (Telefono_WhatsApp && Telefono_WhatsApp !== '' && Telefono_WhatsApp !== undefined && Telefono_WhatsApp !== null) {
      const phoneNumber = Telefono_WhatsApp;
      const message = notificationMessage;
      const url = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
      await Linking.openURL(url);
    } else {
      Alert.alert('No se enviará mensaje de WhatsApp porque no tiene un número de WhatsApp registrado.');
    }
  };

  const message = (data) => {
    let messageWhatsApp = '';

    if(data.titulo == 'Mantenimiento'){
      messageWhatsApp = `Hola, Buen Día. ${data.mensaje}`;
    }
    else if(data.titulo == 'Cobros'){
      messageWhatsApp = `Hola, Buen Día. ${data.mensaje}`;
    }

    return(messageWhatsApp);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.dateHeader}>{data.cliente}</Text>
      <Text style={styles.filterType}>Filtro: {data.tipo_filtro}</Text>
      <Text style={styles.filterType}>WhatsApp: {data.whatsapp}</Text>
      <Text style={styles.filterType}>Telefono / Dirección: {data.direccion}</Text>

      <TouchableOpacity
        style={[styles.whatsappButton, { backgroundColor: '#25d366' }]}
        onPress={() => sendNotificationWhatsApp(data.whatsapp, message(data))}
      >
        <Image
          source={require('../../src/images/whatsApp.png')} // Ajusta la ruta según la ubicación de tu imagen
          style={{ width: 24, height: 24, tintColor: '#fff' }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    margin: 8,
    position: 'relative', // Agregado para que el botón flotante se posicione correctamente
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  filterType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  whatsappButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
    bottom: 16,
    right: 16,
    elevation: 4,
  },
});

export default NotificationDetail;
