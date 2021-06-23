import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native'
import host from '../../host'
import { FontAwesome, AntDesign, Ionicons } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient'

export default function DoctorDetail({navigation,route}){
    const { doctor } = route.params
    console.log(doctor);
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={styles.back} name="arrow-back" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Chat', {doctor: doctor})}>
                    <Ionicons style={styles.chat} name="chatbubble-ellipses-sharp" size={35} color="black" />
                </TouchableOpacity>
                <View style={{alignItems: 'center'}}>
                    <Image style={styles.avatar} source={{uri: host + doctor.avatar}} />
                </View>
            </View>
            <ScrollView style={styles.content}>
                <View style={{flexDirection: 'row', marginTop: 15}}>
                    <Text style={styles.name}>Dr. {doctor.fullname}</Text>
                    <View style={styles.review_layout}>
                        <Text style={styles.review_text}>{doctor.reviewAVG ? doctor.reviewAVG :'' }</Text>
                        <AntDesign name="star" size={13} color="black" />
                    </View>
                </View>
                <Text style={styles.hometown}>{doctor.hometown}</Text>
                <Text style={styles.year}>{doctor.birthyear}</Text>
                <Text style={styles.des}>{doctor.description}</Text>
                <View 
                style={{
                flexDirection: 'row', 
                justifyContent: 'center',
                marginTop: 50,
                paddingBottom: 40,
                borderBottomWidth: 0.4,
                borderBottomColor: 'silver'
                }}>
                    <View style={styles.ex}>
                        <Text style={styles.button_text1}>{doctor.experience}</Text>
                        <Text style={styles.button_text2}>Experience</Text>
                    </View>
                    <View style={styles.review_num}>
                        <Text style={styles.button_text1}>{doctor.review ? doctor.review.length : '0'}</Text>
                        <Text style={styles.button_text2}>Review</Text>
                    </View>
                </View>
                <View>
                    {doctor.review?.map((re,index) => (
                        <View key={index}>
                            {!re.state &&
                            <View style={styles.cmt_item}>
                                <Image style={styles.user_avatar} source={{uri: host + re.userId.avatar}}  />
                                <View style={{backgroundColor: '#e6e6e6', padding: 10, borderRadius: 10, marginLeft: 10}}>
                                    <Text style={[styles.cmt_text,{fontSize: 12}]}>{re.userId.fullname}</Text>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={styles.cmt_text}>{re.rating} </Text>
                                        <AntDesign style={{marginTop: 4.5}} name="star" size={13} color="orange" />
                                    </View>
                                    <Text style={styles.cmt_text}>{re.comment}</Text>
                                </View>
                            </View>
                            }
                        </View>
                    ))}
                </View>
                <View>
                    <TouchableOpacity  onPress={() => {
                        navigation.navigate("MakeaApp", {doctorId : doctor._id})
                    }}>
                        <View style={{alignItems: 'center', marginTop: 40}}>
                            <LinearGradient
                                colors={['#ECE9E6','#ffffff']}
                                style={styles.make}
                            >
                                <Text style={styles.make_text}>Make an appointment</Text>
                            </LinearGradient>
                        </View>
                    </TouchableOpacity> 
                </View>
            </ScrollView>
        </View>
    )
}

const styles = new StyleSheet.create({
    container:{
        flex: 1
    },
    header: {
        backgroundColor: 'silver',
        flex: 0.8,
        justifyContent: 'center',
        // borderBottomWidth: 0.3,
        // borderBottomColor: 'silver'
    },
    content:{
        flex: 2,
        padding: 20
    },
    avatar: {
        width: 200,
        height: 200,
        borderRadius: 40,
    },
    name: {
        fontSize: 25,
        fontWeight: '600',
    },
    hometown: {
        fontSize: 16,
        color: 'gray',
        marginTop: 10
    },
    year: {
        fontSize: 16,
        color: 'gray',
        marginTop: 10
    },
    des: {
        color: 'gray',
        marginTop: 15
    },
    review_layout: {
        marginLeft: 60,
        borderRadius: 10,
        backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: 55,
        height: 35
    },
    review_text: {
        fontSize: 17,
        paddingRight: 5
    },
    ex: {
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 130,
        height: 75,
        backgroundColor: '#ccddff'
    },
    review_num: {
        borderRadius: 10,
        marginLeft: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: 130,
        height: 75,
        backgroundColor: '#e0ccff'
    },
    button_text1: {
        fontSize: 27,
        color: '#003399'
    },
    button_text2: {
        fontSize: 16
    },
    make: {
        borderColor: '#00bfff',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: '80%',
        borderRadius: 10,
        marginBottom: 70
    },
    make_text: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontWeight: 'bold',
        fontSize: 16,
    },
    user_avatar: {
        width: 60,
        height: 60,
        borderRadius: 50
    },
    cmt_text: {
        marginTop: 3,
        fontWeight: '500'
    },
    cmt_item:{
        flexDirection: 'row',
        marginTop: 25
    },
    back: {
        position: 'absolute',
        top: -20,
        left: 15
    },
    chat: {
        position: 'absolute',
        position: 'absolute',
        top: -20,
        right: 15
    }
})