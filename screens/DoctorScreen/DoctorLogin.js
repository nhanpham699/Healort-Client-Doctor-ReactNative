import React, { useEffect, useState } from 'react'
import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    StatusBar, 
    Dimensions,
    TouchableOpacity,
    TextInput,
    AsyncStorage
} from 'react-native'

import * as Animatable from 'react-native-animatable'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import {EyeOff, Eye} from 'react-native-feather'
import axios from 'axios'
import host from '../../host'
import {useDispatch, useSelector} from 'react-redux'

import { addDoctor } from '../../actions/doctor'


export default function DoctorLogin({navigation}){

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
            password: text.password
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


    

    return(
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
                            colors={['#ffcccc', '#ff8080']}
                            style={styles.login}
                        >
                            <Text style={styles.login_text}>Log in</Text>
                        </LinearGradient>
                    </View>
                </TouchableOpacity>  

            </Animatable.View>
        </SafeAreaView>
    )
}


var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ff8080'
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