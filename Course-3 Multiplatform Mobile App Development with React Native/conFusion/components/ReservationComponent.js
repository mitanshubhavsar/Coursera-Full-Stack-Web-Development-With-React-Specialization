import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Modal, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Animatable from 'react-native-animatable';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import * as Calendar from 'expo-calendar';

class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            guests: 1,
            smoking: false,
            showModal: false,
            date: new Date(),
            show: false,
            mode: 'date'

              
        }
    }

    static navigationOptions = {
        title: 'Reserve Table',
    };

    handleReservation() {
        console.log(JSON.stringify(this.state));
        Alert.alert(
            'Your Reservation OK?',
            'No. of Guests: ' + this.state.guests + '\nSmoking? ' + 
                this.state.smoking + '\nDate and Time: '+ this.state.date ,
            [
            {text: 'Cancel', onPress: () =>  this.resetForm(), style: 'cancel'},
            {text: 'OK', onPress: () => {
                this.presentNotification(this.state.date)
                this.addReservationToCalendar(this.state.date);
                this.resetForm()
                }
            },
            ],
            { cancelable: false }
        );
        
    }
    
    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            showModal: false,
            date: new Date(),
            mode: "date",
            show: false,

        });
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    async obtainCalendarPermission() {
        let permission = await Permissions.getAsync(Permissions.CALENDAR);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.CALENDAR);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    

    async presentNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for '+ date + ' requested',
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        });
    }

    async getDefaultCalendarSource() {
        const calendars = await Calendar.getCalendarsAsync();
        const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
        return defaultCalendars[0].source;
      }  

    async addReservationToCalendar(date) {
        await this.obtainCalendarPermission();
        const defaultCalendarSource = Platform.OS === 'ios' ? await getDefaultCalendarSource() : { isLocalAccount: true, name: 'Expo Calendar' };
        const newCalendarID = await Calendar.createCalendarAsync({
            title: 'Expo Calendar',
            color: 'blue',
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: defaultCalendarSource.id,
            source: defaultCalendarSource,
            name: 'internalCalendarName',
            ownerAccount: 'personal',
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
          });

        let dateMs = Date.parse(date);
        let startDate = new Date(dateMs);
        let endDate = new Date(dateMs + 2 * 60 * 60 * 1000);

        let details = {
            title: 'Con Fusion Table Reservation',
            startDate: startDate ,
            endDate: endDate,
            timeZone :'Asia/Hong_Kong' ,
            location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'

        }
        Calendar.createEventAsync(newCalendarID, details);
            
    }

    
    render() {
        return(
            <Animatable.View animation="zoomIn" duration={2000} delay={1000} >
            <ScrollView>
                <View style={styles.formRow}>
                <Text style={styles.formLabel}>Number of Guests</Text>
                <Picker
                    style={styles.formItem}
                    selectedValue={this.state.guests}
                    onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}>
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="5" value="5" />
                    <Picker.Item label="6" value="6" />
                </Picker>
                </View>
                <View style={styles.formRow}>
                <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                <Switch
                    style={styles.formItem}
                    value={this.state.smoking}
                    trackColor='#512DA8'
                    onValueChange={(value) => this.setState({smoking: value})}>
                </Switch>
                </View>
                <View style={styles.formRow}>
                <Text style={styles.formLabel}>Date and Time</Text>
                <View>
                    <Button onPress={() => this.setState({show: true})} title="Select Date and Time" />
                </View>
                {this.state.show && (
                        <DateTimePicker
                        value={this.state.date}
                        mode={this.state.mode}
                        display="default"
                        minimumDate={new Date()}
                        onChange={(selected, value) => {
                            if (value !== undefined) {
                            this.setState({
                                show: this.state.mode === "time" ? false : true,
                                mode: "time",
                                date: new Date(selected.nativeEvent.timestamp),
                            });
                            } else {
                            this.setState({ show: false, mode: "date" });
                            }
                        }}
                        />
                        )}  
                              
                </View>
            
                <View >
                <Button
                    onPress={() => this.handleReservation()}
                    title="Reserve"
                    color="#512DA8"
                    accessibilityLabel="Learn more about this purple button"
                    />
                </View>
            </ScrollView>
            </Animatable.View>
              );
            }
        
        };

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    
});
        

export default Reservation;
