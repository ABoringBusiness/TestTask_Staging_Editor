import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import React, {JSX, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Constants
const NUM_COLUMNS = 4;
const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_SPACING = 8;
const ITEM_SIZE =
  (SCREEN_WIDTH - ITEM_SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

interface BottomSheetContentProps {
  ref: React.RefObject<BottomSheetMethods>;
  title: string;
  subtitle?: string;
  data: any[];
  headerData?: any[];
  onClose: () => void;
  renderItemContent: (item: any) => JSX.Element;
  theme: any;
  onPress?: () => void;
  loading?: boolean;
}

const CommonBottomSheet: React.FC<BottomSheetContentProps> = ({
  ref,
  title,
  subtitle,
  data,
  headerData,
  onClose,
  renderItemContent,
  theme,
  onPress,
  loading,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(1);
  const themedStyles = styles(theme);
  console.log(data);
  return (
    <BottomSheet
      ref={ref}
      snapPoints={['40%', '40%']}
      enableDynamicSizing={false}
      enablePanDownToClose={true}>
      <BottomSheetView style={themedStyles.contentContainer}>
        {/* Header */}
        <View style={themedStyles.bottomHeader}>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="close" size={24} />
          </TouchableOpacity>
          <View style={themedStyles.headerCenter}>
            <Text style={themedStyles.reStyleText}>{title}</Text>
            {subtitle && (
              <Text style={themedStyles.reStyleSubtitle}>{subtitle}</Text>
            )}
          </View>
          <Feather name="search" size={24} />
        </View>

        {/* Header Options */}
        {headerData && (
          <View style={themedStyles.colorOptionHeader}>
            <FlatList
              data={headerData}
              horizontal
              contentContainerStyle={themedStyles.flatContentContainer}
              renderItem={({item}) => {
                const isSelected = selectedOptionId === item?.id;
                return (
                  <TouchableOpacity
                    key={item?.id}
                    onPress={() => setSelectedOptionId(item?.id)}>
                    <Text
                      style={[
                        themedStyles.optionText,
                        // eslint-disable-next-line react-native/no-inline-styles
                        {color: isSelected ? '#000000' : '#B8B8B8'},
                      ]}>
                      {item?.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}

        {/* Main Content */}
        <View style={themedStyles.contentContainer}>
          <FlatList
            data={data}
            scrollEnabled={true}
            numColumns={NUM_COLUMNS}
            columnWrapperStyle={{gap: ITEM_SPACING}}
            // showsVerticalScrollIndicator={false}
            contentContainerStyle={themedStyles.flatContainer}
            renderItem={({item}) => renderItemContent(item)}
          />
        </View>

        {/* Add Your Own Button */}
        <TouchableOpacity style={themedStyles.buttonView} onPress={onPress}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={themedStyles.buttonText}>Add Your Own</Text>
          )}
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = (theme: any) =>
  StyleSheet.create({
    // ... (copy the relevant styles from the original component)
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
    reStyleSubtitle: {
      paddingTop: 4,
      color: '#B8B8B8',
      fontWeight: '800',
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
    flatContainer: {
      paddingHorizontal: ITEM_SPACING,
      paddingVertical: ITEM_SPACING,
      gap: ITEM_SPACING,
      paddingBottom: 70,
      flexGrow: 1,
    },
    flatContentContainer: {
      gap: 70,
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
    headerCenter: {
      justifyContent: 'center',
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
      color: '#FFFFFF',
    },
  });

export default CommonBottomSheet;
