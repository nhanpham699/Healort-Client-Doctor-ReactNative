import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    StatusBar
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'; 
import axios from 'axios';
import host from '../../host';
import {useSelector} from 'react-redux'


export default function ExamSlip({navigation, route}){
    
    const { data, doctor } = route.params
    const { user } = useSelector(state => state.users)

    const handleCompleted = () => {
        Alert.alert(
            "Successfully",
            "Please check your schedule in the schedule section",
            [
              { text: "OK", onPress: () => {
                  navigation.navigate('Home')
                }}
            ]
        );
    }

    // useEffect(() => {
    //     (async () => {
    //         const backHandler = await BackHandler.removeEventListener('hardwareBackPress', () => true);
    //         return () => backHandler.remove();
    //     })();
    // })

    return(
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.headertext1}>Examination slip</Text> 
            </View>
            <View style={styles.content2}>
                <View style={styles.title}>
                    <Text style={styles.text_title}>Examination informations</Text>
                </View>
                <ScrollView>
                    <View style={styles.footer_component}>
                        <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]}>Doctor:</Text>
                        <Text style={[styles.footer_text, styles.footer_right]}>{doctor.fullname}</Text>
                    </View>
                    <View style={styles.footer_component}>
                        <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]}>Date:</Text>
                        <Text style={[styles.footer_text, styles.footer_right]}>{data.date}</Text>
                    </View>
                    <View style={styles.footer_component}>
                        <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]} >Time:</Text>
                        <Text style={[styles.footer_text, styles.footer_right]} >{data.begin}:00</Text>
                    </View>
                    <View style={styles.footer_component}>
                        <View style={styles.footer_left}>
                            <Text style={[styles.footer_text, styles.footer_title]}>Services:</Text>
                        </View>
                        <View style={[styles.footer_right, {marginTop: 13}]}>
                        {data.services.map((ser,index) => (
                            <View key={index} >
                                <Text style={styles.service_text}>{ser.name} ({ser.price}$)</Text>
                            </View>
                        ))} 
                        </View> 
                    </View>
                    <View style={styles.footer_component}>
                        <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]} >Total:</Text>
                        <Text style={[styles.footer_text, styles.footer_right]} >{data.total}$</Text>
                    </View>
                    <View style={styles.footer_component}>
                        <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]} >Address:</Text>
                        <Text style={[styles.footer_text, styles.footer_right]} >A46 Korea</Text>
                    </View>
                </ScrollView>
            </View>
            <View style={styles.footer}>
                <View style={styles.title}>
                    <Text style={styles.text_title}>User informations</Text>
                </View>
                <ScrollView>
                    <View style={styles.footer_component}>
                        <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]}>Name:</Text>
                        <Text style={[styles.footer_text, styles.footer_right]}>{user.fullname}</Text>
                    </View>
                    <View style={styles.footer_component}>
                        <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]} >Date Birth:</Text>
                        <Text style={[styles.footer_text, styles.footer_right]} >{user.date.toString().slice(0,10)}</Text>
                    </View>
                    <View style={styles.footer_component}>
                        <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]} >Gender:</Text>
                        <Text style={[styles.footer_text, styles.footer_right]} >{user.gender ? 'Male' : 'Female'}</Text>
                    </View>
                    <View style={styles.footer_component}>
                        <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]} >Phone:</Text>
                        <Text style={[styles.footer_text, styles.footer_right]} >{user.phone}</Text>
                    </View>
                    <View style={styles.footer_component}>
                        <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]} >Address:</Text>
                        <Text style={[styles.footer_text, styles.footer_right]} >{user.address.street + ', ' 
                                                                                + user.address.ward + ', ' 
                                                                                + user.address.district + ', '
                                                                                + user.address.city}</Text>
                    </View>
                </ScrollView>
            </View>
            <View style={styles.bottom}>
                <TouchableOpacity onPress={handleCompleted}>
                    <View style={styles.button}>
                        <LinearGradient
                            colors={['#99ffff', '#80ffff']}
                            style={styles.make}
                        >
                            <Text style={styles.make_text}>Complete</Text>
                        </LinearGradient>
                    </View>
                </TouchableOpacity> 
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },  
    header: {
        backgroundColor: 'white',
        flexDirection: 'row',
        height: 65,
    },
    headertext1: {
        flex: 1,
        lineHeight: 80,
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '500'
    },
    content1: {
        flex: 2,
        backgroundColor: 'white',
    },
    content2: {
        flex: 2,
        backgroundColor: 'white',
        paddingBottom: 20
    },
    footer: {
        flex: 2,
        backgroundColor: 'white',
        paddingBottom: 30
    },
    title: {
        backgroundColor: '#f2f2f2',
        height: 40,
        paddingLeft: 20
    },
    text_title: {
        fontWeight: '500',
        fontSize: 17,
        lineHeight: 40
    },
    footer_text: {
        fontSize: 15,
        marginTop: 20
    },
    footer_left: {
        textAlign: 'left',
        width: '44%'
    },
    footer_right:{
        textAlign: 'right',
        width: '56%',      
        alignItems: 'flex-end'
    },
    footer_title: {
        color: 'black',
        fontWeight: '500'
    },
    footer_component:{
        paddingHorizontal: 25,
        flexDirection: 'row'
    },
    service_text:{
        fontSize: 14,
        marginTop: 7
    }, 
    make: {
        borderColor: '#00bfff',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: '60%',
        borderRadius: 10,
        marginBottom: 40
    },
    make_text: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontWeight: 'bold',
        fontSize: 16,
    },
    bottom: {
        backgroundColor: 'white'
    },
    button: {
        alignItems: 'center',
    }
})