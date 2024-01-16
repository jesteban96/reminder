import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import notificationService from './mensage.js';

const firebaseConfig = {
    // Tu configuración de Firebase aquí
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

const { showInitialNotification, showNotification } = notificationService();

const notifications = async () => {
    try {
        const ref = db.ref('Cliente');

        const snapshot = await ref.once('value');

        if (snapshot.exists()) {
            const data = snapshot.val();
            const clientsArray = Object.values(data);

            clientsArray.forEach(async (client) => {
                const daysBeforeMaintenance = client.daysBeforeMaintenance || 0;

                // Obtener fecha de mantenimiento en formato mes/día/año
                const maintenanceDateParts = client.Fecha_Mantenimiento.split('/');
                const maintenanceDate = new Date(
                    parseInt(maintenanceDateParts[2], 10), // Año
                    parseInt(maintenanceDateParts[0], 10) - 1, // Mes (restar 1 porque los meses en JavaScript son de 0 a 11)
                    parseInt(maintenanceDateParts[1], 10) // Día
                );

                // Calcular la fecha de notificación restando los días necesarios
                const notificationDate = new Date(maintenanceDate);
                notificationDate.setDate(maintenanceDate.getDate() - daysBeforeMaintenance);

                const currentDate = new Date();
                const formattedCurrentDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

                // Verificar si hoy es la fecha de notificación
                const formattedNotificationDate = `${notificationDate.getMonth() + 1}/${notificationDate.getDate()}/${notificationDate.getFullYear()}`;
                
                if (formattedCurrentDate === formattedNotificationDate) {
                    const notificationMessage = `El cliente ${client.CLIENTE} tiene un mantenimiento programado para el ${client.Fecha_Mantenimiento}.`;

                    // Mostrar notificación
                    showNotification('Mantenimiento', notificationMessage);
                }
            });
        } else {
            console.log('No se encontraron datos.');
        }
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
};

export default notifications;