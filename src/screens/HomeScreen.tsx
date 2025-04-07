import BottomSheet from '@gorhom/bottom-sheet';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {useTheme} from '@rneui/themed';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  deployRoomRedesign,
  deployRoomRepaint,
  deployRoomReStyle,
} from '../api/api.tsx';
import CommonBottomSheet from '../component/ui/CommonBottomSheet.tsx';
import FirstCarousel from '../component/ui/FirstCarousel.tsx';
import Header from '../component/ui/Header.tsx';
import MenuOptionsList from '../component/ui/MenuOptionList.tsx';
import OptionList from '../component/ui/OptionList.tsx';
import QualityBottomSheet from '../component/ui/QualityBottomSheet.tsx';
import ResizeBottomSheet from '../component/ui/ResizeBottomSheet.tsx';
import {menuOptions, optionImages} from '../constant/data.tsx';
import {MainStackScreenProps} from '../types/navigation.types.ts';
import {styles} from './styles.ts';
import {
  ColorData,
  colorHeaderOption,
  FaceArray,
  faceHeaderOption,
  resizeData,
  ReStyleOption,
} from './utils.ts';

interface HomeScreenProps extends MainStackScreenProps<'Home'> {}

const HomeScreen: React.FC<HomeScreenProps> = () => {
  // State management
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [loading, setLoading] = useState(true);
  const [loadingRestyle, setLoadingRestyle] = useState(false);
  const [loadingRePaint, setLoadingRePaint] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [result, setResult] = useState<string[] | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
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
        setIsEdit(false);
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

  const handleRoomReStyle = async () => {
    try {
      setLoadingRestyle(true);

      console.log(selectedSpace, selectedStyle);
      const response = await deployRoomReStyle({
        'Space Name': selectedSpace,
        'Space Style': selectedStyle,
      });

      if (response.status === 'pending') {
        handleRoomReStyle();
        return;
      }

      if (response.status === 'complete') {
        setLoadingRestyle(false);
        setIsEdit(false);
        closeBottomSheet(bottomSheetRefs.reStyle);
        if (response.job.files) {
          setLoadingRestyle(false);
          setResult(response.job.files);
          setSelectedImage(response.job.files[0]);
        }
      }
    } catch (error) {
      setLoadingRestyle(false);
      console.error('Failed to restyle room:', error);
    }
  };

  const handleRePaint = async () => {
    try {
      setLoadingRePaint(true);

      console.log(selectedColor);
      const response = await deployRoomRepaint({
        Color: selectedColor,
      });

      if (response.status === 'pending') {
        handleRePaint();
        return;
      }

      if (response.status === 'complete') {
        setLoadingRePaint(false);
        setIsEdit(false);
        closeBottomSheet(bottomSheetRefs.color);
        if (response.job.files) {
          setLoadingRestyle(false);
          setResult(response.job.files);
          setSelectedImage(response.job.files[0]);
        }
      }
    } catch (error) {
      setLoadingRePaint(false);
      console.error('Failed to restyle room:', error);
    }
  };

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
      setSelectedId(null);
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
            title="Room ReStyle"
            subtitle="Pick a Style to Transfer"
            data={FaceArray}
            headerData={ReStyleOption}
            loading={loadingRestyle}
            onClose={() => closeBottomSheet(bottomSheetRefs.reStyle)}
            onPress={() => handleRoomReStyle()}
            renderItemContent={item => {
              const isSelected =
                selectedStyle === item.spaceStyle &&
                selectedSpace === item.spaceName;
              return (
                <TouchableOpacity
                  style={[themedStyles.imageView]}
                  onPress={() => {
                    setSelectedStyle(item.spaceStyle);
                    setSelectedSpace(item.spaceName);
                  }}>
                  <Image
                    source={item?.path}
                    style={[
                      themedStyles.imageStyle,
                      isSelected && themedStyles.selectedBorder,
                    ]}
                  />
                </TouchableOpacity>
              );
            }}
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
            onPress={() => handleRePaint()}
            loading={loadingRePaint}
            renderItemContent={item => {
              const isSelected = selectedColor === item?.id;
              return (
                <TouchableOpacity
                  style={[
                    themedStyles.imageView,
                    isSelected && themedStyles.selectedBorder,
                  ]}
                  onPress={() => setSelectedColor(item?.id)}>
                  <View
                    style={[
                      themedStyles.imageView,
                      {backgroundColor: item?.color},
                      isSelected && themedStyles.selectedBorder,
                    ]}
                  />
                </TouchableOpacity>
              );
            }}
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

export default HomeScreen;
