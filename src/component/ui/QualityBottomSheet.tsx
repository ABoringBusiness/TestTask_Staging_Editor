import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { QualityData } from '../../screens/utils';


interface QualityBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  onSelectQuality?: (quality: any) => void;
}

const QualityBottomSheet: React.FC<QualityBottomSheetProps> = ({
  bottomSheetRef,
  onSelectQuality,
}) => {
  const handleQualitySelect = (item: any) => {
    onSelectQuality?.(item);
    bottomSheetRef.current?.close();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['25%', '25%']}
      enableDynamicSizing={false}
      enablePanDownToClose={true}>
      <BottomSheetView style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.qualityHeader}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.reStyleText}>Which Quality?</Text>
          </View>
        </View>

        {/* Quality Options */}
        <View style={styles.contentContainer}>
          <FlatList
            data={QualityData}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.qualityFlatContainer}
            renderItem={({item}) => (
              <TouchableOpacity
                key={item?.id}
                style={styles.qualityItemContainer}
                onPress={() => handleQualitySelect(item)}>
                <Image source={item?.path} style={styles.qualityImage} />
                <Text style={styles.qualityText}>{item?.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item?.id?.toString()}
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  qualityHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerTitleContainer: {
    justifyContent: 'center',
  },
  reStyleText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
  },
  qualityFlatContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  qualityItemContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  qualityImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  qualityText: {
    textAlign: 'center',
    paddingTop: 5,
    fontWeight: '800',
    color: '#000000',
  },
});

export default React.memo(QualityBottomSheet);
