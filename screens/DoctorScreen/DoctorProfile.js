import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Button,
    Image,
    ScrollView,
    AsyncStorage,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { FontAwesome,Ionicons} from '@expo/vector-icons'; 
import RNPickerSelect from "react-native-picker-select";








export default function Profile({navigation}) {


    const { doctor } = useSelector(state => state.doctors)

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={styles.back} name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headertext1}>Personal Information</Text>
            </View>
            
            <View style={styles.content}>          
                <View style={styles.avatar}> 
                    <FontAwesome name="user-circle-o" size={70} color="black" /> 
                </View> 
                <View style={styles.infor}>
                    <View style={styles.infortextborder}>
                        <TextInput 
                        editable={false}
                        style={styles.infortext} 
                        defaultValue={doctor.fullname} />
                    </View>
                    <View>
                        <TextInput 
                        style={{fontSize: 14, marginTop: 15, fontWeight: '500'}}
                        editable={false} 
                        defaultValue="Doctor's Healort dental clinic" />
                    </View>
                </View>
            </View>
            <ScrollView style={styles.footer}>
                <View>
                    <Text style={styles.label}>Birth Year</Text>
                    <TextInput 
                        value={doctor.birthyear}
                        editable={false}
                        placeholder="Your date birth" 
                        style={styles.text_input} 
                        autoCapitalize="none" />
                </View>
                <View>
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.select} >
                        <RNPickerSelect
                            disabled={true}
                            value={doctor.gender == 0 ? 'Male' : 'Female'}
                            onValueChange={(value) => console.log(value)}
                            items={[
                                { label: "Male", value: "Male" },
                                { label: "Female", value: "Female" },
                                { label: "Other", value: "Other" }
                            ]}
                            style={pickerSelectStyles} />
                    </View>
                </View>
                <View>
                    <Text style={styles.label}>Email</Text>
                    <TextInput 
                        editable={false}
                        defaultValue={doctor.email}
                        placeholder="Your email" 
                        style={styles.text_input} 
                        autoCapitalize="none" />
                </View>
                <View>
                    <Text style={styles.label}>Phone</Text>
                    <TextInput 
                        editable={false}
                        defaultValue={doctor.phone}
                        placeholder="Your email" 
                        style={styles.text_input} 
                        autoCapitalize="none"
                    />
                </View>
                <View>
                    <Text style={styles.label}>Hometown</Text>
                    <TextInput 
                        editable={false}
                        defaultValue={doctor.hometown}
                        placeholder="Your email" 
                        style={styles.text_input} 
                        autoCapitalize="none"
                    />
                </View>     
            </ScrollView>
        </View>
        </KeyboardAvoidingView>
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
        textAlign: 'center',
        fontWeight: 'bold'
    },
    headertext2: {
        color: '#6495ED',
        fontSize: 15,
        lineHeight: 80,
        paddingRight: 10,
        fontWeight: 'bold'
    },
    back: {
        marginTop: 28,
        marginLeft: 15
    },
    content: {
        flexDirection: 'row',
        marginTop: 20,
        backgroundColor: 'white',
        height: 100
    },
    avatar: {
        marginTop: 15,
        marginLeft: 30
    },
    infor: {
        marginLeft: 25,
        marginTop: 15,
    },
    infortext: {
        // textTransform: 'uppercase',
        fontSize: 18,
    },
    infortextborder: {
        width: 275,
        height: 30,
        borderBottomWidth: 2,
        borderBottomColor: '#f2f2f2',
        marginTop: 5
    },
    camicon: {
        marginTop: 7,
        marginLeft: 140,
    },
    footer: {
        paddingHorizontal: 20,
        backgroundColor: 'white',
        marginTop: 20, 
        flex: 1,
    },
    label: {
        color: 'gray',
        marginTop: 20,
        fontSize: 18
    },
    text_input: {
        height: 40,
        borderRadius: 6,
        marginLeft: 5,
        marginTop: 10,
        backgroundColor: '#f2f2f2',
        paddingLeft: 10
    },
    select: {
        flexDirection: 'row',
    },
    iconDown: {
        position: 'relative',
        right: 30,
        top: 20
    }
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        width: 367,
        height: 40,
        borderRadius: 6,
        marginLeft: 5,
        marginTop: 10,
        backgroundColor: '#f2f2f2',
        paddingLeft: 10
    },
    inputAndroid: {
        width: 367,
        height: 40,
        borderRadius: 6,
        marginLeft: 5,
        marginTop: 10,
        backgroundColor: '#f2f2f2',
        paddingLeft: 10
    },
  });