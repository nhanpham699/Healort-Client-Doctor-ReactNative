import React from 'react'
import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    TouchableOpacity,
    Button,
    AsyncStorage,
    ScrollView,
    ImageBackground
} from 'react-native'
import host from '../../host'
import axios from 'axios'
import { FontAwesome, AntDesign, Feather } from '@expo/vector-icons'; 


export default function Bar({navigation}){

    const logout = async () => {
        const UserToken = await AsyncStorage.getItem('UserToken')
        // console.log(token);
        await axios.get(host + '/users/logout', {
                headers: { Authorization: `Bearer ${UserToken}` }
            }).then(async () => {
                    await AsyncStorage.removeItem('UserToken')
                    navigation.replace('Opening')
                })
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/bg.jpg')} style={styles.header}>
                <FontAwesome style={styles.profile} name="user-circle-o" size={75} color="black" /> 
                <Text style={styles.name}>Pham Phuoc Nhan</Text>
            </ImageBackground>
            <View style={styles.footer}>
                <ScrollView>
                    <View style={styles.menubar}>
                        <Text style={styles.menutext}>Home</Text>
                    </View>
                    <View style={styles.menubar}>
                        <Text style={styles.menutext}>Profile</Text>
                    </View>
                    <View style={styles.menubar}>
                        <Text style={styles.menutext}>Schedules</Text>
                    </View>
                    <View style={styles.menubar}>
                        <TouchableOpacity onPress={logout}>
                            <Text style={styles.menutext}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flex: 1,
        paddingTop: 10
    },  
    profile: {
        marginTop: 30,
        marginLeft: 30
    },
    footer: {
        paddingTop: 25,
        flex: 3
    },
    name: {
        fontSize: 20,
        fontWeight: '600',
        marginVertical: 8,
        marginLeft: 27
    },
    menubar: {
        // height: 60,
        // backgroundColor: 'blue',
        paddingHorizontal: 10,
        // paddingTop: 20
    },
    menutext: {
        height: 60,
        fontWeight: '500',
        fontSize: 18,
        // backgroundColor: 'white',
        lineHeight: 40,
        paddingLeft: 15,
        borderRadius: 5,
    }
})