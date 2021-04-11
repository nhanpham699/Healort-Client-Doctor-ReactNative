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
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                    resizeMode={"stretch"}
                />
            </View>
            <Animatable.View style={styles.footer} animation='fadeInUpBig'>
                <Text style={styles.title}>Stay to connect with everyone!</Text>
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate('Loading')} style={styles.button1}>
                        <LinearGradient
                        colors={['#CECCF5','#0970BE']}
                        style={styles.login} >
                            <Text style={styles.textinbutton}>You're client</Text>
                            <MaterialIcons style={styles.iconnext} color="white" name="navigate-next" size={20} />
                        </LinearGradient>
                    </TouchableOpacity>  
                    <TouchableOpacity onPress={() => navigation.navigate('DoctorLoading')} style={styles.button2}>
                        <LinearGradient
                        colors={['#D4919E','#C13815']}
                        style={styles.login} >
                            <Text style={styles.textinbutton}>You're doctor</Text>
                            <MaterialIcons style={styles.iconnext} color="white" name="navigate-next" size={20} />
                        </LinearGradient>
                    </TouchableOpacity> 
                </View> 
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
        flex: 1.5,
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
    button1: {
        alignItems: 'center',
        marginTop: 30
    },
    button2: {
        alignItems: 'center',
        marginTop: 10
    },
    login: {
        width: 160,
        height: 50,
        // justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 15
    },
    iconnext: {
        position: 'absolute',
        right: 12      
    },
    textinbutton: {
        fontWeight: '500', 
        color: 'white', 
        marginLeft: 25
    }
})