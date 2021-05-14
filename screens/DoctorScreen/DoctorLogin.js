import React, { useEffect, useRef, useState } from 'react'
import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    StatusBar, 
    TouchableOpacity,
    TextInput,
    AsyncStorage,
    KeyboardAvoidingView
} from 'react-native'
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Animatable from 'react-native-animatable'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import {EyeOff, Eye} from 'react-native-feather'
import axios from 'axios'
import host from '../../host'
import {useDispatch, useSelector} from 'react-redux'

import { addDoctor } from '../../actions/doctor'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
});

export default function DoctorLogin({navigation}){
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    // console.log(navigation);
    const [secureText, setSecureText] = useState(true)
    const dispatch = useDispatch()
    // const userr = useSelector(state => state)

    const [text, setText] = useState({
        email: null,
        password: null
    })

    const login = () => {
       
        const response = {
            email: text.email,
            password: text.password,
            tokenDevices: expoPushToken
        }
        
        axios.post(host + '/doctors/login', response)
        .then( async(res) => {
            console.log(res.data);
            await AsyncStorage.setItem('DoctorToken', res.data.token);
            await dispatch(addDoctor(res.data.data))
            navigation.replace('DoctorHome')
        }).catch(err => {
            alert("login failed")
        })
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
        });
    
        return () => {
          Notifications.removeNotificationSubscription(notificationListener);
          Notifications.removeNotificationSubscription(responseListener);
        };
      }, []);

      async function schedulePushNotification() {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here' },
          },
          trigger: { seconds: 2 },
        });
      }

      async function registerForPushNotificationsAsync() {
        let token;
        if (Constants.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          token = (await Notifications.getExpoPushTokenAsync()).data;
          console.log(token);
        } else {
          alert('Must use physical device for Push Notifications');
        }
      
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      
        return token;
      }
    

    return(
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome!</Text>
                </View>
                <Animatable.View style={styles.footer} animation='fadeInUpBig'>
                    <Text style={styles.text_footer}>Email</Text>
                    <View style={styles.action}>
                        <FontAwesomeIcon icon={faUser} size={20} />
                        <TextInput
                            value={text.email} 
                            placeholder="Your email" 
                            style={styles.text_input} 
                            autoCapitalize="none" 
                            onChangeText={value => setText({...text, email:value})}
                        />
                    </View> 
                    <Text style={[styles.text_footer, { marginTop:35 }]}>Password</Text>
                    <View style={styles.action}>
                        <FontAwesomeIcon icon={faLock} size={20} />
                        <TextInput 
                            value={text.password}
                            placeholder="Your password" 
                            style={styles.text_input} 
                            autoCapitalize="none" 
                            secureTextEntry={secureText}
                            onChangeText={value => setText({...text, password:value})} 
                        />
                        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                            {secureText ? <EyeOff color="gray" size={20} />
                                        : <Eye color="green" size={20} />}
                        </TouchableOpacity>
                    </View> 
                    <TouchableOpacity onPress={login}>
                        <View style={styles.button}>
                            <LinearGradient
                                colors={['#44A08D', '#237A57']}
                                style={styles.login}
                            >
                                <Text style={styles.login_text}>Log in</Text>
                            </LinearGradient>
                        </View>
                    </TouchableOpacity>  

                </Animatable.View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}


var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#44A08D'
    },
    header: {
        flex: 1,
    },
    footer: {
        flex: 2,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30
    },
    title: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 35,
        marginTop: 100,
        marginLeft: 30
    },
    text_footer: {
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    text_input: {
        flex: 1,
        paddingLeft: 10,
        color: '#05375a'
    },
    login: {
        borderColor: '#00bfff',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: '100%',
        borderRadius: 10
    },
    login_text: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontWeight: 'bold',
        fontSize: 18,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    }
})