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
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  TouchableNativeFeedback,
  Vibration
} from 'react-native';
import { WebBrowser } from 'expo';
import { Dropdown } from "react-native-material-dropdown";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

import { MonoText } from '../components/StyledText';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.paddingInput = new Animated.Value(0);
    this.state = { 
      text: 'https://shrouded-ravine-84811.herokuapp.com/postExample', 
      request: '', 
      result: '', 
      tabBarIsVisible: false, 
      objListIsVisible: false, 
      objText: '{ “Key” : “Value” }',
      keyboardTabBarIsVisible: false, 
    };
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
}

componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
}

keyboardWillShow = (event) => {
    Animated.timing(this.paddingInput, {
        duration: event.duration,
        toValue: 60,
    }).start();
    this.setState({keyboardTabBarIsVisible: true})
};

keyboardWillHide = (event) => {
    Animated.timing(this.paddingInput, {
        duration: event.duration,
        toValue: 0,
    }).start();
    this.setState({keyboardTabBarIsVisible: false})
};

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
      this.setState({result: ''});
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
    if(this.state.showObjList && this.state.request == 'POST'){
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

  keyboardTabBar = (showTabBar) => {
    if(showTabBar){
      return(
        <KeyboardAvoidingView behavior='padding' style={{ flex: 0.1, }} keyboardVerticalOffset={
          Platform.select({
             ios: () => 0,
             android: () => 200
          })()} enabled>
            <Animated.View style={{ marginBottom: this.paddingInput }}>
              <View style={styles.keyboardTabBar}>
                {this.tabItems()}
              </View>
            </Animated.View>
        </KeyboardAvoidingView>
      )
    }
  }

  requestTypeSet(newRequest){
    this.setState({request: newRequest});
    this.setState({tabBarIsVisible: true});
    if(newRequest == "POST"){
      this.setState({showObjList: true})
    }
  }

  tabItems = () => {
    if(this.state.request == 'POST'){
      return (
        <View style={{
          flexWrap: 'wrap', 
          alignItems: 'flex-start',
          flexDirection:'row',}}>
          <TouchableOpacity style={{ left: '2%', height: 40, width: '12%', backgroundColor: '#eb4d4b', borderRadius: 15, shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 2, justifyContent: 'center',
            alignItems: 'center'}}
            onPress={() => {
              this.setState({objText: (this.state.objText + '{')});
            }}>
            <Text style={{color: '#FFFFFF', textAlign: "center"}}>{'{'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ left: '5%', height: 40, width: '12%', backgroundColor: '#eb4d4b', borderRadius: 15, shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 2, justifyContent: 'center',
            alignItems: 'center'}}
            onPress={() => {
              this.setState({objText: (this.state.objText + '}')});
            }}>
            <Text style={{color: '#FFFFFF', textAlign: "center"}}>{'}'}</Text>
          </TouchableOpacity>

        </View>
      )
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
        {this.keyboardTabBar(this.state.keyboardTabBarIsVisible)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardTabBar: {
    //height: 50,
    width: '100%',
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
