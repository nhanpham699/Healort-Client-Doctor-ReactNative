import React from 'react'
import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    StatusBar, 
    Dimensions,
    TouchableOpacity
} from 'react-native'
import * as Animatable from 'react-native-animatable'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialIcons } from '@expo/vector-icons'; 

export default function Opening({navigation}){
    return(
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <Animatable.Image
                    animation="bounceIn"
                    duration={1500}
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode={"stretch"}
                />
            </View>
            <Animatable.View style={styles.footer} animation='fadeInUpBig'>
                <Text style={styles.title}>Stay to connect with everyone!</Text>
                <Text style={styles.text}>Health is the most important</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.button}>
                     <LinearGradient
                     colors={['#00bfff', '#00bfff']}
                     style={styles.login} >
                        <Text style={{fontWeight: '500'}}>Get Started</Text>
                        <MaterialIcons name="navigate-next" size={20} />
                     </LinearGradient>
                </TouchableOpacity>    
            </Animatable.View>
        </SafeAreaView>
    )
}

const {height} = Dimensions.get("screen")
const height_logo = height * 0.5 * 0.35
var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00bfff'
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30
    },
    logo: {
        height: height_logo,
        width: height_logo
    },
    title: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 30
    },
    text: {
        marginTop: 20
    },
    button: {
        alignItems: 'flex-end',
        marginTop: 30
    },
    login: {
        width: 160,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
        flexDirection: 'row',
        marginTop: 10
    }
})