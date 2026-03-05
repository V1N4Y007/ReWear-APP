import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }: any) {

  return (
    <View style={styles.container}>

      <Text style={styles.logo}>ReWear</Text>

      <Text style={styles.subtitle}>
        Community Clothing Exchange
      </Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.link}>
        Create New Account
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

container:{
flex:1,
justifyContent:'center',
padding:25,
backgroundColor:'#F5F7FA'
},

logo:{
fontSize:36,
fontWeight:'bold',
textAlign:'center',
marginBottom:10,
color:'#333'
},

subtitle:{
textAlign:'center',
marginBottom:40,
color:'#777'
},

input:{
borderWidth:1,
borderColor:'#ddd',
borderRadius:10,
padding:14,
marginBottom:15,
backgroundColor:'white'
},

button:{
backgroundColor:'#4CAF50',
padding:15,
borderRadius:10
},

buttonText:{
color:'white',
textAlign:'center',
fontWeight:'bold',
fontSize:16
},

link:{
marginTop:20,
textAlign:'center',
color:'#007AFF'
}

});