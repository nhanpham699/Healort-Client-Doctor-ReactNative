import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { ActivityIndicator, StyleSheet, Text, View, AppRegistry } from 'react-native';

import { Provider } from 'react-redux'
import {name as appName} from './app.json'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Opening from './screens/ClientScreen/Opening'
import Login from './screens/ClientScreen/Login'
import Home from './screens/ClientScreen/Home'
import Loading from './screens/ClientScreen/Loading'
import Register from './screens/ClientScreen/Register'
import configureStore from './store'
import MakeaApp from './screens/ClientScreen/MakeaApp';
import Message from './screens/ClientScreen/Message'
import Schedule from './screens/ClientScreen/Schedules'
import DoctorHome from './screens/DoctorScreen/DoctorHome'
import DoctorLogin from './screens/DoctorScreen/DoctorLogin'
import DoctorLoading from './screens/DoctorScreen/DoctorLoading'
import ExamHistory from './screens/ClientScreen/ExamHistory'
import Chat from './screens/ClientScreen/Chat'
import Patient from './screens/DoctorScreen/Patient'
import Checkout from './screens/ClientScreen/Checkout'
import DoctorSchedule from './screens/DoctorScreen/DoctorSchedule'
import BusyDoctor from './screens/DoctorScreen/BusyDoctor'
import DoctorChat from './screens/DoctorScreen/DoctorChat'
import ExaminationSlip from './screens/ClientScreen/ExamSlip'
import Doctor from './screens/ClientScreen/Doctor'
import UpdateSchedules from './screens/UpdateSchedules'
import ReExam from  './screens/DoctorScreen/ReExam'
import ReExamList from  './screens/ClientScreen/ReExamList'
import ShowExaminationSlip from './screens/ClientScreen/ShowExamSlip'


const Stack = createStackNavigator();

const store = configureStore()
const App = () => {
  return (
      <Provider store={store}>
        <NavigationContainer>   
          <Stack.Navigator headerMode="none" >
            <Stack.Screen name="Opening" component={Opening} />
            <Stack.Screen name="Loading" component={Loading} />
            <Stack.Screen name="DoctorLoading" component={DoctorLoading} />
            <Stack.Screen name="DoctorLogin" component={DoctorLogin} />
            <Stack.Screen name="Login" component={Login} />    
            <Stack.Screen name="Register" component={Register} />   
            <Stack.Screen name="DoctorHome" component={DoctorHome} />           
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Doctor" component={Doctor} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="MakeaApp" component={MakeaApp} />
            <Stack.Screen name="ExamHistory" component={ExamHistory} />
            <Stack.Screen name="Message" component={Message} />
            <Stack.Screen name="Schedule" component={Schedule} />
            <Stack.Screen name="Checkout" component={Checkout} />
            <Stack.Screen name="DoctorSchedule" component={DoctorSchedule} />
            <Stack.Screen name="Patient" component={Patient} />
            <Stack.Screen name="ExaminationSlip" component={ExaminationSlip} />
            <Stack.Screen name="UpdateSchedules" component={UpdateSchedules} />
            <Stack.Screen name="BusyDoctor" component={BusyDoctor} />
            <Stack.Screen name="DoctorChat" component={DoctorChat} />
            <Stack.Screen name="ReExam" component={ReExam} />
            <Stack.Screen name="ReExamList" component={ReExamList} />
            <Stack.Screen name="ShowExamSlip" component={ShowExaminationSlip} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>    
  );
}

AppRegistry.registerComponent(appName, () => App )

export default App

