import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function DashboardScreen(){

return(

<ScrollView style={styles.container}>

<Text style={styles.header}>ReWear Items</Text>

<View style={styles.card}>
<Text style={styles.title}>Denim Jacket</Text>
<Text>Size: M</Text>
<Text>Condition: Good</Text>

<TouchableOpacity style={styles.button}>
<Text style={styles.buttonText}>View Item</Text>
</TouchableOpacity>

</View>

<View style={styles.card}>
<Text style={styles.title}>Black Hoodie</Text>
<Text>Size: L</Text>
<Text>Condition: Excellent</Text>

<TouchableOpacity style={styles.button}>
<Text style={styles.buttonText}>View Item</Text>
</TouchableOpacity>

</View>

<View style={styles.card}>
<Text style={styles.title}>White Shirt</Text>
<Text>Size: S</Text>
<Text>Condition: Like New</Text>

<TouchableOpacity style={styles.button}>
<Text style={styles.buttonText}>View Item</Text>
</TouchableOpacity>

</View>

</ScrollView>

)

}

const styles = StyleSheet.create({

container:{
flex:1,
padding:20,
backgroundColor:'#F5F7FA'
},

header:{
fontSize:28,
fontWeight:'bold',
marginBottom:20
},

card:{
backgroundColor:'white',
padding:18,
borderRadius:12,
marginBottom:15,
elevation:4
},

title:{
fontSize:18,
fontWeight:'bold'
},

button:{
marginTop:10,
backgroundColor:'#4CAF50',
padding:10,
borderRadius:8
},

buttonText:{
color:'white',
textAlign:'center'
}

});