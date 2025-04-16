import React from 'react';
import {
  FlatList,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Video from 'react-native-video';

interface Option {
  id: number;
  url: string;
}

interface OptionListProps {
  data: Option[];
  type: string;
  setSelectedVideo?: (url: string) => void;
  setSelectedImage?: (url: string) => void;
  onPress?: () => void;
}

const OptionList: React.FC<OptionListProps> = ({
  data,
  type,
  setSelectedVideo,
  setSelectedImage,
  onPress,
}) => {
  const optionRenderItem = ({item}: {item: Option}) => (
    <View style={styles.imageContainer}>
      {type === 'video' ? (
        <TouchableOpacity
          onPress={() => {
            onPress && onPress;
            setSelectedVideo && setSelectedVideo(item.url);
            setSelectedImage && setSelectedImage('');
          }}>
          <Video
            source={{uri: item.url}}
            resizeMode="cover"
            style={styles.image}
          />
        </TouchableOpacity>
      ) : (
        <Image
          source={{uri: item.url}}
          resizeMode="cover"
          style={styles.image}
        />
      )}
    </View>
  );

  return (
    <FlatList
      data={data}
      horizontal
      style={styles.container}
      renderItem={optionRenderItem}
      keyExtractor={item => item.id.toString()}
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  imageContainer: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  image: {
    height: 100,
    width: 170,
    margin: 5,
    borderRadius: 5,
  },
});

export default OptionList;
