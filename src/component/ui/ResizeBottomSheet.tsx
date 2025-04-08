import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';

// Constants
const SCREEN_WIDTH = Dimensions.get('window').width;
const NUM_COLUMNS_RESIZE = 6;
const ITEM_SPACING_RESIZE = 2;
const ITEM_SIZE_RESIZE =
  (SCREEN_WIDTH - ITEM_SPACING_RESIZE * (NUM_COLUMNS_RESIZE + 1)) /
  NUM_COLUMNS_RESIZE;

// Resize data type
interface ResizeItem {
  x: number;
  y: number;
}

interface ResizeBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  resizeData: ResizeItem[];
  onSelectResize?: (item: ResizeItem) => void;
}

const ResizeBottomSheet: React.FC<ResizeBottomSheetProps> = ({
  bottomSheetRef,
  resizeData,
  onSelectResize,
}) => {
  const [selected, setSelected] = useState<number | null>(0);

  const handleResizeSelect = (index: number, item: ResizeItem) => {
    setSelected(index);
    onSelectResize?.(item);
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['20%', '20%']}
      enablePanDownToClose={true}>
      <BottomSheetView style={styles.contentContainer}>
        <FlatList
          data={resizeData}
          numColumns={NUM_COLUMNS_RESIZE}
          columnWrapperStyle={styles.grpColStyle}
          contentContainerStyle={styles.grpContainer}
          renderItem={({item, index}) => (
            <LinearGradient
              colors={
                index === selected
                  ? ['#ff0080', '#8000ff']
                  : ['#ffffffff', '#ffffffff']
              }
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={[styles.groupItem]}>
              <TouchableOpacity
                onPress={() => handleResizeSelect(index, item)}
                style={[styles.touchableContainer, {}]}
                activeOpacity={1}>
                <View style={styles.contentView}>
                  <View style={styles.boxContainer}>
                    <View
                      style={[styles.box, {aspectRatio: item.x / item.y}]}
                    />
                  </View>
                  <View style={styles.txtView}>
                    <Text style={styles.ratioText}>
                      {item.x}:{item.y}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </LinearGradient>
          )}
          keyExtractor={(item, index) => `${item.x}-${item.y}-${index}`}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  grpColStyle: {
    gap: ITEM_SPACING_RESIZE,
  },
  grpContainer: {
    padding: ITEM_SPACING_RESIZE,
    paddingBottom: 10,
  },
  groupItem: {
    width: ITEM_SIZE_RESIZE,
    height: ITEM_SIZE_RESIZE * 1.4 + 12,
  },
  touchableContainer: {
    backgroundColor: 'blue',
    alignItems: 'center',
    margin: 2,
  },
  contentView: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  boxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  box: {
    borderWidth: 2,
    width: ITEM_SIZE_RESIZE * 0.6,
    borderRadius: 1,
  },
  txtView: {
    alignItems: 'center',
    paddingBottom: 4,
  },
  ratioText: {
    fontSize: 12,
  },
});

export default React.memo(ResizeBottomSheet);
