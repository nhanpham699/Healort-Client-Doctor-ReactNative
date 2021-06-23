  
import React, {useEffect, useState} from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, FlatList,  RefreshControl} from 'react-native';
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from '../../styles/messageStyle';
import { Ionicons } from '@expo/vector-icons'; 
import host from '../../host'
import axios from 'axios'
import { useSelector } from 'react-redux'

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

const Messages = [
  {
    id: '1',
    userName: 'Rose',
    userImg: require('../../assets/rose.jpg'),
    messageTime: '4 mins ago',
    messageText: 'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '2',
    userName: 'Lisa',
    userImg: require('../../assets/lisa.jpg'),
    messageTime: '2 hours ago',
    messageText: 'Hey there, this is my test for a post of my social app in React Native.',
  }
];

const MessagesScreen = ({navigation}) => {

    const [messages, setMessages] = useState([])
    const { user } = useSelector(state => state.users)
    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => {
            setRefreshing(false)
            getMessages()
        })
    })
    const getMessages = async() => {
        const doctorsList = []
        const res = await axios.get(host + '/chats/getUserListMessages/' + user.id)
        const dataFilter = res.data.filter(dt => dt.messages.length != 0)
        for(let i of dataFilter){
          const { room } = i
          console.log(i);
          const doctorId = room.slice(0, room.indexOf('_'))
          const doctor = await axios.get(host + '/doctors/getdoctorbyid/' + doctorId)
          const newData = {
            ...doctor.data, 
            messageTime: (new Date(i.messages[0].createdAt).toString().slice(16,21)) + " " 
                        + (new Date(i.messages[0].createdAt).getDate()) + '/'
                        + (new Date(i.messages[0].createdAt).getMonth()+1), 
            messageText: i.messages[0].text
          }
          doctorsList.push(newData)
        }
        const newData = doctorsList.map(dt => {
            return {
              _id: dt._id,
              fullname: dt.fullname,
              avatar: dt.avatar,
              messageText: dt.messageText,
              messageTime: dt.messageTime
            }
        })
        // console.log(newData);
        setMessages(newData)
    }
    useEffect(() => {
        getMessages()
    },[])

    return (
      <View style={{flex: 1}}>
          <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={styles.back} name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headertext1}>Messages</Text> 
            </View>
            <Container>
                {messages.length ? 
                <FlatList
                refreshControl={
                  <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  /> 
                } 
                style={{marginTop: 20}}  
                data={messages}
                keyExtractor={item=>item._id}
                renderItem={({item}) => (
                    <Card onPress={() => navigation.navigate('Chat', {doctor: item})}>
                    <UserInfo>
                        <UserImgWrapper>
                        <UserImg source={{uri : host + item.avatar}} />
                        </UserImgWrapper>
                        <TextSection>
                        <UserInfoText>
                            <UserName>{item.fullname}</UserName>
                            <PostTime>{item.messageTime}</PostTime>
                        </UserInfoText>
                        <MessageText>{item.messageText}</MessageText>
                        </TextSection>
                    </UserInfo>
                    </Card>
                )}
                />
                 : <View style={{marginTop: '50%', alignItems: 'center'}}>
                    <Text style={{fontSize: 25, letterSpacing: 10}}>N0THING</Text>
                 </View> }
        </Container>
      </View>  
    );
};

export default MessagesScreen;

var styles = StyleSheet.create({
    header: {
        backgroundColor: 'white',
        flexDirection: 'row',
        height: 65,
    },
    headertext1: {
        flex: 1,
        lineHeight: 80,
        fontSize: 18,
        marginRight: 25,
        textAlign: 'center',
        fontWeight: '500'
    },
    back: {
        marginTop: 28,
        marginLeft: 15
    },
}) 