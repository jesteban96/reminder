import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationDetail = ({ route }) => {
    const data = route.params.clientData;

  return (
    <View style={styles.card}>
      <Text style={styles.dateHeader}>{data.cliente}</Text>
      <Text style={styles.filterType}>Filtro: {data.tipo_filtro}</Text>
      <Text style={styles.filterType}>WhatsApp: {data.whatsapp}</Text>
      <Text style={styles.filterType}>Telefono / Dirección: {data.direccion}</Text>
      {/* Agrega más campos según sea necesario */}
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
});

export default NotificationDetail;
