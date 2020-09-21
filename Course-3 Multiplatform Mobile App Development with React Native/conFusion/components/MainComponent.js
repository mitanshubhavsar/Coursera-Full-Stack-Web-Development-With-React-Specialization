import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, SafeAreaView, DrawerContentScrollView,
    DrawerItemList } from '@react-navigation/drawer';
import { SafeAreaProvider, SafeAreaInsetsContext } from 'react-native-safe-area-context';   
import Menu from './MenuComponent';
import Dishdetail from './DishdetailComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import { Icon } from 'react-native-elements';
import { View, Text, Image, StyleSheet, ToastAndroid } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import Reservation from './ReservationComponent';
import Favorites from './FavoriteComponent';
import Login from './LoginComponent';
import { connect } from 'react-redux';
import { fetchDishes, fetchComments, fetchPromos, fetchLeaders } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      promotions: state.promotions,
      leaders: state.leaders
    }
  }
  
  const mapDispatchToProps = dispatch => ({
    fetchDishes: () => dispatch(fetchDishes()),
    fetchComments: () => dispatch(fetchComments()),
    fetchPromos: () => dispatch(fetchPromos()),
    fetchLeaders: () => dispatch(fetchLeaders()),
    
  })
  


const MenuNavigator = createStackNavigator();

function MenuNavigatorScreen({navigation}) {
    return(
        <MenuNavigator.Navigator
            initialRouteName='Menu'
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#512DA8"
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    color: "#fff"            
                },  
                               
            }}
            
        >
            <MenuNavigator.Screen
                name="Menu"
                component={Menu}
                options={{
                    headerLeft: (props) => (
                        <Icon name="menu" size={24} 
                        color= 'white'
                        onPress={ () => navigation.toggleDrawer() } /> 
                    ),
                  }}
            />
            <MenuNavigator.Screen
                name="Dishdetail"
                component={Dishdetail}
                options={{ headerTitle: "Dish Detail"}}
            />            
        </MenuNavigator.Navigator>
    );
}

const HomeNavigator = createStackNavigator();

function HomeNavigatorScreen({navigation}) {
    return(
        <HomeNavigator.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#512DA8"
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    color: "#fff"            
                }
                          
            }}
        >
            <HomeNavigator.Screen
                name="Home"
                component={Home}
                options={{
                    headerLeft: (props) => (
                        <Icon name="menu" size={24} 
                        color= 'white'
                        onPress={ () => navigation.toggleDrawer() } /> 
                    ),
                  }}
            />   
        </HomeNavigator.Navigator>
    );
}

const ContactNavigator = createStackNavigator();

function ContactNavigatorScreen({navigation}) {
    return(
        <ContactNavigator.Navigator
            initialRouteName='Contact'
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#512DA8"
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    color: "#fff"            
                }
            }}
        >
            <ContactNavigator.Screen
                name="Contact"
                component={Contact}
                options={{
                    headerLeft: (props) => (
                        <Icon name="menu" size={24} 
                        color= 'white'
                        onPress={ () => navigation.toggleDrawer() } /> 
                    ),
                  }}
            />  
        </ContactNavigator.Navigator>
    );
}

const AboutNavigator = createStackNavigator();

function AboutNavigatorScreen({navigation}) {
    return(
        <AboutNavigator.Navigator
            initialRouteName='About'
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#512DA8"
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    color: "#fff"            
                }
            }}
        >
            <ContactNavigator.Screen
                name="About"
                component={About}
                options={{
                    headerLeft: (props) => (
                        <Icon name="menu" size={24} 
                        color= 'white'
                        onPress={ () => navigation.toggleDrawer() } /> 
                    ),
                  }}
            />  
        </AboutNavigator.Navigator>
    );
}

const ReservationNavigator = createStackNavigator();

function ReservationNavigatorScreen({navigation}) {
    return(
        <ReservationNavigator.Navigator
            initialRouteName='Reserve Table'
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#512DA8"
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    color: "#fff"            
                }
                          
            }}
        >
            <ReservationNavigator.Screen
                name="Reserve Table"
                component={Reservation}
                options={{
                    headerLeft: (props) => (
                        <Icon name="menu" size={24} 
                        color= 'white'
                        onPress={ () => navigation.toggleDrawer() } /> 
                    ),
                  }}
            />  
        </ReservationNavigator.Navigator>
    );
}

const FavouritesNavigator = createStackNavigator();

function FavouritesNavigatorScreen({navigation}) {
    return(
        <FavouritesNavigator.Navigator
            initialRouteName='My Favourites'
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#512DA8"
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    color: "#fff"            
                }
            }}
        >
            <FavouritesNavigator.Screen
                name="My Favourites"
                component={Favorites}
                options={{
                    headerLeft: (props) => (
                        <Icon name="menu" size={24} 
                        color= 'white'
                        onPress={ () => navigation.toggleDrawer() } /> 
                    ),
                  }}
            />  
        </FavouritesNavigator.Navigator>
    );
}

