import React from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import Video from 'react-native-video';

interface FirstCarouselProps {
  video: string[] | null;
  setSelectedVideo: (image: string) => void | null;
  flatListRef: React.RefObject<FlatList<string> | null>;
}

const FirstCarouselVideo: React.FC<FirstCarouselProps> = ({
  video,
  setSelectedVideo,
  flatListRef,
}) => {
  const renderItem = ({item, index}: {item: string; index: number}) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedVideo(item);
        if (index === 3) {
          flatListRef?.current?.scrollToEnd({animated: true});
        } else if (index === 1) {
          flatListRef?.current?.scrollToOffset({offset: 0});
        }
      }}>
      <View style={styles.imageContainer}>
        <Video source={{uri : item}} resizeMode='cover' style={styles.image}/>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={video}
      horizontal
      renderItem={renderItem}
      keyExtractor={item => item}
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  image: {
    height: 100,
    width: 100,
    margin: 5,
    borderRadius: 5,
  },
});

export default FirstCarouselVideo;
