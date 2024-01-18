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

                    // Guardar información en la base de datos
                    const notificationData = {
                        fechaGeneracion: formattedCurrentDate, // Usar la fecha actual en el formato correcto
                        titulo:"Mantenimiento",
                        cliente: client.CLIENTE,
                        whatsapp: client.Telefono_WhatsApp,
                        direccion: client.CELULAR_DIRECCION,
                        tipo_filtro:client.TIPO_FILTRO,
                        mensaje: notificationMessage,
                        leido: false,
                        id: null // Dejarlo nulo por ahora
                    };
                
                    // Obtener una referencia al nodo de Notificaciones en la base de datos
                    const notificationsRef = db.ref('Notificaciones');
                
                    // Agregar una nueva notificación con un identificador único
                    const newNotificationRef = notificationsRef.push();

                    // Obtener el ID asignado por Firebase
                    const newNotificationId = newNotificationRef.key;

                    // Actualizar el ID en la información de la notificación
                    notificationData.id = newNotificationId;

                    // Actualizar la notificación con el ID
                    await newNotificationRef.set(notificationData);
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