
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View, AsyncStorage} from 'react-native'
import {addDoctor} from '../actions/doctor'
import {useDispatch} from 'react-redux'
import host from '../host'
import axios from 'axios'

export default function DoctorLoading({navigation}) {
    const dispatch = useDispatch()

    const changePage = async () => {
        console.log("assssssssssssss");
        const DoctorToken = await AsyncStorage.getItem('DoctorToken')

        if(DoctorToken){
            await axios.get(host + '/doctors/getdoctor', {
                headers: {
                    Authorization: `Bearer ${DoctorToken}`,
                },
            }).then(async (res) => {
                await dispatch(addDoctor(res.data.dataSending))
                navigation.replace('DoctorHome')
            })
        }else{
            navigation.replace('DoctorLogin')
        } 
    }
    
    useEffect(() => {
        setTimeout(() => {
            changePage()
        },3000)
    },[])


    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size="large" />
        </View>
    )
    
}