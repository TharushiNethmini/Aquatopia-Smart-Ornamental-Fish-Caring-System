// ----------Inbuilt components and modules----------
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  Alert,
  Button,
  Modal
} from 'react-native';
import {useContext, useState, useEffect} from 'react';

// ---------Third-party components & modules---------
import {useIsFocused} from '@react-navigation/native';

// ----------Custom components and modules----------
import {TextBox} from '../components/cells';
import {TitleImage, IconButton, Tag} from '../components/tissues';
import {SellerCard} from '../components/organs';
import {UrlContext, AuthContext} from '../contexts';
import {UseHttpRequest, UseAsyncStorage} from '../hooks';

// ----------Custom styles----------
import GlobalStyles from './styles/Global';

// ----------Constants----------
import {Colors, Routes} from '../constants/';

const Ornaments = ({navigation,route}) => {

  console.log(route.params.sellerCode);
  
  // Focus
  const isFocused = useIsFocused();

  // Tag status
  const [tag, setTag] = useState(0);

  // Sellers state
  const [Sellers, SetSellers] = useState([]);

  // Seller id state
  const [SellerId, SetSellerId] = useState(0);

  // Search query state
  const [SearchQuery, SetSearchQuery] = useState('');

  // Http success actionstate
  const [HttpSuccessAction, SetHttpSuccessAction] = useState(0);

  // Urls context
  const {Urls} = useContext(UrlContext);

  // Auth context
  const {AuthData, ClearAuthData} = useContext(AuthContext);

  
  // Http request custom hook
  const {IsLoading, ResponseData, RequestError, SendRequest} = UseHttpRequest();

  // Async storage custom hook for auth info
  const {Values, SaveValues, ClearValues} = UseAsyncStorage('auth');

  const [isModalVisible, setIsModalVisible] = useState(false); // State for managing modal visibility

  const [selectedFishCode, setSelectedFishCode] = useState(null);


  // Filter sellers
  useEffect(() => {
    if (SearchQuery === '') {
      LoadFishes();
    } else {
      LoadFishes();
    }
  }, [SearchQuery]);

  // Handle http responses and errors
  useEffect(() => {
    // When fail
    if (RequestError) {
      console.log(RequestError);
      // Alert.alert('Error', RequestError.error.message);
    }

    // When success
    if (ResponseData) {
      if (HttpSuccessAction == 1) {
        console.log(ResponseData.success.message);
        SetSellers(ResponseData.products);
      }

      if (HttpSuccessAction == 2) {
        if (ResponseData.result > 0) {
          BestSellerInfo(ResponseData.products);
        }
      }

      if (HttpSuccessAction == 3) {
        console.log(ResponseData.seller.fullName);
      }
    }
  }, [ResponseData, RequestError]);

  // All sellers and bes seller
  useEffect(() => {
    if (tag == 0) {
      LoadFishes();
    } else {
      LoadFishes();
    }
  }, [tag]);

  // Handle navigation based on auth data
  useEffect(() => {
    if (isFocused) {
      if (tag == 0) {
        LoadFishes();
      } else {
        LoadFishes();
      }
    }
  }, [isFocused]);

  // Function to load sellers
  const LoadFishes = () => {
    // Send request
    SendRequest({
      method: 'GET',
      url: `${Urls.baseUrl}products/all/${route.params.sellerCode}`,
      headers: {
        'content-type': 'application/json',
      },
      data: {},
    });

    SetHttpSuccessAction(1);
  };

  const openPopup = (fishCode) => {
    setSelectedFishCode(fishCode);
    setIsModalVisible(true);
  };
  

  // Function to close the modal
  const closePopup = (fishId) => {
    setIsModalVisible(false);
    if (fishId) {
      navigation.navigate(Routes.REWARD, {
        fishId,
        sellerId: route.params.sellerCode,
      });
    }
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
          {/* <View style={Styles.iconBtnContainer}>
            { <IconButton
              iconName="cart"
              bgColor={Colors.primary}
              iconColor={Colors.dark}
              iconSize={20}
            /> }
            <IconButton
              iconName="shopping-cart"
              bgColor={Colors.primary}
              iconColor={Colors.dark}
              iconSize={20}
              btnFunc={() => navigation.navigate(Routes.REWARD, route.params)}
            />
          </View> */}
        </View>
        
        {tag == 0 ? (
          <View style={Styles.productContainer}>
            {IsLoading ? (
              <Text className="text-center">Retrieving...</Text>
            ) : Sellers?.length > 0 ? (
              Sellers.map((item, index) => (
                <SellerCard
                  key={index}
                  // seller={item.fullName}
                  fish={item.fishName}
                  code={item.fishCode}
                  btnFunc={() => openPopup(item.fishCode)}
                  
                  
                  // btnFunc={() =>
                  
                  //   navigation.navigate(Routes.REWARD, {
                  //     // sellerCount: Sellers.length,
                  //      fishId: item.fishCode,
                  //      sellerId: route.params.sellerCode
                  //     // userCount: 150,
                  //     // recommendedSeller: item.sellerCode,
                  //   })
                  // }
                  
                />
              ))
            ) : (
              <Text className="text-center">
                No sellers available right now!
              </Text>
            )}
          </View>
        ) : (
          <View style={Styles.productContainer}>
            {IsLoading ? (
              <Text className="text-center">Retrieving...</Text>
            ) : HttpSuccessAction == 3 ? (
              <SellerCard
                seller={ResponseData.seller.fullName}
                btnFunc={() =>
                  MyPopup()
                  // navigation.navigate(Routes.SELLER, {
                  //   // sellerCount: Sellers.length,
                  //   // userId: AuthData.user.userCode,
                  //   // userCount: 150,
                  //   // recommendedSeller: ResponseData.seller.sellerCode,
                  // })
                }
              />
            ) : (
              <Text className="text-center">
                No best seller available right now!
              </Text>
            )}
          </View>
        )}
            
        </ScrollView>
        <MyPopup
            isModalVisible={isModalVisible}
            setModalVisible={setIsModalVisible}
            closePopup={closePopup}
            selectedFishCode={selectedFishCode}
          />
    </SafeAreaView>
    
  );
};


const MyPopup = ({ isModalVisible, setModalVisible, closePopup,selectedFishCode }) => {
  const close = () => {
    closePopup(selectedFishCode); // Pass selectedFishCode to closePopup function
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isModalVisible}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
         <View style={Styles.modalContent}>

         <Text style={Styles.modalText}>Order is Received</Text>
          {/* Pass fishId to close function */}
          <Button title="Rate Us" onPress={() => close('someFishId')} color="#e67e22"/>
        </View>
      </View>
    </Modal>
  );
};


// Internal styles
const Styles = StyleSheet.create({
  iconBtnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  categoryContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: 20,
  },
  productContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    backgroundColor: Colors.light,
    marginTop: 20,
    borderRadius: 15,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 20, // Adding space between the text and the button
    fontWeight: 'bold', // Making the text bold
  },
});
export default Ornaments;
