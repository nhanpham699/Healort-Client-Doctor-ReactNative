import React, { useState } from "react";
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; 
import { NavigationContainer, useNavigation } from "@react-navigation/native";


const DATA = [
  {
    id: "1",
    title: "Make a appointment",
    icon: "plus-square"
  },
  {
    id: "2",
    title: "Schedules",
    icon: "calendar"
  },
  {
    id: "3",
    title: "Doctors",
    icon: "user-md"
  },
  {
    id: "4",
    title: "Messages",
    icon: "comment"
  },
  {
    id: "5",
    title: "Examination history    ",
    icon: "star-half-empty"
  }
];



const Item = ({ item, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <FontAwesome name={item.icon} size={35} color="black" />
    <Text style={styles.title}>{item.title}</Text>
    <MaterialIcons 
    name="navigate-next" 
    size={24} 
    color="black" 
    style={{marginTop: 7}}/>
  </TouchableOpacity>
);

const Flatlist = ({}) => {
  const navigation = useNavigation()
  const [selectedId, setSelectedId] = useState(null);

  const renderItem = ({ item }) => {
  const backgroundColor = item.id === selectedId ? "#4000ff" : "white";

  const menuPress = (id) => {
    switch(id) {
        case '1':  return navigation.navigate('MakeaApp')
        case '2':  return navigation.navigate('Schedule')
        case '3':  return navigation.navigate('Doctor')
        case '4':  return navigation.navigate('Message')
        case '5':  return navigation.navigate('ExamHistory')
    }
  }

    return (
      <Item
        item={item}
        onPress={() => menuPress(item.id)}
        style={{ backgroundColor }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        extraData={selectedId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row'
  },
  title: {
    marginLeft: 20,
    marginTop: 5,
    fontSize: 22,
    flex: 1
  },
});

export default Flatlist;