import BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useTheme } from '@rneui/themed';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { deployRoomRedesign } from '../api/api.tsx';
import CommonBottomSheet from '../component/ui/CommonBottomSheet.tsx';
import FirstCarousel from '../component/ui/FirstCarousel.tsx';
import Header from '../component/ui/Header.tsx';
import MenuOptionsList from '../component/ui/MenuOptionList.tsx';
import OptionList from '../component/ui/OptionList.tsx';
import QualityBottomSheet from '../component/ui/QualityBottomSheet.tsx';
import ResizeBottomSheet from '../component/ui/ResizeBottomSheet.tsx';
import { menuOptions, optionImages } from '../constant/data.tsx';
import { MainStackScreenProps } from '../types/navigation.types.ts';
import {
  ColorData,
  colorHeaderOption,
  FaceArray,
  faceHeaderOption,
  resizeData,
  ReStyleOption,
} from './utils.ts';
// import { Styley } from '@styley/typescript-sdk';

// Constants extraction
const SCREEN_WIDTH = Dimensions.get('window').width;
const NUM_COLUMNS = 4;
const ITEM_SPACING = 8;
const ITEM_SIZE =
  (SCREEN_WIDTH - ITEM_SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

interface HomeScreenProps extends MainStackScreenProps<'Home'> {}

const HomeScreen: React.FC<HomeScreenProps> = () => {
  // State management
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [result, setResult] = useState<string[] | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  // const styley = new Styley();
  // Refs
  const flatListRef = useRef<FlatList<string> | null>(null);
  const bottomSheetRefs: {
    reStyle: React.RefObject<BottomSheetMethods>;
    color: React.RefObject<BottomSheetMethods>;
    face: React.RefObject<BottomSheetMethods>;
    quality: React.RefObject<BottomSheetMethods>;
    resize: React.RefObject<BottomSheetMethods>;
  } = {
    reStyle: useRef<BottomSheetMethods>(null!),
    color: useRef<BottomSheetMethods>(null!),
    face: useRef<BottomSheetMethods>(null!),
    quality: useRef<BottomSheetMethods>(null!),
    resize: useRef<BottomSheetMethods>(null!),
  };

  const {theme} = useTheme();
  const themedStyles = styles(theme);

  // API Call
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const response = await deployRoomRedesign(prompt);
      if (response.status === 'pending') {
        fetchInitialData();
        setLoading(true);
      } else if (response.status === 'complete') {
        setLoading(false);
        if (response.job.files) {
          setResult(response.job.files);
          setSelectedImage(response.job.files[0]);
          setPrompt('');
        }
      }
      console.log('response************', response);
    } catch (error) {
      setLoading(false);
      console.error('Failed to fetch initial data:', error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleResizeSelect = (item: any) => {
    // Handle resize selection logic
    console.log('Selected Resize:', item);
  };

  const handleQualitySelect = (quality: any) => {
    // Handle quality selection logic
    console.log('Selected Quality:', quality);
  };

  const closeBottomSheet = (ref: React.RefObject<BottomSheet>) => {
    if (ref.current) {
      ref.current.close();
    }
  };

  return (
    <GestureHandlerRootView style={themedStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS == 'ios' ? 5 : 0}
        style={{flex: 1}}
        enabled>
        <View style={themedStyles.container}>
          <Header />
          {loading && !selectedImage ? (
            <View style={themedStyles.indicator}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <ScrollView style={themedStyles.scrollView}>
              <FirstCarousel
                images={result}
                setSelectedImage={setSelectedImage}
                flatListRef={flatListRef}
              />

              {/* Image Display Section */}
              <View>
                <Image
                  source={{uri: selectedImage}}
                  style={themedStyles.selectedImage}
                />
                <View style={themedStyles.iconContainer}>
                  <View style={themedStyles.iconWrapper}>
                    <Image
                      source={require('../../assets/images/download.png')}
                      style={themedStyles.icon}
                      resizeMode={'contain'}
                    />
                  </View>

                  <View style={themedStyles.iconWrapper}>
                    <Image
                      source={require('../../assets/images/heart.png')}
                      style={themedStyles.icon}
                      resizeMode={'contain'}
                    />
                  </View>

                  <View style={themedStyles.iconWrapper}>
                    <Image
                      source={require('../../assets/images/message.png')}
                      style={themedStyles.icon}
                      resizeMode={'contain'}
                    />
                  </View>
                </View>
              </View>

              {/* Edit Button */}

              {isEdit ? (
                <View style={[themedStyles.textInputView]}>
                  <TextInput
                    placeholder="Write a room prompt "
                    value={prompt}
                    onChangeText={setPrompt}
                    style={themedStyles.input}
                    autoFocus={true} // Ensure it opens automatically
                  />

                  <TouchableOpacity
                    onPress={() => fetchInitialData()}
                    style={themedStyles.iconMessageWrapper}>
                    {loading ? (
                      <ActivityIndicator color={'#ffffff'} size={'small'} />
                    ) : (
                      <Image
                        source={require('../../assets/images/message.png')}
                        style={themedStyles.messageIcon}
                        tintColor={'#FFFFFF'}
                        resizeMode={'contain'}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsEdit(!isEdit)}
                  style={themedStyles.editWithTextView}
                  activeOpacity={0.8}>
                  <Text style={themedStyles.editText}>Edit with Text</Text>
                </TouchableOpacity>
              )}

              <OptionList data={optionImages} />
              <MenuOptionsList
                options={menuOptions}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            </ScrollView>
          )}
        </View>

        {/* Bottom Sheets */}
        {selectedId === 2 && (
          <CommonBottomSheet
            ref={bottomSheetRefs.reStyle}
            title="Re Style"
            subtitle="Pick a Style to Transfer"
            data={FaceArray}
            headerData={ReStyleOption}
            onClose={() => closeBottomSheet(bottomSheetRefs.reStyle)}
            renderItemContent={item => (
              <TouchableOpacity style={themedStyles.imageView}>
                <Image source={item?.path} style={themedStyles.imageStyle} />
              </TouchableOpacity>
            )}
            theme={theme}
          />
        )}
        {selectedId === 3 && (
          <CommonBottomSheet
            ref={bottomSheetRefs.color}
            title="Pick Color to Swap"
            data={ColorData}
            headerData={colorHeaderOption}
            onClose={() => closeBottomSheet(bottomSheetRefs.color)}
            renderItemContent={item => (
              <TouchableOpacity style={themedStyles.imageView}>
                <View
                  style={[themedStyles.imageView, {backgroundColor: item}]}
                />
              </TouchableOpacity>
            )}
            theme={theme}
          />
        )}

        {selectedId === 4 && (
          <CommonBottomSheet
            ref={bottomSheetRefs.face}
            title="FaceSwap"
            subtitle="Pick a Face to Swap"
            data={FaceArray}
            headerData={faceHeaderOption}
            onClose={() => closeBottomSheet(bottomSheetRefs.face)}
            renderItemContent={item => {
              return (
                <TouchableOpacity style={themedStyles.imageView}>
                  <Image source={item?.path} style={themedStyles.imageStyle} />
                </TouchableOpacity>
              );
            }}
            theme={theme}
          />
        )}

        {selectedId === 6 && (
          <QualityBottomSheet
            bottomSheetRef={bottomSheetRefs.quality}
            onSelectQuality={handleQualitySelect}
          />
        )}

        {selectedId === 5 && (
          <ResizeBottomSheet
            bottomSheetRef={bottomSheetRefs.resize}
            resizeData={resizeData}
            onSelectResize={handleResizeSelect}
          />
        )}
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    scrollView: {
      marginTop: 20,
    },
    indicator: {
      flex: 1,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedImage: {
      width: '100%',
      height: 300,
      borderRadius: 5,
      marginTop: 10,
    },
    editWithTextView: {
      height: 40,
      backgroundColor: 'black',
      borderRadius: 10,
      alignItems: 'center',
      paddingHorizontal: 10,
      marginHorizontal: 20,
      marginTop: 10,
      justifyContent: 'center',
    },
    textInputView: {
      // marginHorizontal: 20,
      paddingVertical: 5,
      paddingHorizontal: 15,
      flexDirection: 'row',
      alignItems: 'center',
      // backgroundColor: 'rgb(255, 255, 255)'
    },
    editText: {
      color: 'white',
      marginHorizontal: 10,
      fontSize: 16,
      fontWeight: 700,
    },
    iconContainer: {
      position: 'absolute',
      bottom: 0,
      right: 10,
      left: 10,
      height: 50,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    iconWrapper: {
      backgroundColor: '#b8ac9c',
      height: 40,
      width: 40,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconMessageWrapper: {
      backgroundColor: '#000000',
      height: 35,
      width: 35,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },
    icon: {
      width: 30,
      height: 30,
      borderRadius: 5,
    },
    messageIcon: {
      width: 20,
      height: 20,
      borderRadius: 5,
    },
    contentContainer: {
      flex: 1,
    },
    bottomHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 10,
    },
    reStyleText: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '800',
    },
    pickColorText: {
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '800',
    },
    reStyleSubtitle: {
      paddingTop: 4,
      color: theme.COLORS.GRAY,
      fontWeight: '800',
    },
    optionView: {
      marginHorizontal: 10,
      marginTop: 15,
    },
    colorOptionHeader: {
      marginHorizontal: 30,
      marginTop: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    optionText: {
      fontFamily: theme.fontFamily.InterBold,
      fontWeight: '800',
    },
    imageStyle: {
      height: 90,
      width: ITEM_SIZE,
      borderRadius: 10,
    },
    imageView: {
      height: 90,
      width: ITEM_SIZE,
      borderRadius: 10,
    },
    buttonView: {
      position: 'absolute',
      backgroundColor: theme.COLORS.PRIMARY,
      right: 0,
      left: 0,
      bottom: 15,
      height: 45,
      marginHorizontal: 70,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      borderRadius: 6,
    },
    buttonText: {
      color: theme.COLORS.WHITE,
    },
    flatContainer: {
      paddingHorizontal: ITEM_SPACING,
      paddingVertical: ITEM_SPACING,
      gap: ITEM_SPACING,
      paddingBottom: 70,
    },
    input: {
      fontSize: 16,
      fontFamily: theme.fontFamily.InterBold,
      backgroundColor: 'lightgray',
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 5,
      flex: 1,
    },
  });

export default HomeScreen;
