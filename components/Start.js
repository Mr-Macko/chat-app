import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Pressable, TextInput, ImageBackground, Image, TouchableOpacity } from 'react-native';

// Custom assets
const image = require('../assets/Background-Image.png');

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    // Default state of user name and background color
    this.state = {
      name: '',
      bgColor: this.colors.purple,
    };
  }
  // Funcation for user to select background state for chat screen
  changeBgColor = (newColor) => {
    this.setState({ bgColor: newColor });
  };

  // Color array for chat background
  colors = {
    black: '#090C08',
    purple: '#474056',
    blue: '#8A95A5',
    green: '#B9C6AE',
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
          <View
            accessible={false}
            accessibilityLabel="Chat App"
            accessibilityHint="Chat App title"
            accessibilityRole="header"
            style={styles.titleBox}
          >
            <Text style={styles.title}>Chat App</Text>
          </View>

          <View style={styles.loginBox}>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => this.setState({ name: text })}
                value={this.state.name}
                placeholder="Enter your name"
              />
            </View>

            <View style={styles.colorBox}>
              <Text style={styles.colorText}>Choose Background Color:</Text>
            </View>

            <View style={styles.colorArray}>
              <TouchableOpacity
                style={styles.color1}
                onPress={() => this.changeBgColor(this.colors.black)}
              ></TouchableOpacity>
              <TouchableOpacity
                style={styles.color2}
                onPress={() => this.changeBgColor(this.colors.purple)}
              ></TouchableOpacity>
              <TouchableOpacity
                style={styles.color3}
                onPress={() => this.changeBgColor(this.colors.blue)}
              ></TouchableOpacity>
              <TouchableOpacity
                style={styles.color4}
                onPress={() => this.changeBgColor(this.colors.green)}
              ></TouchableOpacity>
            </View>

            <Pressable
              accessible={true}
              accessibilityLabel="Start Chatting"
              accessibilityHint="Let's you join the chat"
              accessibilityRole="button"
              style={styles.button}
              onPress={() =>
                this.props.navigation.navigate('Chat', {
                  name: this.state.name,
                  bgColor: this.state.bgColor,
                })
              }
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

// Style sheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBox: {
    height: '50%',
    width: '80%',
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    padding: 20,
  },
  loginBox: {
    marginBottom: 20,
    backgroundColor: 'white',
    flexGrow: 1,
    flexShrink: 0,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 15,
    height: 250,
    minHeight: 250,
    maxHeight: 300,
    height: '44%',
    width: '88%',
  },
  inputBox: {
    flexDirection: 'row',
    width: '88%',
    borderColor: '#757083',
    borderWidth: 1,
    padding: 10,
    color: '#757083',
    opacity: 0.5,
  },
  imageIcon: {
    padding: 10,
    margin: 5,
    height: 20,
    width: 20,
    resizeMode: 'stretch',
    alignItems: 'center',
    opacity: 0.5,
  },
  userIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  colorBox: {
    flexDirection: 'column',
    width: '88%',
  },
  colorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 1,
  },
  colorArray: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '88%',
  },
  color1: {
    backgroundColor: '#090C08',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  color2: {
    backgroundColor: '#474056',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  color3: {
    backgroundColor: '#8A95A5',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  color4: {
    backgroundColor: '#B9C6AE',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  button: {
    flexDirection: 'column',
    backgroundColor: '#757083',
    width: '88%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    padding: 20,
  },
});