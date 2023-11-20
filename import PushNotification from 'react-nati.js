import PushNotification from 'react-native-push-notification';
import NotificationService from 'react-native-push-notification';

export const notificationService = () => {

    const configurePushNotifications = () => {
        PushNotification.createChannel(
          {
            channelId: 'default-channel-id', // ID único del canal
            channelName: 'Default Channel',
            channelDescription: 'A default channel for notifications',
            playSound: true,
            soundName: 'default',
            importance: 4, // IMPORTANCE_HIGH
            vibrate: true,
          },
          (created) => console.log(`Channel created: ${created}`),
        );
    };

    const showInitialNotification = () => {
        NotificationService.localNotification({
          title: '¡Bienvenido!',
          message: 'Gracias por usar nuestra aplicación.',
          channelId: 'default-channel-id', // Especifica el channelId aquí
        });
    };

    const showNotification = (title, message) => {
        PushNotification.localNotification({
          title,
          message,
          channelId: 'default-channel-id',
        });
    };

    return {
        showInitialNotification,
        showNotification
    };
};
  
