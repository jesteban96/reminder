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

const { showInitialNotification,showNotification} = notificationService();

const notifications = () => {
    
        const ref = db.ref('Cliente'); // Reemplaza 'Cliente' con la ruta de tu nodo de datos
          
        ref.once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
            
            const data = snapshot.val();
            const clientsArray = Object.values(data); // Convierte los datos en un array
                       
            // Verificar las fechas de mantenimiento y mostrar notificaciones
            const currentDate = new Date();
            const formattedCurrentDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

            clientsArray.forEach(client => {
                if (client.Fecha_Mantenimiento === formattedCurrentDate) {
                const notificationMessage = `El cliente ${client.CLIENTE} tiene un mantenimiento hoy.`;
                showNotification('Mantenimiento', notificationMessage);
                }
            });
            } else {
            console.log('No se encontraron datos.');
            }
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
        });
}

export default notifications
