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
                try {
                    // Lógica para notificaciones de mantenimiento
                    let daysBeforeMaintenance = 0;
                    let maintenanceDateParts = '';
                    try {
                        daysBeforeMaintenance = client.daysBeforeMaintenance || 0;
                        maintenanceDateParts = client.Fecha_Mantenimiento ? client.Fecha_Mantenimiento.split('/') : '';
                    } catch {
                        daysBeforeMaintenance = 0;
                        maintenanceDateParts = '';
                    }

                    const maintenanceDate = new Date(
                        parseInt(maintenanceDateParts[2], 10),
                        parseInt(maintenanceDateParts[0], 10) - 1,
                        parseInt(maintenanceDateParts[1], 10)
                    );

                    const notificationDate = new Date(maintenanceDate);
                    notificationDate.setDate(maintenanceDate.getDate() - daysBeforeMaintenance);

                    const currentDate = new Date();
                    const formattedCurrentDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
                    const formattedNotificationDate = `${notificationDate.getMonth() + 1}/${notificationDate.getDate()}/${notificationDate.getFullYear()}`;

                    if (formattedCurrentDate === formattedNotificationDate && client.notificacionMantenimiento !== false) {
                        const maintenanceNotificationMessage = `El cliente ${client.CLIENTE} tiene un mantenimiento programado para el ${client.Fecha_Mantenimiento}.`;
                        showNotification('Mantenimiento', maintenanceNotificationMessage);

                        const maintenanceNotificationData = {
                            fechaGeneracion: formattedCurrentDate,
                            titulo: "Mantenimiento",
                            cliente: client.CLIENTE,
                            whatsapp: client.Telefono_WhatsApp,
                            direccion: client.CELULAR_DIRECCION,
                            tipo_filtro: client.TIPO_FILTRO,
                            mensaje: maintenanceNotificationMessage,
                            leido: false,
                            id: null,
                            id_cliente: client.Id
                        };

                        const maintenanceNotificationsRef = db.ref('Notificaciones');
                        const newMaintenanceNotificationRef = maintenanceNotificationsRef.push();
                        const newMaintenanceNotificationId = newMaintenanceNotificationRef.key;
                        maintenanceNotificationData.id = newMaintenanceNotificationId;

                        await newMaintenanceNotificationRef.set(maintenanceNotificationData);
                    }

                    // Lógica para notificaciones de cobros
                    let cuotas = 0;
                    let nextInstallmentDates =  [];
                    try{
                        cuotas = client.Cuotas || 0;
                        nextInstallmentDates = client.proximaNotificacion ? client.proximaNotificacion.split(',') : [];
                    }
                    catch{
                        cuotas =  0;
                        nextInstallmentDates = [];
                    }
                    

                    if (cuotas >= 2 && nextInstallmentDates.length > 0) {
                        if (nextInstallmentDates.includes(formattedCurrentDate) && client.notificacionCobro !== false) {
                            const installmentNotificationMessage = `El cliente ${client.CLIENTE} tiene un cobro programado para hoy.`;
                            showNotification('Cobros', installmentNotificationMessage);

                            const updatedInstallmentDates = nextInstallmentDates.filter(date => date !== formattedCurrentDate);
                            await database().ref(`/Cliente/${client.Id}`).update({ proximaNotificacion: updatedInstallmentDates.join(',') });

                            const installmentNotificationData = {
                                fechaGeneracion: formattedCurrentDate,
                                titulo: "Cobros",
                                cliente: client.CLIENTE,
                                whatsapp: client.Telefono_WhatsApp,
                                direccion: client.CELULAR_DIRECCION,
                                tipo_filtro: client.TIPO_FILTRO,
                                mensaje: installmentNotificationMessage,
                                leido: false,
                                id: null,
                                id_cliente: client.Id
                            };

                            const installmentNotificationsRef = db.ref('Notificaciones');
                            const newInstallmentNotificationRef = installmentNotificationsRef.push();
                            const newInstallmentNotificationId = newInstallmentNotificationRef.key;
                            installmentNotificationData.id = newInstallmentNotificationId;

                            await newInstallmentNotificationRef.set(installmentNotificationData);
                        }
                    }

                } catch (error) {
                    console.error('Error al procesar cliente:', error);
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