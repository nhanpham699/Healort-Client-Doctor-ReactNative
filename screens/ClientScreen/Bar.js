import React from 'react'
import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    AsyncStorage,
    ScrollView,
    ImageBackground
} from 'react-native'
import host from '../../host'
import axios from 'axios'
import { FontAwesome, AntDesign, Feather } from '@expo/vector-icons'; 
import { useSelector } from 'react-redux';


export default function Bar({navigation}){

    const { user } = useSelector(state => state.users)

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
                <Image style={{width: 100, height: 100, borderRadius: 50, marginLeft: 30}} source={{uri : host + user.avatar}} /> 
                <Text style={styles.name}>{user.fullname}</Text>
            </ImageBackground>
            <View style={styles.footer}>
                <ImageBackground source={require('../../assets/bgbottom.png')} style={styles.header}>
                <ScrollView>
                    <View style={styles.menubar}>
                        <Text style={styles.menutext}>Introducion</Text>
                    </View>
                    <View style={styles.menubar}>
                        <Text style={styles.menutext}>Tutorial</Text>
                    </View>
                    <View style={styles.menubar}>
                        <Text style={styles.menutext}>Terms & Subscription</Text>
                    </View>
                    <View style={styles.menubar}>
                        <TouchableOpacity onPress={logout}>
                            <Text style={styles.menutext}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                </ImageBackground>
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
        paddingTop: 35
    },  
    footer: {
        // paddingTop: 25,
        flex: 3
    },
    name: {
        fontSize: 20,
        fontWeight: '600',
        marginVertical: 14,
        marginLeft: 30
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
        paddingLeft: 20,
    }
})