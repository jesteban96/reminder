import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert,Image  } from 'react-native';
import auth from '@react-native-firebase/auth';

import LogoImage from './src/images/logo.jpeg';

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Campos vacíos', 'Por favor, completa ambos campos de correo electrónico y contraseña.');
      return;
    }

    try {
      await auth().signInWithEmailAndPassword(email, password);
      onLogin(); // Llama a la función onLogin para cambiar al componente de FlatList
    } catch (error) {
      // Captura el error de inicio de sesión y muestra un mensaje personalizado.
      if (error.code === 'auth/invalid-login' || error.code === 'auth/wrong-password') {
        Alert.alert('Credenciales incorrectas', 'Verifica tu correo electrónico y contraseña.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Verifica tu correo electrónico', 'Por favor, ingresa una dirección de correo electrónico válida.');
      } else {
        // Otro manejo de errores, muestra un mensaje genérico en caso de otros errores.
        Alert.alert('Error de inicio de sesión', 'Hubo un error al iniciar sesión. Por favor, inténtalo de nuevo.', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Logotipo centrado */}
      <Image source={LogoImage} style={styles.logo} />
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        onChangeText={(text) => setEmail(text)}
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        placeholderTextColor="gray"
      />
      <Button title="Iniciar sesión" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Fondo blanco
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color:'black'
  },
  input: {
    width: '80%',
    height: 40,
    margin: 10,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    color:'black',
  },
  logo: {
    width: 250, // Ancho del logotipo
    height: 250, // Alto del logotipo
    marginBottom: 16,
  },
});

export default LoginScreen;
