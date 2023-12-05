// ----------Inbuilt components and modules----------
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import {useContext, useState, useEffect} from 'react';

// ----------Custom components and modules----------
import {PrimaryButton, IconButton, Tag} from '../components/tissues';
import {UrlContext, AuthContext} from '../contexts';
import {UseHttpRequest, UseAsyncStorage} from '../hooks';

// ----------Custom styles----------
import GlobalStyles from './styles/Global';

// ----------Constants----------
import {Colors, Routes, Images} from '../constants/';

const Reward = ({navigation, route}) => {
  // Http success actionstate
  const [HttpSuccessAction, SetHttpSuccessAction] = useState(0);
  console.log(route.params);

  // Login credentials state
  const [LoginData, SetLoginData] = useState({
    emailAddress: '',
    password: '',
  });

  // Urls context
  const {Urls} = useContext(UrlContext);

  // Auth context
  const {AuthData, SaveAuthData} = useContext(AuthContext);

  // Http request custom hook
  const {IsLoading, ResponseData, RequestError, SendRequest} = UseHttpRequest();

  // Async storage custom hook for auth info
  const {Values, SaveValues, ClearValues} = UseAsyncStorage('auth');

  // Handle http responses and errors
  useEffect(() => {
    // When fail
    if (RequestError) {
      Alert.alert('Error', RequestError.error.message);
    }

    // When success
    if (ResponseData) {
      if (HttpSuccessAction == 1) {
        Alert.alert('Thanks for Rating Us!', ResponseData.result);
        setTimeout(() => {
          navigation.navigate(Routes.HOME);
        }, 1000);
      }
    }
  }, [ResponseData, RequestError]);

  // Function to submit reward
  const SubmitReward = r => {
    // Send request
    SendRequest({
      method: 'GET',
      url: `${Urls.reenUrl}update?productid=${parseInt(route.params.fishId)}&productcount=6&sellercount=25&recommendedseller=${parseInt(route.params.sellerId)}&reward=${r}`,
      headers: {
        'content-type': 'application/json',
      },
      data: {},
    });

    SetHttpSuccessAction(1);
  };

  return (
    
    <SafeAreaView style={GlobalStyles.mainContainer}>
          

      <ScrollView
        style={GlobalStyles.scrollContainer}
        contentContainerStyle={[
          GlobalStyles.scrollContentContainer,
          {justifyContent: 'flex-start'},
        ]}>
        <View
          style={[GlobalStyles.titleContainer, {justifyContent: 'flex-start'}]}>
          <IconButton
            iconName="arrow-back-outline"
            bgColor={Colors.primary}
            iconColor={Colors.dark}
            iconSize={20}
            btnFunc={() => navigation.goBack()}
          />
         
        </View>
        <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>
              Rating
            </Text>
        <View style={Styles.productContainer}>
          <IconButton  style={Styles.iconBtnContainer}
            iconName="ios-happy"
            bgColor={Colors.primary}
            iconColor={Colors.dark}
            iconSize={50}
            btnTxt="good"
            btnFunc={() => SubmitReward(1)}
          />
          <IconButton style={Styles.iconBtnContainer}
            iconName="ios-sad"
            bgColor={Colors.primary}
            iconColor={Colors.dark}
            iconSize={50}
            btnTxt="neutral"
            btnFunc={() => SubmitReward(0)}
          />
          <IconButton style={Styles.iconBtnContainer}
          
          iconName="heart-dislike"
          bgColor={Colors.primary}
          iconColor={Colors.dark}
          iconSize={50}
          btnTxt="Bad"
            btnFunc={() => SubmitReward(-1)}
          />
           
          {IsLoading ? (
            <Text style={{marginTop: 10}}>
              Wait to finish the reward submission...
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Styles = StyleSheet.create({
  iconBtnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50, // Adjust spacing between IconButtons
    paddingTop:50
  },
  productContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    backgroundColor: Colors.light,
    marginTop: 50,
    borderRadius: 15,
    padding: 10,
  },
});

// Internal styles
// const Styles = StyleSheet.create({
//   iconBtnContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     marginLeft: 'auto',
//     paddingBottom:10
//   },
//   categoryContainer: {
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     flexDirection: 'row',
//     marginTop: 50,
//   },
//   productContainer: {
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     width: '100%',
//     backgroundColor: Colors.light,
//     marginTop: 50,
//     borderRadius: 15,
//     paddingBottom:10
//   },
//   // productContainer: {
//   //   flexDirection: 'row', // Setting row direction
//   //   alignItems: 'space-between',
//   //   justifyContent: 'center',
//   //   width: '25%',
//   //   backgroundColor: Colors.light,
//   //   marginTop: 20,
//   //   borderRadius: 15,
//   //   paddingHorizontal: 2,
//   // },
  
// });
export default Reward;