const LoginNavigator = createStackNavigator();

function LoginNavigatorScreen({navigation}) {
    return(
        <LoginNavigator.Navigator
            initialRouteName='Login'
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#512DA8"
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    color: "#fff"            
                }
            }}
        >
            <LoginNavigator.Screen
                name="Login"
                component={Login}
                options={{
                    headerLeft: (props) => (
                        <Icon name="menu" size={24} 
                        color= 'white'
                        onPress={ () => navigation.toggleDrawer() } /> 
                    ),
                  }}
            />  
        </LoginNavigator.Navigator>
    );
}




function CustomDrawerContentComponent(props) {
    return(
        <DrawerContentScrollView {...props}>
    <DrawerItemList {...props} />
    <SafeAreaProvider style={styles.container} >
        <View style={styles.drawerHeader}>
            <View style={{flex:1}}>
                <Image source={require('./images/logo.png')} style={styles.drawerImage} />
            </View>
            <View style={{flex: 2}}>
                <Text style={styles.drawerHeaderText}>Ristorante Con Fusion</Text>
            </View>
        </View> 
    </SafeAreaProvider>
    </DrawerContentScrollView>
    );
    
}

const Drawer = createDrawerNavigator();

function MainNavigator() {
  return (
      
    <NavigationContainer> 
      <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <CustomDrawerContentComponent {...props} />}  drawerStyle={{
        backgroundColor: '#D1C4E9' }}  >
        <Drawer.Screen name="Login" component={LoginNavigatorScreen}
        options={{
            drawerIcon: ({ color, focused }) => (
            <Icon name="sign-in" type='font-awesome' size={24} 
            color='#0f1010'
                /> 
                ),
        }} 
        />
        <Drawer.Screen name="Home" component={HomeNavigatorScreen}
            
            options={{
                drawerIcon: ({ color, focused }) => (
                <Icon name="home" type='font-awesome' size={24} 
                color='#0f1010'
                 /> 
                 ),
          }} 
        />
        <Drawer.Screen name="About Us" component={AboutNavigatorScreen}
            options={{
                drawerIcon: ({ color, focused }) => (
                <Icon name="info-circle" type='font-awesome' size={24} 
                color='#0f1010'
                 /> 
                 ),
          }} 
        />
        <Drawer.Screen name="Menu" component={MenuNavigatorScreen}
            options={{
                drawerIcon: ({ color, focused }) => (
                <Icon name="list" type='font-awesome' size={24} 
                color='#0f1010'
                 /> 
                 ),
          }} 
        />
        <Drawer.Screen name="Contact Us" component={ContactNavigatorScreen}
            options={{
                drawerIcon: ({ color, focused }) => (
                <Icon name="address-card" type='font-awesome' size={22} 
                color='#0f1010'
                 /> 
                 ),
          }} 
        />
        <Drawer.Screen name="My Favourites" component={FavouritesNavigatorScreen}
            options={{
                drawerIcon: ({ color, focused }) => (
                <Icon name="heart" type='font-awesome' size={24} 
                color='#0f1010'
                 /> 
                 ),
          }} 

        />
        <Drawer.Screen name="Reserve Table" component={ReservationNavigatorScreen}
            options={{
                drawerIcon: ({ color, focused }) => (
                <Icon name="cutlery" type='font-awesome' size={24} 
                color='#0f1010'
                 /> 
                 ),
          }} 

        />
         
      </Drawer.Navigator>
      
    </NavigationContainer>
   
   
  );
}

class Main extends Component {

    componentDidMount() {
        this.props.fetchDishes();
        this.props.fetchComments();
        this.props.fetchPromos();
        this.props.fetchLeaders();

        NetInfo.fetch()
        .then((connectionInfo) => {
            ToastAndroid.show('Initial Network Connectivity Type: '
                + connectionInfo.type, ToastAndroid.LONG)
        });

        NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);
    }
      
    componentWillUnmount() {
    NetInfo.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    handleConnectivityChange = (connectionInfo) => {
        switch (connectionInfo.type) {
          case 'none':
            ToastAndroid.show('You are now offline!', ToastAndroid.LONG);
            break;
          case 'wifi':
            ToastAndroid.show('You are now connected to WiFi!', ToastAndroid.LONG);
            break;
          case 'cellular':
            ToastAndroid.show('You are now connected to Cellular!', ToastAndroid.LONG);
            break;
          case 'unknown':
            ToastAndroid.show('You now have unknown connection!', ToastAndroid.LONG);
            break;
          default:
            break;
        }
      }
    
  render() {

    return (
        <MainNavigator/>
                  
    );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    drawerHeader: {
      backgroundColor: '#512DA8',
      height: 140,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row'
    },
    drawerHeaderText: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold'
    },
    drawerImage: {
      margin: 10,
      width: 80,
      height: 60
    },
  });


  export default connect(mapStateToProps, mapDispatchToProps)(Main);