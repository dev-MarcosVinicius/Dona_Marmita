import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView , Linking, Alert ,KeyboardAvoidingView} from 'react-native';
import {Snackbar, TextInput} from 'react-native-paper'
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
var { width } = Dimensions.get("window")
var {height} = Dimensions.get("window")


export default class Cart extends Component {
  _isMounted = false;

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
          dataCart:[],
          visible: false,
          pedido: [],
          isLoading: true,
          whatsapp: String,
          text: ''
        };
     }

     getDataCart () {
      this._isMounted = true;
       try {
      AsyncStorage.getItem('cart').then((cart)=>{
        if (this._isMounted) {
          const cartfood = JSON.parse(cart || '{}')
          this.setState({dataCart:cartfood})
          this.setState({isLoading:false})
        }
      })}
      catch(err){
        console.error(err);
      }
     }

     componentDidMount()
     {
       this.getDataCart();
     }

     componentWillUnmount() {
      this._isMounted = false;
    }

     removeCart = async (index: any) => {
      this.setState((state: { visible: any; }) => ({ visible: !state.visible }))
      try {
          const cart = await AsyncStorage.getItem('cart');
          let cartItems = JSON.parse(cart || '{}');
          cartItems = cartItems.filter(function (_e: any, itemIndex: any) { return itemIndex !== index });
  
          await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
          this.setState({dataCart:cartItems})
          
      } catch (error) {
          console.log('error: ', error);
      }
  };

     onChangeQual({ i, type }: { i: React.ReactText; type: boolean; })
     {
       const dataCar = this.state.dataCart
       let cantd = dataCar[i].quantity

       if (type) {
        cantd = cantd + 1
        dataCar[i].quantity = cantd
        this.setState({dataCart:dataCar})
       }
       else if (type==false&&cantd>=2){
        cantd = cantd - 1
        dataCar[i].quantity = cantd
        this.setState({dataCart:dataCar})
       }
     }
     
     fazerPedido () {
       const espaço = '\n';
       const assDonaMarmita = '\n'+'\n'+'~Pedido feito pelo aplicativo Dona Marmita';
       const endereço = this.state.text;
       const todosItems = this.state.dataCart.map((item: number,i: string | number) => {
        const itemsQuant = [item.quantity];
        const itemsName = [item.name];
        const itemsPrice = [item.price*item.quantity];
        const items = itemsQuant+'x'+itemsName+' R$'+itemsPrice+'\n';
        return (
          items
        )
       })
       if (endereço == '') {
         Alert.alert('O Endereço é obrigatorio!')
       }
       else {
       return (
        Linking.openURL(`whatsapp://send?text=Olá ,Dona marmita \n ${espaço}Meu pedido é ${todosItems} Endereço: ${endereço}${assDonaMarmita}&phone=5585994092188`)
       )
       }
      }

     renderItems () {
       return (
        <ScrollView contentContainerStyle={{flex:1,alignItems: 'center', justifyContent: 'center',backgroundColor:'#f2f2f2'}}
        scrollEnabled={false}
        keyboardShouldPersistTaps='handled'>
        <View style={{backgroundColor:'transparent',marginTop:20}}>
            <Image style={{height:65 }} resizeMode="contain" source={require("../image/foodapp(1).png")}  />
           </View>
           <View style={{backgroundColor:'transparent', width:width-30, marginBottom:5}}>
           <TextInput
             label="Endereço Completo"
             mode='outlined'
             placeholder='Rua J, Numero 20, Parque Santa Rosa'
             value={this.state.text}
             onChangeText={(text: any) => this.setState({text:text})}
             />
             </View>
           <View style={styles.divFood}>
          <ScrollView>
          {this.state.dataCart.map((item: number,i: string | number)=>{
          if (item !== 0) {
          return(
              <View key={i} style={{ width: width - 50, height: 90, margin: 10, backgroundColor: 'transparent', flexDirection: 'row', borderBottomWidth: 2, borderColor: "#cccccc", paddingBottom: 10 }}>
                <Image resizeMode={"contain"} style={{ width: width / 5, height: width / 5, marginTop: 15}} source={{ uri: item.image }} />
                <View style={{ flex: 1, backgroundColor: 'trangraysparent', padding: 10 }}>
                  <View style={styles.nametotrash}>
                    <Text style={{ fontWeight: "bold", fontSize: 18 }}>{item.name}</Text>
                    <TouchableOpacity onPress={() => this.removeCart(i)}>
                      <Icon name="ios-close-circle" size={26} color={"#b51b13"} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop:20 }}>
                    <Text style={{ fontWeight: 'bold', color: "#b51b13", fontSize: 18 }}>R${item.price * item.quantity}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableOpacity onPress={() => this.onChangeQual({ i, type: false })}>
                        <Icon name="ios-remove-circle" size={25} color={"#b51b13"} />
                      </TouchableOpacity>
                      <Text style={{ paddingHorizontal: 8, fontWeight: 'bold', fontSize: 18 }}>{item.quantity}</Text>
                      <TouchableOpacity onPress={() => this.onChangeQual({ i, type: true })}>
                        <Icon name="ios-add-circle" size={25} color={"#b51b13"} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}})}
            </ScrollView>
                <View style={{alignContent:'center', flexDirection:'column',backgroundColor:'transparent'}}>
                <Snackbar
                  visible={this.state.visible}
                  onDismiss={() => this.setState({ visible: false })}
                  action={{
                  label: 'X',
                  onPress: () => {
                    this.setState({ visible: false })
                  },
                     }}
                  style={{backgroundColor: "white", }}
                   >
                    <View>
                     <Text>Item excluido do seu pedido.</Text>
                   </View>
                 </Snackbar>
                 </View>
           </View>
           <View style={{backgroundColor:'transparent', width:width-30}}>
               <TouchableOpacity style={{
                   backgroundColor:"#b51b13",
                   alignItems:'center',
                   marginTop: 5,
                   padding:5,
                   borderRadius:5,
                 }} 
                 onPress={() => this.fazerPedido()}
                 >
                 <Text style={{
                     fontSize:24,
                     fontWeight:"bold",
                     color:'white'
                   }}>
                   Fazer Pedido
                 </Text>
               </TouchableOpacity>
               </View>
               </ScrollView>
       )
     }

     render() {
        return (
          this.renderItems()
        )
      }
    }

    const styles = StyleSheet.create({

      nametotrash: {
        flexDirection:'row',
        justifyContent:'space-between'
      },
      divFood: {
        height: height-260,
        borderRadius:10,
        elevation:8,
        shadowOpacity:0.3,
        shadowRadius:50,
        backgroundColor:'white',
      }
    })