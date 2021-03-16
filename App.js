import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { ActivityIndicator, StyleSheet, Text, View, AppRegistry } from 'react-native';

import { Provider } from 'react-redux'
import {name as appName} from './app.json'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Opening from './screens/Opening'
import Login from './screens/Login'
import Home from './screens/Home'
import CreateProfile from './screens/CreateProfile'
import Loading from './screens/Loading'
import Register from './screens/Register'
import configureStore from './store'
import MakeaApp from './screens/MakeaApp';
import Manage from './screens/ManageSchedules'
import Chat from './screens/Chat'
import Schedule from './screens/Schedules'
const Stack = createStackNavigator();

const store = configureStore()


const App = () => {
  return (
      <Provider store={store}>
        <NavigationContainer>   
          <Stack.Navigator headerMode="none" >
            <Stack.Screen name="Loading" component={Loading} />
            <Stack.Screen name="Opening" component={Opening} />
            <Stack.Screen name="Login" component={Login} />    
            <Stack.Screen name="Register" component={Register} />              
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="CreateProfile" component={CreateProfile} />
            <Stack.Screen name="MakeaApp" component={MakeaApp} />
            <Stack.Screen name="Manage" component={Manage} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Schedule" component={Schedule} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>    
  );
}

AppRegistry.registerComponent(appName, () => App )

export default App

