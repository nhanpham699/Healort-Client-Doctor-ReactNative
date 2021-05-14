import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Image,
    ScrollView
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient'

import {useSelector} from 'react-redux'
import axios from 'axios';
import host from '../../host';

export default function Notifications({navigation}){

    const { doctor } = useSelector(state => state.doctors)
    const [data, setData] = useState([])

    const getData = async () => {
        const res = await axios.get(host + '/notifications/getnotificationsbydoctor/' + doctor.id)
        const newData = res.data.filter(dt => dt.sender == "user")
        setData(newData)
        console.log(newData);
    }

    useEffect(() => {
        getData()
    },[])

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={styles.back} name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headertext1}>Notifications</Text> 
            </View>
            <ScrollView style={styles.content}>
                {data.length ? data.map((notif,index) => (
                    <View style={styles.item} key={index}>
                        <View style={{width: '25%'}}>
                            <Image 
                            source={{uri : host + notif.userId.avatar}}
                            style={styles.image} />
                        </View>
                        <View style={{width: '75%', marginTop: 7}}> 
                            <View>
                                <Text style={styles.textbody}>{notif.body}</Text>
                            </View>
                            <View>
                                <Text style={styles.textdate}>
                                {new Date(notif.date).toString().slice(16,21) + ' ' 
                                + (new Date(notif.date)).getDate() + '-' 
                                + ((new Date(notif.date)).getMonth() + 1) }
                                </Text>
                            </View>
                        </View>
                    </View>
                ))  : <View style={{marginTop: '50%', alignItems: 'center'}}>
                        <Text style={{fontSize: 25, letterSpacing: 10}}>N0THING</Text>
                      </View> }
            </ScrollView>
        </View>
    )
}
var styles = StyleSheet.create({
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
    content: {
        marginTop: 20,
        flex: 1,
        padding: 20,
        backgroundColor: 'white'
    },
    item: {
        flexDirection: 'row',
        marginBottom: 20
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 50
    },
    textbody: {
        fontWeight: '500'
    },
    textdate: {
        marginTop: 10
    },
})