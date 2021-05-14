import React, { useEffect, useState } from 'react'
import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    StatusBar, 
    Alert,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native'

import * as Animatable from 'react-native-animatable'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import {EyeOff, Navigation} from 'react-native-feather'
import axios from 'axios'
import host from '../../host'
import { MaterialIcons, FontAwesome, Entypo } from '@expo/vector-icons'; 
import { ModalDatePicker } from "react-native-material-date-picker";
import { log } from 'react-native-reanimated'



export default function Register({navigation}){

    // const [date,setDate] = useState(null)
    
    const [already, setAlready] = useState({
        alemail: false,
        alpassword: false,
        alrepassword: false,
        phone: false
    })

    const [validation, setValidation] = useState({
        email: true,
        password: true,
        repassword: true,
        phone: true
    })
    const [text, setText] = useState({
        email: null,
        password: null,
        repassword: null,
        fullname: null,
        phone: null,
    })

   

    const validEmail = (val) => {
        const testEmail = /^\w+@[a-zA-Z]{3,}\.com$/i
        if(!testEmail.test(val)){
            setValidation({
                ...validation,
                email: true
            })
        }else {
            setValidation({
                ...validation,
                email: false
            })
        }
        setAlready({...already, alemail: true})
    }

    const validPhone = (val) => {
        const testPhone = /^\d{10}$/;
        if(!testPhone.test(val)){
            setValidation({
                ...validation,
                phone: true
            })
        }else {
            setValidation({
                ...validation,
                phone: false
            })
        }
        setAlready({...already, alpassword: true})
    }

    const validPass = (val) => {
        if(val.length < 5 || val.length > 20){
            setValidation({
                ...validation,
                password: true
            })
        }else {
            setValidation({
                ...validation,
                password: false
            })
        }
        setAlready({...already, alrepassword: true})
    }

    const validRePass = (val) => {
        if(val != text.password){
            setValidation({
                ...validation,
                repassword: true
            })
        }else{
            setValidation({
                ...validation,
                repassword: false
            })
        }
        setAlready({...already, alphone: true})
    }

    const signup = () => {
        const response = text
        console.log(validation);
        if(!validation.email &&
           !validation.password &&
           !validation.repassword &&
           !validation.fullname &&
           !validation.phone){
                axios.post(host + '/users/signup', response)
                .then(() => {
                    Alert.alert(
                        "Sign up!",
                        "successfully!",
                        [
                          { text: "OK", onPress: () => navigation.navigate('Login') }
                        ]
                      );
                })
            }else alert('sign up failed!')
    }

    return(
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.header}>
                    <Text style={styles.title}>Register</Text>
                </View>
                <Animatable.View style={styles.footer} animation='fadeInUpBig'>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        
                        <Text style={styles.text_footer}>Email</Text>
                        <View style={styles.action}>
                            <MaterialIcons name="email" size={24} color="black" />
                            <TextInput
                                value={text.email} 
                                placeholder="Your email" 
                                style={styles.text_input} 
                                autoCapitalize="none" 
                                onChangeText={value => setText({...text, email:value})}
                                onEndEditing={e => validEmail(e.nativeEvent.text)}
                            />
                        </View> 
                        {(validation.email && already.alemail) && (
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.error}>Invalid email</Text>
                        </Animatable.View>
                        )}    
                        <Text style={[styles.text_footer, { marginTop:35 }]}>Password</Text>
                        <View style={styles.action}>
                            <FontAwesomeIcon icon={faLock} size={20} />
                            <TextInput 
                                value={text.password}
                                placeholder="Your password" 
                                style={styles.text_input} 
                                autoCapitalize="none" 
                                secureTextEntry={true}
                                onChangeText={value => setText({...text, password:value})} 
                                onEndEditing={e => validPass(e.nativeEvent.text)}
                            />
                        </View>
                        {(validation.password && already.alpassword) && (
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.error}>Invalid password</Text>
                        </Animatable.View>
                        )}    
                        <Text style={[styles.text_footer, { marginTop:35 }]}>Re-Enter password</Text>
                        <View style={styles.action}>
                            <FontAwesomeIcon icon={faLock} size={20} />
                            <TextInput 
                                value={text.repassword}
                                placeholder="Your password" 
                                style={styles.text_input} 
                                autoCapitalize="none" 
                                secureTextEntry={true}
                                onChangeText={value => setText({...text, repassword:value})} 
                                onEndEditing={e => validRePass(e.nativeEvent.text)}
                            />
                        </View>
                        {(validation.repassword && already.alrepassword) && (
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.error}>Invalid Re-password</Text>
                        </Animatable.View>
                        )}

                        
                        <Text style={[styles.text_footer, { marginTop:35 }]}>Full name</Text>
                        <View style={styles.action}>
                            <FontAwesomeIcon icon={faUser} size={20} />
                            <TextInput 
                                value={text.fullname}
                                placeholder="Your full name" 
                                style={styles.text_input} 
                                autoCapitalize="none" 
                                onChangeText={value => setText({...text, fullname:value})} 
                            />
                        </View> 
                        
                        <Text style={[styles.text_footer, { marginTop:35 }]}>Phone</Text>
                        <View style={styles.action}>
                            <Entypo name="phone" size={24} color="black" />
                            <TextInput 
                                value={text.phone}
                                placeholder="Your phone" 
                                style={styles.text_input} 
                                autoCapitalize="none" 
                                onChangeText={value => setText({...text, phone:value})} 
                                onEndEditing={e => validPhone(e.nativeEvent.text)}
                            />
                        </View>  
                        {(validation.phone && already.alphone) && (
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.error}>Invalid phone</Text>
                        </Animatable.View>
                        )}    
                        <TouchableOpacity onPress={signup}>
                            <View style={styles.button}>
                                <LinearGradient
                                    colors={['white', '#00bfff']}
                                    style={styles.login}
                                >
                                    <Text style={styles.login_text}>Sign up</Text>
                                </LinearGradient>
                            </View>
                        </TouchableOpacity> 
                    </ScrollView>
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
    },
    error:{
        color: 'red'
    }
})