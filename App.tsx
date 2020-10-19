import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
var { width } = Dimensions.get("window")

// import Components
import Food from './src/Food'
import Cart from './src/Cart'
// unable console yellow
console.disableYellowBox = true;
// import icons
import Icon from 'react-native-vector-icons/Ionicons';

export default class App extends Component {

  constructor(props: Readonly<{}>) {
     super(props);
     this.state = {
       module:1,
     };
  }

  render() {
    return (
      <View style={{flex:1}}>
         {
          this.state.module==1? <Food />
          :<Cart />
         }
         <View style={styles.bottomTab}>
           <TouchableOpacity style={styles.itemTab} onPress={()=>this.setState({module:1})}>
             <Icon name="md-restaurant" size={20} color={this.state.module==1?"#900":"gray"} />
             <Text style={{fontSize: 12}}>Cardápio</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.itemTab} onPress={()=>this.setState({module:2})}>
             <Icon name="md-basket" size={20} color={this.state.module==2?"#900":"gray"} />
             <Text style={{fontSize: 12}}>Seu Pedido</Text>
           </TouchableOpacity>
         </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottomTab:{
    height:40,
    width:width,
    backgroundColor:'white',
    flexDirection:'row',
    justifyContent:'space-between',
    elevation:8,
    shadowOpacity:0.3,
    shadowRadius:50,
  },
  itemTab:{
    width:width/2,
    backgroundColor:'white',
    alignItems:'center',
    justifyContent:'center'
  }
})