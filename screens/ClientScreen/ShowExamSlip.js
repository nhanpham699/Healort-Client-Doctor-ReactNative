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
import { Ionicons } from '@expo/vector-icons'; 



export default function ExamSlip({navigation, route}){
    
    const { schedule } = route.params

    return(
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={styles.back} name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headertext1}>Examination Slip</Text> 
            </View>
            <View style={styles.content2}>
                <View style={styles.title}>
                    <Text style={styles.text_title}>Examination informations</Text>
                </View>
                <ScrollView>
                    <View style={styles.footer_component}>
                        <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]}>Doctor:</Text>
                        <Text style={[styles.footer_text, styles.footer_right]}>{schedule.doctorId.fullname}</Text>
                    </View>
                    <View style={styles.footer_component}>
                        <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]}>Date:</Text>
                        <Text style={[styles.footer_text, styles.footer_right]}>{schedule.date.toString().slice(0,10)}</Text>
                    </View>
                    <View style={styles.footer_component}>
                        <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]} >Time:</Text>
                        <Text style={[styles.footer_text, styles.footer_right]} >{schedule.begin}:00</Text>
                    </View>
                    <View style={styles.footer_component}>
                        <View style={styles.footer_left}>
                            <Text style={[styles.footer_text, styles.footer_title]}>Services:</Text>
                        </View>
                        <View style={[styles.footer_right, {marginTop: 13}]}>
                        {schedule.services.map((ser,index) => (
                            <View key={index} >
                            {(ser == 0) && <Text style={styles.service_text}>Tooth extraction (100$)</Text>}
                            {(ser == 1) && <Text style={styles.service_text}>Fillings (50$)</Text>}
                            {(ser == 2) && <Text style={styles.service_text}>Dental implants (500$)</Text>}
                            </View>
                        ))} 
                        </View> 
                    </View>
                    <View style={styles.footer_component}>
                        <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]} >Total:</Text>
                        <Text style={[styles.footer_text, styles.footer_right]} >{schedule.total}$</Text>
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
                        <Text style={[styles.footer_text, styles.footer_right]}>{schedule.userId.fullname}</Text>
                    </View>
                    <View style={styles.footer_component}>
                        <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]} >Date Birth:</Text>
                        <Text style={[styles.footer_text, styles.footer_right]} >{schedule.userId.date.toString().slice(0,10)}</Text>
                    </View>
                    <View style={styles.footer_component}>
                        <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]} >Gender:</Text>
                        <Text style={[styles.footer_text, styles.footer_right]} >{schedule.userId.gender ? 'Male' : 'Female'}</Text>
                    </View>
                    <View style={styles.footer_component}>
                        <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]} >Phone:</Text>
                        <Text style={[styles.footer_text, styles.footer_right]} >{schedule.userId.phone}</Text>
                    </View>
                    <View style={styles.footer_component}>
                        <Text style={[styles.footer_text, styles.footer_left, styles.footer_title]} >Address:</Text>
                        <Text style={[styles.footer_text, styles.footer_right]} >{schedule.userId.address.street + ', ' 
                                                                                + schedule.userId.address.ward + ', ' 
                                                                                + schedule.userId.address.district + ', '
                                                                                + schedule.userId.address.city}</Text>
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
        backgroundColor: 'white',
        flexDirection: 'row',
        height: 65,
    },
    headertext1: {
        flex: 1,
        lineHeight: 80,
        fontSize: 18,
        marginRight: 35,
        textAlign: 'center',
        fontWeight: '500'
    },
    back: {
        marginTop: 28,
        marginLeft: 15
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