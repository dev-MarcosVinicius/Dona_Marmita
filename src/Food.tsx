import React, { Component } from 'react';
import { Text, FlatList,Image,StyleSheet,Dimensions,View,TouchableOpacity} from 'react-native';
var {height, width } = Dimensions.get('window');
import {Snackbar} from 'react-native-paper'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import db from '../DB/db.json';
import { SafeAreaView } from 'react-native-safe-area-context';

export default class App extends Component {

  constructor(props: Readonly<{}>)
  {
    super(props);
    this.state = {
      dataFood:[],
      visible: false,
    }
  }

  componentDidMount(){
    return (
      this.setState({
        isLoading: false,
        dataFood:db
      })

    )
  }

  _renderItemFood(item: { image: any; name: React.ReactNode; price: React.ReactNode; }){
      return(
        <View style={styles.divFood}>
          <View style={{flexDirection:'row'}}>
          <Image
            style={styles.imageFood}
            resizeMode="contain"
            source={{uri:item.image}} />
            <View style={{height:((width/2)-20)-90, backgroundColor:'transparent', width:((width/2)-20)-10}} />
            <View style={{flexDirection:'column'}}>
            <Text style={{fontWeight:'bold',fontSize:22,textAlign:'center'}}>
              {item.name}
            </Text>
            <Text style={{fontSize:20, textAlign:'left', marginBottom:40,color:'#b51b13',fontWeight:'bold'}}>
              R${item.price}
            </Text>
            </View>
            </View>
            <TouchableOpacity
            onPress={()=>this.onClickAddCart(item)}
            style={{
              backgroundColor:'#b51b13',
              flexDirection:'row',
              alignItems:'center',
              justifyContent:"center",
              borderRadius:5,
              padding:4
            }}>
            <Text style={{fontSize:18, color:"white", fontWeight:"bold"}}>Adicionar ao Pedido</Text>
            <View style={{width:10}} />
            <Icon name="ios-add-circle" size={30} color={"white"} />
          </TouchableOpacity>
          </View>
        )
  }

  onClickAddCart(data: { quantity: any; price: any; name: any; id: any; image: any; }){
    const itemcart = {
      quantity:  data.quantity,
      price: data.price,
      name: data.name,
      id: data.id,
      image: data.image
    }
    AsyncStorage.getItem('cart').then((datacart)=>{
        if (datacart !== null) {
          const cart = JSON.parse(datacart)
          cart.push(itemcart)
          AsyncStorage.setItem('cart',JSON.stringify(cart));
          this.setState(state => ({ visible: !state.visible }))
        }
        else{
          const cart  = []
          cart.push(itemcart)
          AsyncStorage.setItem('cart',JSON.stringify(cart));
        }
      })
      .catch((err)=>{
        alert(err)
      })
  }

  render() {
    return (
        <View style={{ flex: 1,backgroundColor:"#f2f2f2" }}>
          <View style={{width: width, alignItems:'center'}} >
              <Image style={{height:65,marginTop:30 }} resizeMode="contain" source={require("../image/foodapp(1).png")}  />
          </View>
          <Text style={{fontSize:20,marginLeft: 8,fontWeight:"bold",color:"#b51b13", marginBottom:-30}}>Cardápio</Text>
          <Snackbar
          visible={this.state.visible}
          onDismiss={() => this.setState({ visible: false })}
          action={{
            label: 'X',
            onPress: () => {
              // Do something
            },
          }}
          style={{backgroundColor: "white", }}
          >
          <View>
            <Text>Item adicionado ao seu pedido.</Text>
          </View>
          </Snackbar>
             <View style={{height:10}} />
             <SafeAreaView style={{paddingBottom: 40, borderRadius: 10, backgroundColor: 'transparent'}}>
          <View style={{width:width, borderRadius:20, backgroundColor:'transparent'}}>
            <FlatList
              data={this.state.dataFood}
              renderItem={({ item }) => this._renderItemFood(item)}
              keyExtractor = { (item,index) => index.toString() }
            />
          </View>
          </SafeAreaView>
        </View>
    );
  }

}

const styles = StyleSheet.create({
  imageBanner: {
    height:width/2,
    width:width-40,
    borderRadius:10,
    marginHorizontal:20
  },
  imageFood:{
    width:((width/2)-20)-10,
    height:((width/2)-20)-30,
    backgroundColor:'transparent',
    position:'absolute',
    top:-45
  },
  divFood:{
    padding:10,
    borderRadius:10,
    marginTop:55,
    marginLeft:10,
    marginRight:10,
    elevation:8,
    shadowOpacity:0.3,
    shadowRadius:50,
    backgroundColor:'white',
  }
});