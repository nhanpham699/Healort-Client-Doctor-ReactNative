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
    const { user } = useSelector(state => state.users)

    const socket = io(host);

    const { doctor } = route.params

    // console.log(route);

    const [name, setName] = React.useState('');
    const [room, setRoom] = React.useState('');
    const [messages, setMessages] = React.useState([]);

    useEffect(() => {
      const name = user.fullname;
      const room = doctor._id + '_' + user.id;

      axios.post(host + '/chats/createRoom', {room})
      axios.get(host + '/chats/showMessages/' + room).then(res => {setMessages(res.data.messages)})

      setName(name)
      setRoom(room)

      socket.emit('join', { name, room })

      socket.on('message', (message) => {
        if(message.data[0].user._id !== user.id) {
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
      // console.log(message);
      const newMessageData = message.map(dt => {
          return {...dt, user: {
              _id: user.id,
              avatar: user.avatar,
              name: user.fullname
          }}
      })
      // console.log(newMessageData);
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

    // const TitleHeader = () => {
    //   return (
    //     <View style={styles.titleHeader}>
    //       <Text style={styles.titleHeader_text}>
    //           Doctor {route.params.doctorName}
    //       </Text>
    //       <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
    //           <Text style={{ fontWeight: 'bold', color: 'yellow' }}>Doctor</Text>
    //       </View>
    //   </View>
    //   )
    // }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons style={styles.back} name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headertext1}>{doctor.fullname}</Text> 
        </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user.id,
          name: user.fullname,
          avatar: host + user.avatar
        }}
        renderBubble={renderBubble}
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
      />
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
  titleHeader: {
    flex: 1,
    // backgroundColor: '#000',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    paddingRight: 5,
  },

  titleHeader_text: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#fff',
      paddingLeft: 15,    
  },
});