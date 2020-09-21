import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, Button, FlatList, Modal, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Input, Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, comment, author) => dispatch(postComment(dishId, rating, comment, author))
})


function RenderDish(props) {

    const dish = props.dish;

    handleViewRef = ref => this.view = ref;

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if ( dx < -200 )
            return true;
        else
            return false;
    }
    
    const recognizeComment = ({ moveX ,moveY, dx, dy }) => {
        if( dx > 200 )
            return true;
        else
            return false;    
    }


    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => 
            {this.view.rubberBand(1000)
                .then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));},
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                    ],
                    { cancelable: false }
                );
            if (recognizeComment(gestureState))
                { props.onSelect()}  
            return true;
        }
    })

    const shareDish = (title, message, url) => {
        Share.share({
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        },{
            dialogTitle: 'Share ' + title
        })
    }

    
        if (dish != null) {
            return(
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000} 
                    ref={this.handleViewRef} {...panResponder.panHandlers}>
                    <Card style={styles.card}
                    featuredTitle={dish.name}
                    image={{uri: baseUrl + dish.image}}>
                        <Text style={{margin: 10}}>
                            {dish.description}
                        </Text>
                        <View style={styles.icons}>
                        <Icon
                        raised
                        reverse
                        name={ props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                        />
                        <Icon
                        reverse
                        name='pencil'
                        type='font-awesome'
                        color='#694aec'
                        onPress={() => props.onSelect()}
                        />
                        <Icon
                            raised
                            reverse
                            name='share'
                            type='font-awesome'
                            color='#51D2A8'
                            style={styles.cardItem}
                            onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} />
                        </View>
                    </Card>
                </Animatable.View>
            );
        }
        else {
            return(<View></View>);
        }
}

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
               <Rating style={styles.ratingbar} ratingCount={5} imageSize={10} readonly startingValue={item.rating}           
            
            />
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>   
            <Card title='Comments' >
            <FlatList 
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id}
                />
            </Card>
        </Animatable.View>
    );
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleComment.bind(this);

        this.state = {
            rating: 0,
            author: '',
            comment: '',
            showModal: false
              
        }
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    handleComment(dishId) {
        console.log(JSON.stringify(this.state));
        this.props.postComment(dishId,this.state.rating,this.state.author,this.state.comment);
        this.toggleModal();
    }
    
    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {
        const dishId = this.props.route.params.dishId;

        return(
            <ScrollView>
            <RenderDish dish={this.props.dishes.dishes[+dishId]}
            favorite={this.props.favorites.some(el => el === dishId)}
            onPress={() => this.markFavorite(dishId)} onSelect={() => this.toggleModal()} />
            <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} postComment={postComment}/>
            <Modal animation={"slide"} transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.toggleModal()}
                    onRequestClose={() => this.toggleModal}>
                    <View style={styles.modal}>
                        <View>
                            <Rating showRating
                                type="star"
                                startingValue={5}
                                imageSize={40}
                                onFinishRating={(rating) => this.setState({ rating: rating })}
                            />
                        </View>
                        <View  >
                            <Input 
                                placeholder='   Author'
                                leftIcon={
                                    <Icon
                                        name='user-o'
                                        type='font-awesome'
                                        size={24}
                                    />
                                }
                                onChangeText={(value) => this.setState({ author: value })}
                            />
                        </View>
                        <View>
                            <Input
                                placeholder="   Comment"
                                leftIcon={
                                    <Icon
                                        name='comment-o'
                                        type='font-awesome'
                                        size={24}
                                    />
                                }
                                onChangeText={(value) => this.setState({ comment: value })}
                            />
                        </View>
                        <View style={styles.modalbutton}>
                            <Button color="#6931ef" onPress={() => this.handleComment(dishId)}
                                title="SUBMIT"
                                
                            />
                        </View>
                        <View style={styles.modalbutton}>
                            <Button  onPress={() => this.toggleModal()}
                                color="#9ca6b1"
                                title="CANCEL"
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }

    
}

const styles = StyleSheet.create({
    modalbutton: {
        margin: 15
    },
    ratingbar: {
        alignItems: "flex-start"
    },
    icons: {
        justifyContent: 'center',
        flexDirection: 'row'
    },
    modal: {
        justifyContent: 'center',
        margin: 20
     },

});



export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);