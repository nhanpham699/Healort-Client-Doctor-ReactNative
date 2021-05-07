import React, { useEffect } from 'react'
import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ImageBackground
} from 'react-native'

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons'; 
import * as Animatable from 'react-native-animatable'

import Profile from './Profile'

// import Profile from './Profile'
import Notification from './Notification'
import Bar from './Bar'
import TopDoctorCarousel from '../../components/TopDoctorCarousel'
import Flatlist from '../../components/UserMenu'
import { useState } from 'react';

const MainScreen = () => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                    <TopDoctorCarousel />
            </View>
            
            <Animatable.View style={styles.footer} animation='fadeInUpBig'>
                    <View style={{
                        ...StyleSheet.absoluteFill,
                        backgroundColor: 'silver',
                        opacity: 0.2,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                    }}></View>         
                <Flatlist />
            </Animatable.View>
            
        </View>
    )
}



const Tab = createBottomTabNavigator();



export default function Home(){

    return (
        <Tab.Navigator 
         tabBarOptions={{
             activeTintColor: 'black',
             showLabel: false,
             style: styles.tabmenu
         }}
         initialRouteName={"Home"}>
            <Tab.Screen
                name={"Home"}
                component={MainScreen}
                options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color }) => (
                    <Entypo name="home" size={30} color={color} />
                ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                tabBarLabel: 'Profile',
                tabBarIcon: ({ color }) => (
                    <FontAwesome name="user" size={30} color={color} />
                ),
                }}
            />
            <Tab.Screen
                name={"Notifications"}
                component={Notification}
                options={{
                tabBarLabel: 'Notification',
                tabBarIcon: ({ color }) => (
                    <Ionicons name="notifications" size={30} color={color} />
                ),
                }}
            />
            <Tab.Screen
                name="Bar"
                component={Bar}
                options={{
                tabBarLabel: 'Bar',
                tabBarIcon: ({ color }) => (
                    <FontAwesome name="bars" size={30} color={color} />
                ),
                }}
            />
        </Tab.Navigator>
    );
}

var styles = StyleSheet.create({
    tabmenu: {
        paddingBottom: 10,
        paddingTop: 10,            
    },
    container: {
        flex: 1,
        backgroundColor: '#00bfff'
    },
    header: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,	
    },
    footer: {
        flex: 2,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30,        
    },
    infor: {
        width: 350,
        height: 80,
        flexDirection: 'row'
    },
    bginfor:{
        ...StyleSheet.absoluteFill,
        backgroundColor: 'white',
        opacity: 0.3,
        flex:1,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    inforicon: {
        marginTop: 20,
        marginLeft: 20 
    },
    textinfor: {
        marginTop: 18,
        marginLeft: 23        
    }
})






  
  
  