import BottomSheet from '@gorhom/bottom-sheet';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {useTheme} from '@rneui/themed';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
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
  deployRemoveBackground,
  deployRoomRedesign,
  deployRoomRepaint,
  deployRoomReStyle,
  deployThreeDPhoto,
  faceSwap,
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
  RoomArray,
  threeDPhoto,
  videoArray,
} from './utils.ts';
import FirstCarouselVideo from '../component/ui/FirstCarouselVideo.tsx';
import Video, {VideoRef} from 'react-native-video';
import {launchImageLibrary} from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface HomeScreenProps extends MainStackScreenProps<'Home'> {}

// Define types for API responses
interface ApiResponse {
  status: 'pending' | 'complete' | string;
  job?: {
    files?: string[];
  };
}

const HomeScreen: React.FC<HomeScreenProps> = () => {
  // State management
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [selectedId, setSelectedId] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);
  const [loadingRestyle, setLoadingRestyle] = useState(false);
  const [loadingRePaint, setLoadingRePaint] = useState(false);
  const [loadingFace, setLoadingFace] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [result, setResult] = useState<string[] | null>(null);
  const [resultVideo, setResultVideo] = useState<string[] | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedFace, setSelectedFace] = useState<string>('');
  const [selectedFaceId, setSelectedFaceId] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [selectedPhotoId, setSelectedPhotoId] = useState<string>('');
  const [video, setVideo] = useState<string>('');

  console.log('selectedId', selectedId);
  const videoRef = useRef<VideoRef>(null);
  // Refs
  const flatListRef = useRef<FlatList<string> | null>(null);
  const bottomSheetRefs: {
    reStyle: React.RefObject<BottomSheetMethods>;
    color: React.RefObject<BottomSheetMethods>;
    face: React.RefObject<BottomSheetMethods>;
    quality: React.RefObject<BottomSheetMethods>;
    resize: React.RefObject<BottomSheetMethods>;
    photo: React.RefObject<BottomSheetMethods>;
  } = {
    reStyle: useRef<BottomSheetMethods>(null!),
    color: useRef<BottomSheetMethods>(null!),
    face: useRef<BottomSheetMethods>(null!),
    quality: useRef<BottomSheetMethods>(null!),
    resize: useRef<BottomSheetMethods>(null!),
    photo: useRef<BottomSheetMethods>(null!),
  };

  const {theme} = useTheme();
  const themedStyles = styles(theme);

  const pollApiEndpoint = useCallback(
    async (
      apiCall: () => Promise<ApiResponse>,
      onComplete: (files: string[]) => void,
      setLoadingState: React.Dispatch<React.SetStateAction<boolean>>,
      bottomSheetRef?: React.RefObject<BottomSheetMethods>,
    ) => {
      try {
        setLoadingState(true);
        const response = await apiCall();

        if (response.status === 'pending') {
          // Retry with exponential backoff could be implemented here
          setTimeout(
            () =>
              pollApiEndpoint(
                apiCall,
                onComplete,
                setLoadingState,
                bottomSheetRef,
              ),
            1000,
          );
          return;
        }

        if (response.status === 'complete' && response.job?.files) {
          setLoadingState(false);
          setIsEdit(false);
          if (bottomSheetRef) closeBottomSheet(bottomSheetRef);
          onComplete(response.job.files);
        }
      } catch (error) {
        setLoadingState(false);
        console.error('Error in API polling:', error);
      }
    },
    [],
  );

  const fetchInitialData = useCallback(async () => {
    pollApiEndpoint(
      () => deployRoomRedesign(prompt),
      files => {
        setResult(files);
        setSelectedImage(files[0]);
        setPrompt('');
      },
      setLoading,
    );
  }, [prompt, pollApiEndpoint]);

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoomReStyle = useCallback(async () => {
    pollApiEndpoint(
      () =>
        deployRoomReStyle({
          'Space Name': selectedSpace,
          'Space Style': selectedStyle,
        }),
      files => {
        setResult(files);
        setSelectedImage(files[0]);
      },
      setLoadingRestyle,
      bottomSheetRefs.reStyle,
    );
  }, [selectedSpace, selectedStyle, pollApiEndpoint, bottomSheetRefs?.reStyle]);

  const handleRePaint = useCallback(async () => {
    pollApiEndpoint(
      () => deployRoomRepaint({Color: selectedColor}),
      files => {
        setResult(files);
        setSelectedImage(files[0]);
      },
      setLoadingRePaint,
      bottomSheetRefs.color,
    );
  }, [selectedColor, pollApiEndpoint, bottomSheetRefs?.color]);

  const handleFaceSwap = useCallback(async () => {
    console.log('selectedFace', selectedFace);
    pollApiEndpoint(
      () =>
        faceSwap({swap_image: selectedFace}).catch(() =>
          Alert.alert('Billing required'),
        ),
      files => {
        setResult(files);
        setSelectedImage(files[0]);
      },
      setLoadingFace,
      bottomSheetRefs.face,
    );
  }, [pollApiEndpoint, bottomSheetRefs?.face, selectedFace]);

  const handleThreeDPhoto = useCallback(async () => {
    pollApiEndpoint(
      () => deployThreeDPhoto({Image: selectedPhoto}),
      files => {
        console.log('files', files);
        setResultVideo(files);
        setSelectedVideo(files[0]);
        setResult(null);
        setSelectedImage('');
      },
      setLoadingPhoto,
      bottomSheetRefs.photo,
    );
  }, [pollApiEndpoint, bottomSheetRefs?.photo, selectedPhoto]);

  const handleRemoveBackground = useCallback(async () => {
    console.log('Hello')
    if (!selectedVideo) {
      console.log('No video selected');
      Alert.alert('Error', 'Please select a video first');
      return;
    }
  
    pollApiEndpoint(
      () => 
        deployRemoveBackground({input_video: selectedVideo})
          .catch(err => {
            console.log('API Error:', err?.response || err);
            Alert.alert(
              'Error',
              'Failed to remove background. Please try again.'
            );
            throw err; // Re-throw to stop the polling
          }),
      files => {
        console.log('Background removed successfully:', files);
        setResultVideo(files);
        setSelectedVideo(files[0]);
        setResult(null);
        setSelectedImage('');
      },
      setLoadingPhoto,
    );
  }, [pollApiEndpoint, selectedVideo]);

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

  const pickVideo = () => {
    launchImageLibrary(
      {
        mediaType: 'video',
        selectionLimit: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled video picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          const videoAsset = response.assets?.[0];
          setVideo(videoAsset?.uri);
        }
      },
    );
  };

  useEffect(() => {
    if (selectedId === 1) {
      pickVideo();
    }
  }, [selectedId]);

  return (
    <GestureHandlerRootView style={themedStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 5 : 0}
        style={themedStyles.keyboardAvoidingView}
        enabled>
        <View style={themedStyles.container}>
          <Header />
          {loading && !selectedImage ? (
            <View style={themedStyles.indicator}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <ScrollView style={themedStyles.scrollView}>
              {resultVideo && result == null ? (
                <FirstCarouselVideo
                  video={resultVideo}
                  setSelectedVideo={setSelectedVideo}
                  flatListRef={flatListRef}
                />
              ) : (
                <FirstCarousel
                  images={result}
                  setSelectedImage={setSelectedImage}
                  flatListRef={flatListRef}
                />
              )}

              {/* Image Display Section */}
              <View>
                {selectedVideo && !selectedImage ? (
                  <Video
                    ref={videoRef}
                    source={{uri: selectedVideo}}
                    style={themedStyles.selectedImage}
                    controls={true}
                  />
                ) : (
                  <Image
                    source={{uri: selectedImage}}
                    style={themedStyles.selectedImage}
                  />
                )}

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

              {video ? (
                <View>
                  <View style={themedStyles.close}>
                    <AntDesign
                      name="closecircle"
                      size={24}
                      onPress={() => {
                        setVideo('');
                        setSelectedVideo('');
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedImage('');
                      setSelectedVideo(video);
                    }}>
                    <Video
                      source={{uri: video}}
                      resizeMode="cover"
                      style={themedStyles.video}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <OptionList
                  data={selectedId === 8 ? videoArray : optionImages}
                  type={selectedId === 8 ? 'video' : 'image'}
                  setSelectedVideo={setSelectedVideo}
                  setSelectedImage={setSelectedImage}
                  onPress={selectedId === 8 ? handleRemoveBackground : undefined}
                />
              )}
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
            data={RoomArray}
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
                    source={{uri: item?.path}}
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
            onPress={() => handleFaceSwap()}
            loading={loadingFace}
            renderItemContent={item => {
              const isSelected = selectedFaceId === item?.id;
              return (
                <TouchableOpacity
                  style={themedStyles.imageView}
                  onPress={() => {
                    setSelectedFace(item.path.toString());
                    setSelectedFaceId(item.id);
                  }}>
                  <Image
                    source={{uri: item?.path}}
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

        {selectedId === 6 && (
          <QualityBottomSheet
            bottomSheetRef={bottomSheetRefs.quality}
            onSelectQuality={handleQualitySelect}
          />
        )}

        {selectedId === 7 && (
          <CommonBottomSheet
            ref={bottomSheetRefs.photo}
            title="3D Photo"
            subtitle="Pick a Photo to Transfer"
            data={threeDPhoto}
            headerData={ReStyleOption}
            loading={loadingPhoto}
            onClose={() => closeBottomSheet(bottomSheetRefs.photo)}
            onPress={() => handleThreeDPhoto()}
            renderItemContent={item => {
              const isSelected = selectedPhotoId === item?.id;
              return (
                <TouchableOpacity
                  style={[themedStyles.imageView]}
                  onPress={() => {
                    setSelectedPhoto(item.path.toString());
                    setSelectedPhotoId(item.id);
                  }}>
                  <Image
                    source={{uri: item?.path}}
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
