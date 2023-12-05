import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import mime from 'mime';

import { TitleImage, IconButton, PrimaryButton } from '../components/tissues';
import { UrlContext, AuthContext } from '../contexts';
import { UseHttpRequest, UseAsyncStorage } from '../hooks';

import GlobalStyles from './styles/Global';
import { Colors, Routes } from '../constants/';

const FishIdentification = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [HttpSuccessAction, setHttpSuccessAction] = useState(0);
  const { Urls } = useContext(UrlContext);
  const { AuthData, ClearAuthData } = useContext(AuthContext);
  const [ImageFile, setImageFile] = useState('');
  const [ImageSource, setImageSource] = useState('');
  const [Result, setResult] = useState('');
  const { IsLoading, ResponseData, RequestError, SendRequest } = UseHttpRequest();
  const { Values, SaveValues, ClearValues } = UseAsyncStorage('auth');

  useEffect(() => {
    if (RequestError) {
      console.log(RequestError);
    }

    if (ResponseData) {
      if (HttpSuccessAction === 1) {
        console.log(ResponseData);
        setResult(ResponseData);
        setImageFile('');
        setImageSource('');
      }
    }
  }, [ResponseData, RequestError]);

  useEffect(() => {
    if (isFocused) {
      setResult('');
      setImageFile('');
      setImageSource('');
    }
  }, [isFocused]);

  const handleCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 250,
      cropping: true,
    })
      .then((image) => {
        console.log(image);
        setImageFile(image.path);
        setImageSource('camera');
      })
      .catch((err) => {
        if (err.code === 'E_PICKER_CANCELLED') {
          return false;
        }
      });
  };

  const handleGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 250,
      cropping: true,
    })
      .then((image) => {
        console.log(image);
        setImageFile(image.path);
        setImageSource('gallery');
      })
      .catch((err) => {
        if (err.code === 'E_PICKER_CANCELLED') {
          return false;
        }
      });
  };

  const SubmitImage = () => {
    if (!ImageFile) {
      Alert.alert('Error', 'Please capture or select an image!');
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: ImageFile,
      type: mime.getType(ImageFile),
      name: ImageFile.split('/').pop(),
    });

    SendRequest({
      method: 'POST',
      url: `${Urls.fishIdUrl}predict`,
      headers: {
        'content-type': 'multipart/form-data',
      },
      data: formData,
    });

    setHttpSuccessAction(1);
  };

  return (
    <SafeAreaView style={GlobalStyles.mainContainer}>
      <ScrollView
        style={GlobalStyles.scrollContainer}
        contentContainerStyle={[
          GlobalStyles.scrollContentContainer,
          { justifyContent: 'flex-start' },
        ]}>
        <View
          style={[GlobalStyles.titleContainer, { justifyContent: 'flex-start' }]}>
          <Text style={[GlobalStyles.titleTxt, { fontSize: 20 }]}>
            Fish Identification
          </Text>
          <TitleImage />
          <View style={Styles.iconBtnContainer}>
            <IconButton
              iconName="power"
              bgColor={Colors.primary}
              iconColor={Colors.dark}
              iconSize={20}
              btnFunc={() =>
                Alert.alert('Logout!', 'You want to logout!', [
                  {
                    text: 'OK',
                    onPress: () => {
                      ClearValues().then(() => {
                        ClearAuthData();
                        navigation.navigate(Routes.LOGIN);
                      });
                    },
                  },
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                  },
                ])
              }
            />
          </View>
        </View>
        <View style={Styles.productContainer}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <IconButton
              iconName="camera-outline"
              bgColor={ImageSource === 'camera' ? Colors.primary : Colors.dark}
              iconColor={ImageSource === 'camera' ? Colors.dark : Colors.light}
              iconSize={40}
              btnFunc={() => handleCamera()}
            />
            <View style={{ marginLeft: 20 }}>
              <IconButton
                iconName="file-tray-outline"
                bgColor={
                  ImageSource === 'gallery' ? Colors.primary : Colors.gray
                }
                iconColor={
                  ImageSource === 'gallery' ? Colors.dark : Colors.light
                }
                iconSize={40}
                btnFunc={() => handleGallery()}
              />
            </View>
          </View>
          <PrimaryButton
            bgColor={Colors.primary}
            txtColor={Colors.light}
            fullWidth={false}
            btnTxt="Identify"
            btnFunc={() => SubmitImage()}
          />
          {Result ? (
            <Text style={{ marginTop: 20, fontSize: 20, fontWeight: 'bold' }}>
               This is {Result}
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
});

export default FishIdentification;
