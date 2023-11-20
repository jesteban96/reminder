import React, { Component,useEffect } from 'react';
import { StyleSheet, BackHandler } from 'react-native';
import auth from '@react-native-firebase/auth';
import LoginScreen from './LoginScreen';
import FlatListScreen from './components/list/FlatListScreen';
import EditClientScreen from './components/form/EditClientScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddClientScreen from './components/form/AddClientScreen'
import firebase from '@react-native-firebase/app';
import firebaseMessaging from '@react-native-firebase/messaging';



const Stack = createNativeStackNavigator();

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    if (this.state.user) {
      auth()
        .signOut()
        .then(() => {
          console.log('Sesión cerrada al salir de la aplicación');
          BackHandler.exitApp();
        })
        .catch(error => {
          console.error('Error al cerrar la sesión:', error);
        });
      return true;
    }
  };

  handleLogin = () => {
    this.setState({ user: auth().currentUser });
  };

  handleLogout = () => {
    if (this.state.user) {
      auth()
        .signOut()
        .then(() => {
          console.log('Sesión cerrada al presionar botón');
          this.setState({ user: null });
        })
        .catch(error => {
          console.error('Error al cerrar la sesión:', error);
        });
      return true;
    }
  };
 
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          {this.state.user ? (
            <Stack.Screen
              name="FlatListScreen"
              options={{ title: 'Lista de Clientes' }}
            >
              {(props) => (
                <FlatListScreen
                  {...props}
                  onLogout={this.handleLogout}
                />
              )}
            </Stack.Screen>
          ) : (
            <Stack.Screen
              name="LoginScreen"
              options={{ title: 'Filtros y Ozono' }}
            >
              {(props) => (
                <LoginScreen
                  {...props}
                  onLogin={this.handleLogin}
                />
              )}
            </Stack.Screen>
          )}
          <Stack.Screen name="EditClient" component={EditClientScreen} options={{ title: 'Editar Clientes' }}/>
          <Stack.Screen name="AddClient" component={AddClientScreen} options={{ title: 'Crear Clientes' }}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Estilos adicionales según tus necesidades
});

export default App;