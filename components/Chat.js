import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import { AsyncStorage } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const firebase = require('firebase');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyD_6hXP8NEwcextI1UPrNwSKXZiya1pabU",
  authDomain: "chat-app-3d860.firebaseapp.com",
  projectId: "chat-app-3d860",
  storageBucket: "chat-app-3d860.appspot.com",
  messagingSenderId: "943157882112",
};

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uuid: 0,
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      isConnected: false,
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");

  }

  // Async, get messages
  getMessages = async () => {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // Async, save messages
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem(
        'messages',
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  // Async, delete messages
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  componentDidMount() {
    let { name } = this.props.route.params;
    // Add name to header
    this.props.navigation.setOptions({ title: name });

    this.getMessages();

    // Check online status
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('online');
        // listen for updates in the collection
        this.unsubscribe = this.referenceChatMessages
          .orderBy('createdAt', 'desc')
          .onSnapshot(this.onCollectionUpdate);

        // Authenticate user
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }

            // Update state with signed in user
            this.setState({
              uid: user.uid,
              messages: [],
              user: {
                _id: user.uid,
                name: name,
                avatar: 'https://placeimg.com/140/140/any',
              },
            });
            // Access stored messages of current user
            this.refMsgsUser = firebase
              .firestore()
              .collection('messages')
              .where('uid', '==', this.state.uid);
          });
        // save messages locally to AsyncStorage when online
        this.saveMessages();
      } else {
        // If the user is offline...
        this.setState({ isConnected: false });
        console.log('offline');
        // retrieve messages from asyncstorage
        this.getMessages();
      }
    });
  }

  // Add message to state
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.saveMessages();
        this.addMessages();
      }
    );
  }

  //Add message to database
  addMessages() {
    const message = this.state.messages[0];
    // add a new messages to the collection
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: this.state.user,
    });
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }

  // On update, sets the messages' state with the current data
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
      });
    });
    this.setState({
      messages: messages,
    });
    this.saveMessages();
  };

  componentWillUnmount() {
    if (this.state.isConnected) {
      // stop listening to authentication
      this.authUnsubscribe();
      // stop listening for changes
      this.unsubscribe();
    }
  }

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }

  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    const { bgColor } = this.props.route.params;

    return (
      <View style={{ backgroundColor: bgColor, flex: 1 }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.user._id,
            name: this.state.user.name,
            avatar: this.state.user.avatar,
          }}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    );
  }
}