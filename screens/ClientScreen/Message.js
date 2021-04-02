  
import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
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
} from '../styles/messageStyle';
import { Ionicons } from '@expo/vector-icons'; 


const Messages = [
  {
    id: '1',
    userName: 'Rose',
    userImg: require('../assets/rose.jpg'),
    messageTime: '4 mins ago',
    messageText: 'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '2',
    userName: 'Lisa',
    userImg: require('../assets/lisa.jpg'),
    messageTime: '2 hours ago',
    messageText: 'Hey there, this is my test for a post of my social app in React Native.',
  }
];

const MessagesScreen = ({navigation}) => {
    return (
      <View style={{flex: 1}}>
          <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={styles.back} name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headertext1}>Messages</Text> 
            </View>
            <Container>
                <FlatList 
                style={{marginTop: 20}}  
                data={Messages}
                keyExtractor={item=>item.id}
                renderItem={({item}) => (
                    <Card onPress={() => navigation.navigate('Chat', {userName: item.userName})}>
                    <UserInfo>
                        <UserImgWrapper>
                        <UserImg source={item.userImg} />
                        </UserImgWrapper>
                        <TextSection>
                        <UserInfoText>
                            <UserName>{item.userName}</UserName>
                            <PostTime>{item.messageTime}</PostTime>
                        </UserInfoText>
                        <MessageText>{item.messageText}</MessageText>
                        </TextSection>
                    </UserInfo>
                    </Card>
                )}
                />
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