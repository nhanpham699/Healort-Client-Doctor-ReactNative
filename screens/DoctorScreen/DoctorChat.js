import React, {useState, useEffect, useCallback} from 'react';
import {View, ScrollView, Text, Button, StyleSheet, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios'
import host from '../../host'
import io from "socket.io-client";
import { useSelector } from 'react-redux';

const ChatScreen = ({navigation,route}) => {
    const { doctor } = useSelector(state => state.doctors)
    const socket = io(host);

    console.log(doctor);
    const [name, setName] = React.useState('');
    const [room, setRoom] = React.useState('');
    const [messages, setMessages] = React.useState([]);

    useEffect(() => {
      const name = doctor.fullname;
      const room = doctor.id + '_' +  route.params.user._id 

      axios.post(host + '/chats/createRoom', {room})
      axios.get(host + '/chats/showMessages/' + room).then(res => {setMessages(res.data.messages)})

      setName(name)
      setRoom(room)

      socket.emit('join', { name, room })

      socket.on('message', (message) => {
        if(message.data[0].user._id !== doctor.id) {
          setMessages(previousMessages => GiftedChat.append(previousMessages, message.data[0]))
        }
      })

     
      // console.log(a);
      const unsubscribe = navigation.addListener('beforeRemove', () => {
        socket.emit('dis');
        socket.off()
      });
  
      return unsubscribe;


    }, []);

    const onSend = useCallback((message = {}) => {
      const newMessageData = message.map(dt => {
        return {...dt, user: {
            _id: doctor.id,
            avatar: doctor.avatar,
            name: doctor.fullname
        }}
    })
      socket.emit('sendMessage', newMessageData);  
      setMessages((previousMessages) =>{
          return GiftedChat.append(previousMessages, message)
      });
    }, []);

    const renderSend = (props) => {
      return (
        <Send {...props}>
          <View>
            <MaterialCommunityIcons
              name="send-circle"
              style={{marginBottom: 5, marginRight: 5}}
              size={32}
              color="#2e64e5"
            />
          </View>
        </Send>
      );
    };

    const renderBubble = (props) => {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: '#2e64e5',
            },
          }}
          textStyle={{
            right: {
              color: '#fff',
            },
          }}
        />
      );
    };

    const scrollToBottomComponent = () => {
      return(
        <FontAwesome name='angle-double-down' size={22} color='#333' />
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons style={styles.back} name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headertext1}>{doctor.fullname}</Text> 
        </View>
        <View style={styles.body}>  
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: doctor.id,
            avatar: `${host}/${doctor.avatar}`,
            name: doctor.fullname
          }}
          renderBubble={renderBubble}
          alwaysShowSend
          renderSend={renderSend}
          scrollToBottom
          scrollToBottomComponent={scrollToBottomComponent}
        />
        </View>
      </View>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  RealtimeChatHeader: {
    flexDirection: 'row',
    padding: 10,
  },

  SearchHeader: {
      flexDirection: 'row',
      padding: 10,
      opacity: 0
  },

  body: {
      flex: 1,
      justifyContent: 'center',
  },

  myMessage: {
      borderWidth: 1,
  },

  footer: {
      // borderWidth: 1, 
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
  },

  textMessage: {
      flex: 1, 
      borderWidth: 1,
      borderRadius: 20,
      paddingVertical: 4,
      paddingHorizontal: 10,
      marginHorizontal: 10,
  },

  buttonMessage: {
      padding: 10, 
  }
});