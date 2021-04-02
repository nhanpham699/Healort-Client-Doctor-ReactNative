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
    AsyncStorage,
    KeyboardAvoidingView,
} from 'react-native'

import * as Animatable from 'react-native-animatable'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import {EyeOff, Eye} from 'react-native-feather'
import axios from 'axios'
import host from '../host'
import {useDispatch, useSelector} from 'react-redux'
import { addDoctorInfor } from '../actions/doctor.infor'
import { addUser } from '../actions/user'


export default function Login({navigation}){

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
        
        axios.post(host + '/users/login', response)
        .then( async(res) => {
            const doctors = await axios.get(host + '/doctors/getalldoctors')
            await dispatch(addDoctorInfor(doctors))
            await AsyncStorage.setItem('UserToken', res.data.token);
            await dispatch(addUser(res.data.data))
            navigation.replace('Home')
        }).catch(err => {
            alert("login failed")
        })
    }


    

    return(
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.header}>
                    <View style={styles.title}>
                        <Animatable.Text animation="bounceIn" duration={1500} style={styles.texttitle}>Sunshine had hats</Animatable.Text>
                        <Animatable.Text animation="bounceIn" duration={1700} style={[styles.texttitle, {marginLeft: 10}]}>Rain had umbrellas</Animatable.Text>
                        <Animatable.Text animation="bounceIn" duration={2000} style={[styles.texttitle,{color: 'red', marginLeft: 20}]}>Your teeth had us</Animatable.Text>
                    </View>
                    <Animatable.Image
                        animation="bounceIn"
                        duration={1500}
                        source={require('../assets/doctor.png')}
                        style={styles.logo}
                        resizeMode={"stretch"}
                    />
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
                                colors={['#99ffff', '#00bfff']}
                                style={styles.login}
                            >
                                <Text style={styles.login_text}>Log in</Text>
                            </LinearGradient>
                        </View>
                    </TouchableOpacity> 

                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <View style={{marginTop: 20}}>
                            <LinearGradient
                                colors={[ 'white', '#e6ecff']}
                                style={[styles.login, {borderWidth: 0.2, borderColor: '#e6ecff'}]}
                            >
                                <Text style={styles.login_text}>Sign up</Text>
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
        backgroundColor: '#00bfff'
    },
    header: {
        flex: 1,
        flexDirection: 'row'
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
        padding: 10,
        marginTop: 50,
        marginLeft: 20,
        height: 135
    },
    texttitle: {
        fontSize: 18,
        fontWeight: '600',         
        marginTop: 3
    },
    logo: {
        marginTop: 20,
        width: 180,
        height: 150,
        marginLeft: 10
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