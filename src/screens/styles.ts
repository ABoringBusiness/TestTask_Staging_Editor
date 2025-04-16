import {Dimensions, StyleSheet} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const NUM_COLUMNS = 4;
const ITEM_SPACING = 8;
const ITEM_SIZE =
  (SCREEN_WIDTH - ITEM_SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    keyboardAvoidingView: {flex: 1},
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
      paddingVertical: 5,
      paddingHorizontal: 15,
      flexDirection: 'row',
      alignItems: 'center',
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
    selectedBorder: {
      borderWidth: 1,
      borderColor: '#000000', // or theme.primary, whatever suits your theme
      borderRadius: 10,
      width: ITEM_SIZE + 2,
    },
    video: {
      height: 100,
      width: 170,
      margin: 5,
      borderRadius: 5,
    },
    close: {
      position: 'absolute',
      left: 160,
      zIndex: 1,
    },
  });
