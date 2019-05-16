import React from 'react';
import {
  Image,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Picker,
} from 'react-native';
import { WebBrowser } from 'expo';
import { Dropdown } from "react-native-material-dropdown";

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.state = { text: 'http://localhost:3000/postExample', request: '', result: '', tabBarIsVisible: false, objListIsVisible: false, objText: '{ “Key” : “Value” }' };
  }

  showTabBar(isVisible){
    if(isVisible){
      return (
      <View style={styles.tabBarInfoContainer}>
        <Button
          onPress={this.tabButtonPressed}
          title="Send Request"
          color="#3498db"
        />
      </View> )
    }
  }

  tabButtonPressed = () => {
    let rawString = this.state.objText.replace(/[“”‘’]/g,'\"');
    var data;
    try{
      data = JSON.parse(rawString);
    } catch(e){
      this.setState({objText: this.state.objText}) //TODO: add label warning for bad json string
    }
    if(data != undefined){
      console.log("Success");
      fetch(this.state.text, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })    
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({result: JSON.stringify(responseJson).replace(/[,]/g,'\n')});
      });
    }
    return;
  }

  showObjList(){
    if(this.state.showObjList){
      return (
        <View>
          <Text style={styles.smallTextLabel}>BODY:</Text>
          <TextInput
            style={styles.textField}
            editable = {true}
            maxLength = {1040}
            multiline = {true}
            onChangeText={(objText) => this.setState({objText})}
            value={this.state.objText}
          />
        </View>
      )}
  }

  showResults(){
    if(this.state.result){
      return (
        <View>
          <Text style={styles.smallTextLabel}>RESULT:</Text>
          <TextInput
            style={styles.textField}
            editable = {false}
            maxLength = {1040}
            multiline = {true}
            value={this.state.result}
          />
        </View>
      )}
  }

  requestTypeSet(request){
    (request) => this.setState({request});
    this.setState({tabBarIsVisible: true});
    if(request == "POST"){
      this.setState({showObjList: true})
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>Get started by sending a request</Text>
          </View>

          <View style={{width: '80%', marginLeft: '10%'}}>
            <Dropdown
              label='Request Type'
              data={[{value: "GET",}, {value: "POST",}]}
              onChangeText={(request) => this.requestTypeSet(request)}
            />
            <Text style={styles.smallTextLabel}>URL:</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
            />
            {this.showObjList()}
            {this.showResults()}
          </View>
        </ScrollView>
        {this.showTabBar(this.state.tabBarIsVisible)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  smallTextLabel:{marginTop: 30, fontSize: 10, color: "#111111"},
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  textInput: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  textField: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    height: 100,
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
