import { StyleSheet, Dimensions, Platform } from "react-native";
import { ifIphoneX } from "react-native-iphone-x-helper";
const { width, height } = Dimensions.get("window");
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

export default StyleSheet.create({
  size: 24,
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 0
  },
  containerAndroid: {
    flex: 1,
    justifyContent: "center",
    padding: 0,
    paddingTop: Platform.OS === "android" ? 25 : 0
  },
  panelHeader: {
    height,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16
  },
  footerIcon: {
    color: "#9d41eb"
  },
  footerHeight: {
    ...ifIphoneX(
      {
        backgroundColor: "#FAFAFA",
        // height: height - '80%',
        bottom: 0,
        left: 0,
        right: 0,
        position: "absolute"
      },
      {
        ...Platform.select({
          ios: { height: null },
          android: { backgroundColor: "#FAFAFA" }
        })
      }
    )
  },
  footerTab: {
    ...Platform.select({
      ios: {},
      android: { backgroundColor: "#FAFAFA" }
    })
  },
  footerButtonStyle: {
    ...ifIphoneX(
      {
        borderRadius: 0,
        height: "100%",
        backgroundColor: "transparent"
      },
      {
        ...Platform.select({
          ios: {
            borderRadius: 0,
            height: "auto",
            backgroundColor: "transparent"
          },
          android: {
            borderRadius: 0,
            height: "auto",
            backgroundColor: "transparent"
          }
        })
      }
    )
  },
  textIconFooter: {
    ...ifIphoneX(
      {
        fontSize: 10,
        marginBottom: 20,
        color: "#343239"
      },
      {
        ...Platform.select({
          ios: { fontSize: 10, color: "#343239" },
          android: { fontSize: 10, color: "darkgrey" }
        })
      }
    )
  },
  iconFooter: {
    ...Platform.select({
      ios: { color: "#563688" },
      android: { color: "#563688" }
    })
  },
  iconTouchableBuy: {
    top: 2
  },
  iconTouchableSend: {
    top: 2,
    right: 1
  },
  iconTouchableReceive: {
    top: 3
  },
  iconTouchableAdd: {
    bottom: 4
  },
  iconHeaderBack: {
    marginLeft: 10
  },
  iconInputContact: {
    marginRight: 10,
    marginBottom: 3,
    color: "#B4B3B3"
  },
  linearGradientNew: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%"
  },
  introBackground: {
    backgroundColor: "#290C64",
    width: "100%",
    height: "100%"
  },
  viewFlex: {
    ...Platform.select({
      ios: {
        flex: 1
      },
      android: {
        flex: 1
      }
    })
  },
  headerBlock: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  viewMonoWallets: {
    ...ifIphoneX(
      {
        flex: 1,
        backgroundColor: "white",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "80%"
      },
      {
        ...Platform.select({
          ios: {
            flex: 1,
            backgroundColor: "white",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: hp("70%")
          },
          android: {
            flex: 1,
            backgroundColor: "white",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: hp("65%")
          }
        })
      }
    )
  },
  viewMono: {
    ...ifIphoneX(
      {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "55%"
      },
      {
        ...Platform.select({
          ios: {
            flex: 1,
            backgroundColor: "#fff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: hp("45%")
          },
          android: {
            flex: 1,
            backgroundColor: "#fff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: hp("40%")
          }
        })
      }
    )
  },
  viewMonoBuy: {
    ...ifIphoneX(
      {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "35%"
      },
      {
        ...Platform.select({
          ios: {
            flex: 1,
            backgroundColor: "#fff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "25%"
          },
          android: {
            flex: 1,
            backgroundColor: "#fff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "20%"
          }
        })
      }
    )
  },
  viewMonoHistory: {
    flex: 1,
    zIndex: 999,
    backgroundColor: "#fff",
    // borderTopLeftRadius: 16,
    // borderTopRightRadius: 16,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%"
  },
  viewModalVerify: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%"
  },
  viewMonoGray: {
    backgroundColor: "rgba( 232, 239, 243, 100)",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  listPadding: {
    // paddingTop: 10,
  },
  // Buy Level page
  containerScreen: {
    flex: 1,
    width: "100%",
    alignItems: "center"
    // justifyContent: 'center',
  },
  viewBuyFront: {
    flex: 1,
    backgroundColor: "#FDFDFD",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "30%",
    zIndex: 1
  },
  viewBuy: {
    ...ifIphoneX(
      {
        flex: 1,
        backgroundColor: "rgba(253,253,253,0.25)",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "15%",
        zIndex: 0
      },
      {
        flex: 1,
        backgroundColor: "rgba(253,253,253,0.25)",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "20%",
        zIndex: 0
      }
    )
  },
  viewBuyBack: {
    ...ifIphoneX(
      {
        flex: 1,
        backgroundColor: "rgba(253,253,253,0.25)",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "45%",
        zIndex: 0
      },
      {
        ...Platform.select({
          ios: {
            flex: 1,
            backgroundColor: "rgba(253,253,253,0.25)",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "35%",
            zIndex: 0
          },
          android: {
            flex: 1,
            backgroundColor: "rgba(253,253,253,0.25)",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "35%",
            zIndex: 0
          }
        })
      }
    )
  },
  viewBuyBackTransfer: {
    ...ifIphoneX(
      {
        flex: 1,
        backgroundColor: "rgba(253,253,253,0.25)",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "45%",
        zIndex: 0
      },
      {
        ...Platform.select({
          ios: {
            flex: 1,
            backgroundColor: "rgba(253,253,253,0.25)",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "45%",
            zIndex: 0
          },
          android: {
            flex: 1,
            backgroundColor: "rgba(253,253,253,0.25)",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "50%",
            zIndex: 0
          }
        })
      }
    )
  },

  textFrontBuy: {
    ...ifIphoneX(
      {
        fontSize: 20,
        color: "rgba(49,49,49,100)",
        marginTop: "10%"
      },
      {
        fontSize: 18,
        color: "rgba(49,49,49,100)",
        marginVertical: "4%"
      }
    )
  },
  textFrontTransfer: {
    ...ifIphoneX(
      {
        fontSize: 20,
        color: "rgba(49,49,49,100)",
        marginTop: "10%"
      },
      {
        fontSize: 18,
        color: "rgba(49,49,49,100)",
        marginTop: "10%"
      }
    )
  },
  containerHeight: {
    height: "100%"
  },
  bodyBlock: {
    ...ifIphoneX(
      {
        // marginTop: 20,
        marginTop: "5%",
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20
      },
      {
        ...Platform.select({
          ios: { marginTop: "5%", flex: 1, paddingLeft: 20, paddingRight: 20 },
          android: { marginTop: 5, flex: 1, paddingLeft: 20, paddingRight: 20 }
        })
      }
    )
  },
  bodyBlockSettings: {
    ...ifIphoneX(
      {
        position: "absolute",
        // bottom: hp('65%'),
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        top: -120
      },
      {
        position: "absolute",
        // bottom: hp('68%'),
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        top: -120
      }
    )
  },
  viewTextInputDown: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  viewTextInput: {
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  textInputDownRight: {
    fontSize: 14,
    marginVertical: 10,
    color: "rgba(255,255,255,0.80)"
  },
  textInputDownLeft: {
    fontSize: 14,
    marginTop: 10,
    color: "rgba(255,255,255,0.80)"
  },
  textInputDown: {
    fontSize: 16,
    marginTop: 20,
    marginHorizontal: 20
    // color: '#fff',
  },
  btnCloseModal: {
    bottom: hp("5%"),
    alignItems: "center"
  },
  textInputDownMl: {
    fontSize: 16,
    marginTop: 10,
    color: "#fff",
    marginLeft: 20
  },
  containerBuy: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "80%",
    zIndex: 1
  },
  arrowHeaderLeft: {
    paddingLeft: 15
  },
  arrowHeaderRight: {
    paddingRight: 15
  },
  arrowHeaderIcon: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold"
  },
  arrowHeaderIconBlack: {
    fontSize: 30,
    color: "#9d41eb",
    // color: '#fff',
    fontWeight: "bold"
  },
  headerIcon: {
    // fontSize: 40,
    color: "#fff",
    fontWeight: "bold"
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold"
  },
  arrowHeaderIconTransparent: {
    fontSize: 30,
    color: "transparent",
    fontWeight: "bold"
  },
  arrowHeaderIconNoTransparent: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "bold"
  },
  titleHeader: {
    ...ifIphoneX(
      {
        marginTop: 10,
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold"
      },
      {
        ...Platform.select({
          ios: {
            marginTop: 5,
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold"
          },
          android: {
            marginTop: 5,
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold"
          }
        })
      }
    )
  },
  labelInput: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold"
  },
  title: {
    ...ifIphoneX(
      {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: "center",
        height: 30
        // marginTop: 10
      },
      {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: "center"
      }
    )
  },
  title1: {
    ...ifIphoneX(
      {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: "center",
        height: 30,
        marginTop: 10,
        textAlign: "center",
        width: "150%"
      },
      {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: "center",
        textAlign: "center",
        width: "150%"
      }
    )
  },
  titleBlack: {
    ...ifIphoneX(
      {
        color: "#000",
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: "center",
        height: 30,
        marginTop: 10
      },
      {
        color: "#000",
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: "center"
      }
    )
  },

  h1TextBuy: {
    ...ifIphoneX(
      {
        marginTop: 15,
        // paddingRight: '10%',
        color: "#fff",
        fontSize: 36,
        fontWeight: "bold"
      },
      {
        ...Platform.select({
          ios: {
            marginTop: 10,
            // paddingRight: '10%',
            color: "#fff",
            fontSize: 28,
            fontWeight: "bold"
          },
          android: {
            marginTop: 10,
            // paddingRight: '10%',
            color: "#fff",
            fontSize: 24,
            fontWeight: "bold"
          }
        })
      }
    )
  },
  viewMt: {
    ...ifIphoneX(
      {
        marginVertical: 15
      },
      {
        ...Platform.select({
          ios: {
            marginVertical: 10
          },
          android: {
            marginVertical: 10
          }
        })
      }
    )
  },
  itemBorderColor: {
    borderBottomColor: "rgba(255,255,255,0.60)"
  },
  itemBorderColorAndroidNone: {
    ...Platform.select({
      ios: {
        borderBottomColor: "#fff"
      },
      android: { display: "none" }
    })
  },
  inputStyle: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
    paddingLeft: 0
  },
  inputStyleNumberCard: {
    ...ifIphoneX(
      {
        color: "#fff",
        fontWeight: "bold",
        paddingLeft: 0,
        fontSize: 28,
        marginTop: 10
      },
      {
        ...Platform.select({
          ios: {
            color: "#fff",
            fontWeight: "bold",
            paddingLeft: 0,
            fontSize: 22,
            marginTop: 10
          },
          android: {
            color: "#fff",
            fontWeight: "bold",
            paddingLeft: 0,
            width: "100%",
            fontSize: 20,
            marginTop: 10
          }
        })
      }
    )
  },
  inputStyleDefault: {
    color: "rgba(255,255,255,0.90)",
    fontSize: 20,
    // fontWeight: 'bold',
    paddingLeft: 0
  },
  buttonInput: {
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  buttonMargin: {
    marginHorizontal: -15
  },
  textButton: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold"
  },
  textButtonTransparent: {
    fontSize: 18,
    color: "rgba(255,255,255,0.50)",
    fontWeight: "bold",
    paddingRight: 0
  },
  viewSuccessModal: {
    ...ifIphoneX(
      {
        flex: 1,
        width: "100%",
        marginTop: "-10%"
      },
      {
        flex: 1,
        width: "100%",
        marginTop: "-5%"
      }
    )
  },
  viewWithdrawModal: {
    ...ifIphoneX(
      {
        flex: 1,
        width: "100%",
        marginTop: "-10%"
      },
      {
        flex: 1,
        width: "100%"
        // marginTop: 0,
      }
    )
  },
  viewMl: {
    marginLeft: 20
  },
  textCurrentH2: {
    marginTop: "5%",
    color: "rgba(255,255,255,0.80)",
    fontSize: 14,
    fontWeight: "bold"
  },
  textCurrentQr: {
    marginBottom: "5%",
    color: "rgba(255,255,255,0.80)",
    fontSize: 14,
    fontWeight: "bold"
  },
  textCurrentH1: {
    marginTop: "2%",
    color: "rgba(255,255,255,100)",
    fontSize: 20,
    fontWeight: "bold"
  },
  textCurrentH3: {
    marginTop: "2%",
    color: "rgba(255,255,255,0.80)",
    fontSize: 13,
    fontWeight: "200"
  },
  // Dashboard
  headerLayoutStyle: {
    width,
    height,
    top: 80,
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  viewHeight: {
    position: "absolute",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0
  },
  draggableRange: {
    ...ifIphoneX(
      {
        top: height - 40,
        bottom: hp("40%")
      },
      {
        ...Platform.select({
          ios: { top: height - 80, bottom: hp("26%") },
          android: { top: height - 80, bottom: hp("20%") }
        })
      }
    )
  },
  draggableRangeWallet: {
    ...ifIphoneX(
      {
        top: height - 40,
        bottom: hp("40%")
      },
      {
        ...Platform.select({
          ios: { top: height - 30, bottom: height / 3.5 },
          android: { top: height - 35, bottom: hp("20%") }
        })
      }
    )
  },
  draggableRangeDashboard: {
    ...ifIphoneX(
      {
        width,
        height,
        // justifyContent: 'center',
        alignItems: "center",
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
        // top: 130,
      },
      {
        ...Platform.select({
          ios: {
            width,
            height,
            // justifyContent: 'center',
            alignItems: "center",
            backgroundColor: "#fff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            top: 20
          },
          android: {
            width,
            height,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            top: 20
          }
        })
      }
    )
  },

  mtIphoneX: {
    ...ifIphoneX(
      {
        paddingTop: hp("5%"),
        paddingBottom: hp("3%")
      },
      {
        ...Platform.select({
          ios: {
            paddingTop: 30,
            paddingBottom: 10
          },
          android: {
            paddingTop: 70,
            paddingBottom: 30
          }
        })
      }
    )
  },
  mtAndroid: {
    ...ifIphoneX(
      {
        paddingTop: hp("5%"),
        paddingBottom: hp("3%")
      },
      {
        ...Platform.select({
          ios: {
            paddingTop: 30,
            paddingBottom: 10
          },
          android: {
            paddingTop: 70,
            paddingBottom: 30,
            backgroundColor: "#fafafa"
          }
        })
      }
    )
  },
  viewMbSliding1: {
    marginBottom: 32,
    marginTop: 20
  },
  viewMbSliding2: {
    marginBottom: 24
  },
  viewMbSliding3: {
    marginBottom: 24,
    paddingHorizontal: 20,
    alignContent: "center"
  },
  viewMbSliding4: {
    alignSelf: "stretch",
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  viewMbSliding5: {
    alignSelf: "stretch",
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    top: -10
  },
  containerSub: {
    alignItems: "center",
    backgroundColor: "#fff",
    // backgroundColor: 'rgba(0, 0, 0, 0.4)',
    height: "100%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
    // paddingTop: 16,
  },
  // FaqAll
  viewMono1: {
    ...ifIphoneX(
      {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: hp("75%")
      },
      {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: hp("53%")
      }
    )
  },

  numbersFaq: {
    ...Platform.select({
      ios: {
        color: "#313131",
        fontSize: 17,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 5
      },
      android: {
        color: "#313131",
        fontSize: 17,
        fontWeight: "bold",
        marginTop: 5,
        marginBottom: 5,
        textTransform: "capitalize"
      }
    })
  },
  h1TextBuy1: {
    ...ifIphoneX(
      {
        marginTop: 15,
        color: "#fff",
        fontSize: 36,
        fontWeight: "bold"
      },
      {
        ...Platform.select({
          ios: {
            marginTop: 10,
            color: "#fff",
            fontSize: 28,
            fontWeight: "bold"
          },
          android: {
            // marginTop: 10,
            color: "#fff",
            fontSize: 24,
            fontWeight: "bold"
          }
        })
      }
    )
  },
  viewPt: {
    paddingTop: 10
  },
  listitemHeight: {
    height: 60
  },
  rightIconHeight: {
    height: 52
  },
  heightListItem: {
    height: 60
  },
  // InviteFriend
  line: {
    borderBottomWidth: 0.5,
    left: 62,
    top: 10,
    borderBottomColor: "#E7E8F1",
    marginBottom: 10
  },
  linePicker: {
    borderBottomWidth: 0.5,
    left: 62,
    borderBottomColor: "#E7E8F1"
  },
  headerPicker: {
    ...ifIphoneX(
      {
        height: 100
      },
      {}
    )
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingLeft: 22,
    paddingTop: 10
  },
  iconStyle: {
    color: "rgba(34,34,34,0.30)",
    fontSize: 20,
    top: 8
  },
  iconStyleArrow: {
    color: "rgba(34,34,34,0.30)",
    fontSize: 20,
    top: 3
  },
  containerAlignLeft: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    alignItems: "flex-start"
  },
  containerAlignLeft1: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "flex-start"
  },
  h2AlignLeft: {
    ...ifIphoneX(
      {
        fontSize: 26,
        color: "#313131",
        fontWeight: "bold"
      },
      {
        fontSize: 20,
        color: "#313131",
        fontWeight: "bold"
      }
    )
  },
  h3AlignLeft: {
    fontSize: 15,
    color: "#313131",
    marginTop: 16
  },
  gradientBtnMargin: {
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  viewGradientBtn: {
    ...ifIphoneX(
      {
        flex: 1,
        alignItems: "center",
        width: "100%",
        marginTop: "15%"
      },
      {
        flex: 1,
        alignItems: "center",
        width: "100%"
      }
    )
  },
  viewGradientBtnInvite: {
    ...ifIphoneX(
      {
        flex: 1,
        alignItems: "center",
        width: "100%"
        // marginTop: '-30%',
      },
      {
        flex: 1,
        alignItems: "center",
        width: "100%"
      }
    )
  },

  viewPadding: {
    padding: 20
  },
  viewPadding1: {
    ...ifIphoneX(
      {
        paddingHorizontal: 20
        // marginTop: '-30%',
      },
      {
        paddingHorizontal: 20
        // marginTop: 0,
      }
    )
  },

  // InviteFriendSend
  viewFlexPt: {
    flex: 1,
    paddingTop: 20
  },
  constName: {
    ...ifIphoneX(
      {
        color: "#fff",
        fontSize: 36,
        fontWeight: "bold"
      },
      {
        ...Platform.select({
          ios: {
            color: "#fff",
            fontSize: 28,
            fontWeight: "bold"
          },
          android: {
            color: "#fff",
            fontSize: 24,
            fontWeight: "bold"
          }
        })
      }
    )
  },
  // InvoiceLevel
  sliding: {
    zIndex: 2
  },
  viewBuyFront1: {
    flex: 1,
    backgroundColor: "#FDFDFD",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "40%",
    zIndex: 1
  },
  viewBuyBack1: {
    ...Platform.select({
      ios: {
        flex: 1,
        backgroundColor: "rgba(253,253,253,0.25)",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "55%",
        zIndex: 0
      },
      android: {
        flex: 1,
        backgroundColor: "rgba(253,253,253,0.25)",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "60%",
        zIndex: 0
      }
    })
  },
  container1: {
    height: "100%"
  },
  textButtonPr: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    paddingRight: 0
  },
  gradientBtn: {
    paddingLeft: 20,
    paddingRight: 20,
    top: -20
  },
  gradientBtnInvoice: {
    ...ifIphoneX(
      {
        paddingLeft: 20,
        paddingRight: 20,
        top: -80
      },
      {
        paddingLeft: 20,
        paddingRight: 20,
        top: -20
      }
    )
  },
  // InvoiceLevelEmail
  viewBuyBack2: {
    ...ifIphoneX(
      {
        flex: 1,
        backgroundColor: "rgba(253,253,253,0.25)",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "45%",
        zIndex: 0
      },
      {
        flex: 1,
        backgroundColor: "rgba(253,253,253,0.25)",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "40%",
        zIndex: 0
      }
    )
  },
  inputStyle2: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    paddingLeft: 0
  },
  viewTextCrypto: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20
  },
  gradientBtn2: {
    marginVertical: 15,
    paddingLeft: 20,
    paddingRight: 20
  },
  gradientBtnTransparent: {
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderColor: "#fff",

    borderWidth: 1.5,
    borderRadius: 28
  },
  gradientBtnTransparentColor: {
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderColor: "#fff",
    borderWidth: 1.5,
    borderRadius: 28,
    backgroundColor: "rgba(225,225,225,0.4)"
  },
  btnClose: {
    // marginVertical: 30,
    paddingLeft: 20,
    paddingRight: 20
  },
  btnCloseQr: {
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  btnTextClose: {
    color: "#009EFD",
    fontSize: 18,
    marginBottom: 10
  },
  textBtnModal: {
    marginTop: "4%",
    color: "rgba(255,255,255,0.80)",
    fontSize: 14,
    fontWeight: "200"
  },
  viewBuyFront4: {
    ...ifIphoneX(
      {
        flex: 1,
        backgroundColor: "#FDFDFD",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "30%",
        zIndex: 1
      },
      {
        flex: 1,
        backgroundColor: "#FDFDFD",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "18%",
        zIndex: 1
      }
    )
  },
  touchableOpacityWidth: {
    top: 10,
    left: 2
  },
  // LoginInPassword
  containerCenter: {
    flex: 1,
    alignItems: "center"
  },
  containerFlexStart: {
    ...ifIphoneX(
      {
        flex: 1,
        alignItems: "center",
        paddingTop: hp("10%")
      },
      {
        ...Platform.select({
          ios: { flex: 1, alignItems: "center", paddingTop: "5%" },
          android: { flex: 1, alignItems: "center", paddingTop: "5%" }
        })
      }
    )
  },
  headerBlockArrow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "flex-start"
  },
  viewLogin: {
    position: "absolute",
    left: 0,
    right: 0,
    height: "100%",
    // backgroundColor: 'rgba(253,253,253,100)',
    backgroundColor: "#fff"
  },
  textH1Mt: {
    fontSize: 14,
    color: "rgba(42,42,42,100)",
    marginTop: 57,
    width: 245,
    textAlign: "center"
  },
  card: {
    ...Platform.select({
      ios: {
        width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 5,
        marginTop: 37,
        backgroundColor: "transparent",
        borderColor: "transparent"
      },
      android: {
        width: "90%",
        paddingHorizontal: 20,
        paddingVertical: 5,
        marginTop: 37,
        backgroundColor: "#fff",
        borderColor: "#fff",
        borderRadius: 7,
        shadowColor: "rgba(207,207,207,0.5)",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.8,
        shadowRadius: 2
      }
    })
  },
  cardItem: {
    ...Platform.select({
      ios: {
        backgroundColor: "rgba(253,253,253,100)",
        borderRadius: 5,
        shadowColor: "rgba(207,207,207,0.5)",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.8,
        shadowRadius: 2
      },
      android: {}
    })
  },
  iconTop: {
    color: "rgba(34,34,34,0.30)",
    // top: 2,
    width: 25
  },
  iconTopLeft: {
    color: "rgba(34,34,34,0.30)",
    // top: 2,
    left: 3,
    width: 25
  },
  iconTopError: {
    top: 2
  },
  inputSize: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold"
    // paddingLeft: 15,
  },
  errorSend: {
    fontSize: 12,
    color: "#ff9999"
  },
  error: {
    fontSize: 14,
    color: "red",
    top: 2
  },
  mgTopInput: {
    ...Platform.select({
      ios: { marginTop: "none" },
      android: { top: 20 }
    })
  },
  marginBtn: {
    // flex: 1,
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    marginTop: 20
  },
  textErrorField: {
    marginTop: 3,
    fontSize: 14,
    color: "red"
  },
  gradientBtnPh: {
    paddingHorizontal: 0
  },
  gradientBtnBorder: {
    paddingHorizontal: 0,
    borderWidth: 1,
    borderColor: "#9d41eb",
    maxWidth: "80%",
    borderRadius: 10
  },
  gradientBtnPhMargin: {
    paddingHorizontal: 0,
    marginTop: 20
  },
  textLoginStyle: {
    fontSize: 16,
    color: "#fff",
    marginTop: 40,
    width: 245,
    textAlign: "center"
  },
  // MailEdit
  arrowHeaderLeft1: {
    paddingLeft: 5,
    width: 100
  },
  btnHeaderRight: {
    paddingRight: 5,
    marginTop: 3,
    width: 100,
    justifyContent: "flex-end"
  },
  textBtnHeader: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  phItem: {
    paddingHorizontal: 20
  },
  textInputMail: {
    fontSize: 14,
    paddingLeft: 10
  },
  textInputPhone: {
    ...Platform.select({
      ios: {
        fontSize: 14,
        position: "absolute",
        left: 100,
        top: -3,
        width: "100%"
      },
      android: {
        fontSize: 16,
        position: "absolute",
        left: 80,
        // top: -3,
        width: "100%"
      }
    })
  },
  pickerWidthPhone: {
    ...Platform.select({
      ios: { width: 70 },
      android: { width: "110%", color: "rgba(42,42,42,0.70)" }
    })
  },
  // PasswordRecover
  containerCenter1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  imgSize: {
    width: 80,
    height: 94
  },
  textStyleImg: {
    fontSize: 27,
    color: "rgba(34,34,34,100)",
    fontWeight: "bold",
    marginTop: 40
  },
  textSmallStyleImg: {
    fontSize: 16,
    color: "rgba(34,34,34,100)",
    textAlign: "center",
    width: 229,
    marginTop: 40,
    lineHeight: 22
  },
  textBold: {
    fontWeight: "bold"
  },
  gradientBtnMt: {
    marginTop: 60,
    paddingLeft: 20,
    paddingRight: 20
  },
  // Settings
  constMail: {
    color: "#313131",
    fontSize: 17
  },
  constMail1: {
    color: "rgba(49,49,49,100)",
    fontSize: 17
  },
  numbersFaq1: {
    color: "rgba(49,49,49,100)",
    fontSize: 17,
    fontWeight: "bold"
  },
  colorIcon: {
    color: "rgba(34,34,34,0.30)"
  },
  supportIcon: {
    ...Platform.select({
      ios: { color: "rgba(34,34,34,0.30)", marginTop: 5 },
      android: { color: "rgba(34,34,34,0.30)" }
    })
  },
  transparentIcon: {
    color: "transparent"
  },
  pickerLeft: {
    left: -15
  },
  pickerLeft1: {
    ...Platform.select({
      ios: { left: -15, top: 5 },
      android: { left: -8, top: 5 }
    })
  },
  pickerEnglish: {
    ...Platform.select({
      ios: {},
      android: { color: "black", fontWeight: "bold", width: "110%" }
    })
  },
  // SignUp
  textH1Sign: {
    fontSize: 27,
    color: "#32383E",
    fontWeight: "bold",
    marginTop: 25
  },
  textH1Seed: {
    ...ifIphoneX(
      {
        fontSize: 27,
        color: "#fff",
        fontWeight: "bold",
        marginTop: 25
      },
      {
        ...Platform.select({
          ios: {
            fontSize: 20,
            color: "#fff",
            fontWeight: "bold",
            marginTop: 15
          },
          android: {
            fontSize: 20,
            color: "#fff",
            fontWeight: "bold",
            marginTop: 15
          }
        })
      }
    )
  },
  card1: {
    ...Platform.select({
      ios: {
        width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 5,
        marginTop: 25,
        backgroundColor: "transparent",
        borderColor: "transparent"
      },
      android: {
        width: "90%",
        paddingHorizontal: 20,
        paddingVertical: 5,
        marginTop: 25,
        backgroundColor: "transparent",
        borderColor: "transparent"
      }
    })
  },
  cardItem1: {
    ...Platform.select({
      ios: {
        backgroundColor: "#fff",
        borderRadius: 5,
        shadowColor: "rgba(207,207,207,0.5)",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.8,
        shadowRadius: 2
      },
      android: {}
    })
  },
  cardItemSeed: {
    ...Platform.select({
      ios: {
        backgroundColor: "rgba(157, 65, 235, 0.2)",
        borderRadius: 10
        // shadowColor: "rgba(207,207,207,0.5)",
        // shadowOffset: { width: 0, height: -1 },
        // shadowOpacity: 0.8,
        // shadowRadius: 2
      },
      android: { backgroundColor: "rgba(157, 65, 235, 0.2)", borderRadius: 10 }
    })
  },
  // SignUpPassword
  arrowIconBlack: {
    fontSize: 30,
    color: "#32383E",
    fontWeight: "bold"
  },
  arrowIcon: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold"
  },
  textSmallSign: {
    fontSize: 14,
    color: "rgba(34,34,34,100)",
    marginTop: 10,
    width: 245,
    textAlign: "center"
  },
  cardItem2: {
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "rgba(207,207,207,0.5)",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.8,
    shadowRadius: 2
    // height: 180,
  },
  textCard: {
    fontSize: 14,
    color: "#fff",
    marginTop: 15,
    // width: 250,
    width: "80%",
    // height: '100%',
    textAlign: "center"
  },
  textCardLine: {
    fontSize: 14,
    color: "#fff",
    textDecorationLine: "underline"
  },
  textTerms: {
    fontSize: 12,
    color: "#009EFD"
  },
  viewBlockCheckmark: {
    marginTop: 21,
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 30
  },
  styleIconCheckmark: {
    color: "#74EBEE",
    fontSize: 36,
    marginTop: -10
    // position: 'absolute',
  },
  textCheckmark: {
    fontSize: 12,
    color: "rgba(42,42,42,0.50)",
    textAlign: "left",
    marginLeft: 10
  },
  // Support
  iconLeftBottom: {
    color: "rgba(34,34,34,0.30)",
    bottom: 5
  },
  viewRow: {
    flexDirection: "row"
  },
  viewRow1: {
    flexDirection: "row",
    marginTop: 20
  },
  textSocialBtn: {
    color: "#313131",
    fontSize: 17,
    paddingLeft: 10
  },
  viewBlockSocialIconLeft: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    width: "auto"
  },
  viewBlockSocialIconRight: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    width: "auto"
  },
  // WithdrawLevel
  viewWithdrawFront: {
    ...ifIphoneX(
      {
        flex: 1,
        backgroundColor: "#FDFDFD",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "30%",
        zIndex: 1
      },
      {
        flex: 1,
        backgroundColor: "#FDFDFD",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "15%",
        zIndex: 1
      }
    )
  },

  viewWithdrawBack: {
    ...ifIphoneX(
      {
        flex: 1,
        backgroundColor: "rgba(253,253,253,0.25)",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "45%",
        zIndex: 0
      },
      {
        ...Platform.select({
          ios: {
            flex: 1,
            backgroundColor: "rgba(253,253,253,0.25)",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "35%",
            zIndex: 0
          },
          android: {
            flex: 1,
            backgroundColor: "rgba(253,253,253,0.25)",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "35%",
            zIndex: 0
          }
        })
      }
    )
  },

  bodyBlock1: {
    marginTop: 15,
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20
  },
  iconPadding: {
    color: "#fff",
    // paddingRight: 0,
    marginRight: 0
  },
  // Wallets
  amountView: {
    fontSize: 18,
    // fontWeight: 'bold',
    // color: 'rgba(57,57,57,0.80)',
    color: "#000"
  },
  heightListItem1: {
    height: 90
  },
  // VerificationCode
  textH1Mt2: {
    fontSize: 14,
    color: "rgba(42,42,42,100)",
    marginTop: 45,
    width: 245,
    textAlign: "center"
  },
  textCard2: {
    fontSize: 14,
    color: "rgba(34,34,34,0.50)",
    marginTop: 40,
    width: 245,
    textAlign: "center"
  },
  // VerificationPhone
  inputSize2: {
    fontSize: 14,
    left: -50,
    top: 0
  },
  // VerificationSettings
  gradientBtnMt2: {
    marginTop: 130,
    paddingLeft: 20,
    paddingRight: 20
  },
  // WalletRub
  totalBalance: {
    ...ifIphoneX(
      {
        marginTop: 10,
        color: "#fff",
        fontSize: 40,
        fontWeight: "bold"
      },
      {
        ...Platform.select({
          ios: {
            marginTop: 5,
            color: "#fff",
            fontSize: 30,
            fontWeight: "bold"
          },
          android: {
            marginTop: 5,
            color: "#fff",
            fontSize: 30,
            fontWeight: "bold"
          }
        })
      }
    )
  },

  nameToken: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "200"
  },
  conversionToken: {
    marginLeft: 20,
    marginTop: 5,
    color: "rgba(255,255,255,0.80)",
    fontSize: 16,
    fontWeight: "300"
  },
  iconTouchable: {
    color: "#fff"
    // top: 3,
  },
  iconTouchableWhite: {
    // color: "#9d41eb",
    color: "#353030",
    // fontSize: 46,
    fontSize: 40,
    padding: 2,
    top: 2
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  blockReactangle: {
    marginBottom: 10,
    marginTop: 20,
    alignItems: "center"
  },
  bodyBlockWallet: {
    marginTop: "5%"
    // bottom: height / 12
  },
  bodyBlockTitle: {
    paddingVertical: "2%"
    // marginVertical: "2%"
    // bottom: height / 12
  },
  bodyBlock3: {
    // alignItems: 'flex-start',
    alignSelf: "center"
  },
  bodyBalance: {
    alignSelf: "center"
  },
  viewTouchablesWallet: {
    ...ifIphoneX(
      {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: "15%",
        // bottom: height / 3,
        paddingHorizontal: 5
      },
      {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: hp("5%"),
        // bottom: height / 2,

        paddingHorizontal: 5
      }
    )
  },
  viewTouchables: {
    ...ifIphoneX(
      {
        flexDirection: "row",
        justifyContent: "space-around",
        // marginBottom: '0%',
        position: "absolute",
        // bottom: hp('45%'),
        bottom: height / 2,
        width: width,
        paddingHorizontal: 5
        // bottom: "5%",
      },

      {
        ...Platform.select({
          ios: {
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: "5%",
            paddingHorizontal: 5
          },
          android: {
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: "5%",
            paddingHorizontal: 5
          }
        })
      }
    )
  },

  touchablesWhite: {
    ...ifIphoneX(
      {
        alignItems: "center",
        justifyContent: "center",
        width: 56,
        height: 56,
        backgroundColor: "#fff",
        borderRadius: 30
      },
      {
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 50
      }
    )
  },
  touchables: {
    ...ifIphoneX(
      {
        alignItems: "center",
        justifyContent: "center",
        width: 56,
        height: 56,
        backgroundColor: "#fff",
        borderRadius: 30
      },
      {
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 50
      }
    )
  },
  textTouchable: {
    marginTop: 10,
    color: "#fff"
  },
  headerLayoutStyle1: {
    width,
    height,
    top: "20%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  containerSub1: {
    backgroundColor: "#fff",
    height: "100%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
    // paddingTop: 16,
  },
  buttonContainer: {
    width: 115,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.15)"
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    padding: 15,
    width: 115
  },
  nameTokenSwiper1: {
    ...ifIphoneX(
      {
        color: "#fff",
        fontSize: 20,
        // fontSize: hp('2%'),
        fontWeight: "300",
        // marginLeft: 20,
        marginTop: 20
      },
      {
        ...Platform.select({
          ios: {
            color: "#fff",
            fontSize: 17,
            fontWeight: "300"
            // marginLeft: 20,
          },
          android: {
            color: "#fff",
            fontSize: 17,
            fontWeight: "300",
            marginTop: 20
            // marginLeft: 20,
          }
        })
      }
    )
  },
  titleQr: {
    ...ifIphoneX(
      {
        color: "#fff",
        fontSize: 20,
        fontWeight: "300",
        marginVertical: 20
      },
      {
        color: "#fff",
        fontSize: 17,
        fontWeight: "300",
        marginVertical: 10
      }
    )
  },
  nameTokenWallet: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20
  },
  // WalletHistory
  constName1: {
    fontSize: 16,
    fontWeight: "bold",
    color: "rgba(57,57,57,100)"
  },
  constDate: {
    fontSize: 13,
    // fontWeight: 'bold',
    // color: 'rgba(0,0,0,0.50)',
    color: "#707070"
  },
  constCoins: {
    fontSize: 17,
    // fontWeight: 'bold',
    color: "rgba(82, 220, 144,100)"
    // paddingRight: 20,
  },
  constCoinsOrange: {
    fontSize: 17,
    // fontWeight: 'bold',
    color: "#F76B1C"
  },
  historyCoins: {
    fontSize: 17,
    fontWeight: "bold",
    color: "black"
  },
  constCoinsExclude: {
    fontSize: 17,
    // fontWeight: 'bold',
    color: "rgba(255, 93, 113,100)"
    // paddingRight: 20,
  },
  txtSizeHistory: {
    fontSize: 17,
    fontWeight: "500"
  },
  titleHistory: {
    fontSize: 17,
    fontWeight: "500",
    alignSelf: "center",
    color: "#707070",
    height: 20
  },

  modalAmountStyle: {
    marginTop: 10,
    marginLeft: 20,
    fontSize: 22,
    fontWeight: "bold",
    color: "rgba(82, 220, 144,100)"
  },
  modalAmountStyleExclude: {
    marginTop: 10,
    marginLeft: 20,
    fontSize: 22,
    fontWeight: "bold",
    color: "rgba(255, 93, 113,100)"
  },
  viewList: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10
  },
  viewBtnTransaction: {
    flexDirection: "row",
    alignItems: "flex-start",
    top: -10
    // marginTop: -10,
  },
  viewBtnMoreTransaction: {
    flexDirection: "row",
    alignItems: "flex-start"
    // marginTop: -10,
  },
  btnAccept: {
    color: "rgba(5, 157, 247, 100)",
    fontSize: 16,
    fontWeight: "bold"
  },
  btnRefuse: {
    color: "rgba(57,57,57,0.60)",
    fontSize: 16,
    paddingLeft: 5,
    fontWeight: "bold"
  },
  leftBtn: {
    marginLeft: -18
  },
  arrowDropup: {
    color: "rgba(82, 220, 144,100)"
  },
  arrowDropupTxn: {
    top: -17,
    color: "rgba(82, 220, 144,100)"
  },
  arrowDropdown: {
    color: "rgba(255, 93, 113,100)"
  },
  // WalletHistoryClean
  viewContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  textContainer: {
    fontSize: 18,
    color: "#313131",
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: "center"
  },
  textSmContainer: {
    fontSize: 17,
    color: "rgba(49,49,49,0.60)",
    paddingLeft: 40,
    paddingRight: 40,
    textAlign: "center",
    marginTop: 10
  },
  btnTextContainer: {
    color: "#059DF7",
    fontWeight: "bold"
  },
  // CheckBoxDate
  listWidth: {
    width: "100%"
  },
  listitemText: {
    color: "#313131",
    fontSize: 16
  },
  iconPicker: {
    marginLeft: 10,
    top: 12
  },
  stylePicker: {
    height: 40
  },
  // CryptoAddress
  itemInputAddress: {
    height: 40,
    borderBottomColor: "rgba(255,255,255,0.60)"
  },
  inputAddress: {
    marginTop: "2%",
    color: "rgba(255,255,255,100)",
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 0
  },
  iconAddress: {
    marginRight: 10,
    marginBottom: 0,
    color: "rgba(255,255,255,0.80)"
  },
  // FeedbackModal
  gradientBtnModal: {
    marginTop: 0,
    paddingLeft: 20,
    paddingRight: 20
  },
  iconModal: {
    color: "rgba(34,34,34,0.30)",
    bottom: 5
  },
  textModalRender: {
    color: "rgba(34,34,34,100)",
    fontSize: 27,
    textAlign: "center",
    paddingHorizontal: 40,
    paddingVertical: 10,
    fontWeight: "bold"
  },
  textSnackBar: {
    color: "rgba(34,34,34,100)",
    fontSize: 22,
    textAlign: "center",
    paddingHorizontal: 40,
    paddingVertical: 10
    // fontWeight: 'bold',
  },
  textModalRender2: {
    color: "#222222",
    fontSize: 17,
    textAlign: "center",
    paddingTop: 20,
    paddingHorizontal: 80
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40
  },
  containerModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  containerModalTransactions: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  // InvoiceSuccessModal
  gradientBtnPadding: {
    paddingLeft: 20,
    paddingRight: 20
  },
  imgSizeModal: {
    width: 73,
    height: 73
  },
  textSended: {
    color: "#009EFD",
    fontSize: 26,
    textAlign: "center",
    paddingTop: 10,
    paddingBottom: 5,
    fontWeight: "bold"
  },
  textSendedCoin: {
    color: "#009EFD",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold"
  },
  textToName: {
    color: "#515151",
    fontSize: 13,
    textAlign: "center"
  },
  textModalRender3: {
    color: "#222222",
    fontSize: 17,
    textAlign: "center",
    paddingTop: 30,
    paddingHorizontal: 80
  },
  modalContent2: {
    backgroundColor: "white",
    borderRadius: 16,
    // height: '70%',
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40
  },
  modalTransactions: {
    ...ifIphoneX(
      {
        backgroundColor: "#fff",
        height: hp("35%"),
        position: "absolute",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        width: "100%"
      },
      {
        ...Platform.select({
          ios: {
            backgroundColor: "#fff",
            height: hp("40%"),
            position: "absolute",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            width: "100%"
          },
          android: {
            backgroundColor: "#fff",
            height: hp("40%"),
            position: "absolute",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            width: "100%"
          }
        })
      }
    )
  },
  // OperationSuccessModal
  imgSizeModal2: {
    width: 76,
    height: 73
  },
  textValueModal: {
    color: "#20D64D",
    fontSize: 26,
    textAlign: "center",
    paddingTop: 10,
    paddingBottom: 5,
    fontWeight: "bold"
  },
  textCoinModal: {
    color: "#20D64D",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold"
  },
  // TransferSuccessModal
  textValueModalMinus: {
    color: "#FF5D71",
    fontSize: 26,
    textAlign: "center",
    paddingTop: 10,
    paddingBottom: 5,
    fontWeight: "bold"
  },
  textCoinModal2: {
    color: "#FF5D71",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold"
  },
  // Filters
  gradientBtn3: {
    marginVertical: 30,
    paddingLeft: 10,
    paddingRight: 25
  },
  iconFilter: {
    ...ifIphoneX(
      { color: "#fff", fontSize: 20, right: 0, top: 5 },
      {
        ...Platform.select({
          ios: {
            color: "#fff",
            fontSize: 20,
            top: 5,
            left: 0
          },
          android: {
            color: "#fff",
            fontSize: 20,
            top: 5,
            left: 0
          }
        })
      }
    )
  },
  iconRefresh: {
    color: "#fff",
    fontSize: 20,
    top: 5
  },
  textFilter: {
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 10,
    color: "#071019",
    fontSize: 36,
    fontWeight: "bold"
  },
  textCheckFilters: {
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 10,
    color: "#071019",
    fontSize: 20,
    fontWeight: "bold"
  },
  modalContent3: {
    backgroundColor: "white",
    borderRadius: 16,
    height: "80%",
    paddingVertical: 30
  },
  modalContentBtn: {
    justifyContent: "center",
    alignItems: "center"
  },
  // Header
  viewBalance: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    alignContent: "flex-end",
    marginTop: 20
  },
  textCurrency: {
    color: "#fff",
    fontSize: 28
  },
  containerHeader: {
    zIndex: 1,
    backgroundColor: "rgba(253, 253, 253, 0.25)",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height / 4.8
  },
  header1: {
    paddingTop: 20,
    alignItems: "center"
  },
  textBalanceHeader: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center"
  },
  // LogOutModal
  textCancel: {
    color: "rgba(5, 157, 247,100)",
    fontSize: 17,
    fontWeight: "bold"
  },
  iconLogout: {
    marginVertical: 25,
    paddingLeft: 6
  },
  colorBtnLogout: {
    color: "#FF5D71"
  },
  textColorBtn: {
    color: "#FF5D71",
    fontSize: 17,
    fontWeight: "bold",
    paddingLeft: 15
  },
  // PasswordInput
  colorIconLock: {
    color: "#019FFD",
    top: 10,
    fontSize: 25,
    position: "absolute"
  },
  passwordInput: {
    fontSize: 14,
    marginLeft: 25,
    borderBottomColor: "transparent"
  },
  // PickerChooseDate
  containerPicker: {
    backgroundColor: "transparent"
  },
  placeholderText: {
    color: "#313131"
  },
  textPicker: {
    fontSize: 16,
    color: "#313131",
    paddingTop: 13
  },
  // PickerEnglishSignUp
  paddingPicker: {
    paddingVertical: 5
  },
  leftPickerSignUp: {
    // color: 'rgba(42,42,42,0.70)',
    color: "#000",
    fontSize: 14,
    left: -1,
    width: "85%"
  },
  placeholderPicker: {
    color: "rgba(42,42,42,0.70)",
    fontSize: 14,
    left: -1
  },
  placeHolderSeed: {
    color: "rgba(42,42,42,0.70)",
    fontSize: 14
  },
  iconPickerSignUp: {
    color: "rgba(42,42,42,0.70)",
    fontSize: 17,
    top: 2
  },
  // PickerInvoice
  textPickerInvoice: {
    color: "#fff",
    fontWeight: "bold",
    top: 4
  },
  pickerMargin: {
    ...Platform.select({
      ios: {},
      android: { color: "#fff", fontWeight: "bold", marginLeft: -5 }
    })
  },
  pickerToGet: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: -5
  },
  pickerAndroid: {
    ...Platform.select({
      ios: {},
      android: { fontWeight: "bold", marginLeft: -5 }
    })
  },
  // PickerPhone
  leftPickerSignUp2: {
    color: "#000",
    fontSize: 14,
    left: -1
    // width: 70,
  },
  placeholderTextPicker: {
    color: "rgba(42,42,42,0.50)",
    fontSize: 14,
    left: -1
  },
  iconPickerPhone: {
    ...Platform.select({
      ios: { color: "rgba(42,42,42,0.50)", fontSize: 17, top: 1, left: -25 },
      android: {
        color: "rgba(42,42,42,0.50)",
        fontSize: 17,
        top: 1,
        left: -25
      }
    })
  },
  // QuestionAnswer1
  h3AlignLeft1: {
    fontSize: 15,
    color: "#313131"
  },
  // ReferralLink
  itemRef: {
    height: 40,
    borderBottomColor: "rgba(49,49,49,0.60)"
  },
  inputRef: {
    color: "#313131",
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 0
  },
  iconRef: {
    marginRight: 10,
    marginBottom: 0,
    color: "rgba(49,49,49,0.60)"
  },
  // Spinner
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around"
    // backgroundColor: '#00000010',
  },
  activityIndicatorWrapper: {
    backgroundColor: "#00000030",
    height: 100,
    width: 100,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around"
  },
  // Swiper
  activeDot: {
    ...ifIphoneX(
      {
        // backgroundColor: '#fff',
        // bottom: hp('32%'),
        backgroundColor: "#fff",
        // bottom: hp('40%'),
        bottom: height / 2.4
      },
      {
        ...Platform.select({
          ios: { backgroundColor: "#fff", bottom: hp("28%") },
          android: { backgroundColor: "#fff", bottom: hp("22%") }
        })
      }
    )
  },

  dot: {
    ...ifIphoneX(
      {
        // backgroundColor: 'rgba(253, 253, 253, 0.50)',
        // bottom: hp('32%'),
        backgroundColor: "rgba(253, 253, 253, 0.50)",
        // bottom: hp('40%'),
        bottom: height / 2.4
      },
      {
        ...Platform.select({
          ios: {
            backgroundColor: "rgba(253, 253, 253, 0.50)",
            bottom: hp("28%")
          },
          android: {
            backgroundColor: "rgba(253, 253, 253, 0.50)",
            bottom: hp("22%")
          }
        })
      }
    )
  },

  imgFrontBg: {
    position: "absolute",
    right: 0,
    top: "40%",
    right: "-10%"
  },
  nameTokenSwiper: {
    ...ifIphoneX(
      {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold"
      },
      {
        color: "#fff",
        fontSize: 17,
        fontWeight: "bold"
      }
    )
  },
  textTokenSwiper: {
    color: "#fff",
    fontSize: 26
  },
  btnTopSwiper: {
    ...ifIphoneX(
      {
        marginTop: 10
      },
      {
        marginTop: 10
      }
    )
  },
  textIconSwiper: {
    ...ifIphoneX(
      {
        color: "white",
        fontSize: 22,
        left: -15
      },
      {
        color: "white",
        fontSize: 18,
        left: -15
      }
    )
  },
  historyBtn: {
    ...ifIphoneX(
      {
        color: "#fff",
        fontSize: 18
      },
      {
        color: "#fff",
        fontSize: 14
      }
    )
  },
  styleBtnSwiper: {
    ...ifIphoneX(
      {
        paddingTop: 10,
        alignItems: "flex-start"
      },
      {
        paddingTop: 0,
        alignItems: "flex-start"
      }
    )
  },
  styleBtnSwiper1: {
    ...ifIphoneX(
      {
        alignItems: "flex-start",
        marginLeft: 20,
        marginTop: 25
      },
      {
        alignItems: "flex-start",
        marginLeft: 20,
        marginTop: 15
      }
    )
  },

  textBtnSwiper: {
    ...ifIphoneX(
      {
        fontWeight: "bold",
        fontSize: 20,
        color: "#fff"
      },
      {
        fontWeight: "bold",
        fontSize: 17,
        color: "#fff"
      }
    )
  },
  slide: {
    flex: 1
  },
  viewBodySwiper: {
    ...ifIphoneX(
      {
        // marginTop: height / 4.5,
        marginTop: hp("20%"),
        paddingLeft: 20,
        paddingTop: 20
      },
      {
        // marginTop: height / 5,
        marginTop: hp("20%"),
        paddingLeft: 20,
        paddingTop: 20
      }
    )
  },
  textBalanceSwiper: {
    ...ifIphoneX(
      {
        color: "#fff",
        fontSize: 36,
        fontWeight: "bold",
        paddingTop: 20
      },
      {
        color: "#fff",
        fontSize: 36,
        fontWeight: "bold",
        paddingTop: 10
      }
    )
  },
  textCryptoTo: {
    ...ifIphoneX(
      {
        color: "rgba(255,255,255,0.80)",
        fontSize: 16,
        paddingTop: 20
      },
      {
        color: "rgba(255,255,255,0.80)",
        fontSize: 13,
        paddingTop: 10
      }
    )
  },
  textCrypto: {
    color: "rgba(255,255,255,0.80)",
    fontSize: 16,
    paddingTop: 10
  },
  iconArrowForward: {
    color: "#fff",
    top: 2,
    left: 10
  },
  iconArrowForward1: {
    color: "#fff"
  },
  // Transfer
  iconSearch: {
    position: "absolute",
    top: 30,
    right: 40,
    fontSize: 24,
    color: "#000"
  },
  containerTransfer: {
    flex: 1,
    top: "10%"
  },
  searchInput: {
    margin: 20,
    paddingLeft: 20,
    paddingTop: 13,
    paddingBottom: 13,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: "#fff",
    fontSize: 16
  },
  viewMono2: {
    flex: 1,
    backgroundColor: "rgba(253, 253, 253, 100)",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "85%"
  },
  nameContact: {
    fontSize: 16,
    color: "rgba(49,49,49,0.75)"
  },
  infoContact: {
    fontSize: 17,
    color: "rgba(49,49,49,100)",
    fontWeight: "bold"
  },
  seperatorContact: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#313131"
  },
  scrollContact: {
    paddingTop: 15
  },
  mbXScroll: {
    ...ifIphoneX(
      {
        marginBottom: hp("10%")
      },
      {
        ...Platform.select({
          ios: { marginBottom: hp("10%") },
          android: { marginBottom: hp("10%") }
        })
      }
    )
  },
  // AddWallets
  btnHeaderRightLong: {
    paddingRight: 5,
    marginTop: 3,
    width: 120,
    justifyContent: "flex-end"
  },
  arrowHeaderLeftLong: {
    paddingLeft: 5,
    width: 120
  },
  heightListItem2: {
    height: 80
  },
  listPadding1: {
    paddingTop: 5
  },
  // Exchange
  viewBuyBack3: {
    flex: 1,
    backgroundColor: "rgba(253,253,253,0.25)",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "40%",
    zIndex: 0
  },
  viewBuyFront3: {
    ...ifIphoneX(
      {
        flex: 1,
        backgroundColor: "#FDFDFD",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "30%",
        zIndex: 1
      },
      {
        ...Platform.select({
          ios: {
            flex: 1,
            backgroundColor: "#FDFDFD",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "20%",
            zIndex: 1
          },
          android: {
            flex: 1,
            backgroundColor: "#FDFDFD",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "25%",
            zIndex: 1
          }
        })
      }
    )
  },

  textFrontBuy1: {
    fontSize: 20,
    color: "rgba(49,49,49,100)",
    marginTop: "3%"
  },
  // Deposit
  nameTokenSwiper3: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 10
  },
  viewMt1: {
    marginTop: 25
  },
  leftPickerMethod: {
    marginTop: "2%",
    color: "rgba(255,255,255,100)",
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 0
  },
  iconPickerMethod: {
    color: "rgba(255,255,255,100)",
    fontSize: 17,
    top: 6,
    left: -15
  },
  inputAddress1: {
    marginTop: "2%",
    color: "rgba(255,255,255,100)",
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 0
  },
  textFront: {
    marginTop: 0,
    color: "rgba(255,255,255,100)",
    fontSize: 14,
    fontWeight: "200"
  },
  rightBtnMore: {
    ...Platform.select({
      ios: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
      },
      android: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 20
      }
    })
  },
  iconBtnMore: {
    ...Platform.select({
      ios: { color: "rgba(57,57,57,100)", paddingRight: 10 },
      android: { color: "rgba(57,57,57,100)" }
    })
  },
  btnMore: {
    ...Platform.select({
      ios: {},
      android: { position: "absolute", right: 5 }
    })
  },
  modalHistory: {
    ...Platform.select({
      ios: { justifyContent: "flex-end", margin: 0 },
      android: { justifyContent: "flex-end", margin: 0 }
    })
  },

  textDate: {
    fontSize: 14,
    marginTop: 20,
    marginHorizontal: 20,
    color: "rgba(0,0,0,0.50)"
  },
  nameWallet: {
    fontSize: 14,
    marginTop: 20,
    marginHorizontal: 20,
    color: "rgba(0,0,0,0.70)",
    fontWeight: "bold"
  },
  textFrom: {
    fontSize: 16,
    marginTop: 20,
    marginHorizontal: 20,
    color: "rgba(0,0,0,0.70)"
  },
  iosViewNone: {
    ...Platform.select({
      ios: { display: "none" },
      android: {}
    })
  },
  androidViewNone: {
    ...Platform.select({
      ios: {},
      android: { display: "none" }
    })
  },
  containerCards: {
    flex: 1,
    justifyContent: "center"
    // alignItems: 'center',
  },
  cardWidth: {
    ...ifIphoneX(
      { width: width / 1.3 },
      {
        ...Platform.select({
          ios: { width: hp("50%") },
          android: { width: hp("50%") }
        })
      }
    )

    // width: 300,
    // width: hp('50%'),
  },
  cardContainer: {
    // paddingTop: 20,
  },
  face: {
    flex: 1,
    // backgroundColor: '#192a56',
    borderRadius: 10
  },
  back: {
    flex: 1,
    // backgroundColor: '#fbc531',
    borderRadius: 10
  },
  activeDotCards: {
    ...ifIphoneX(
      {
        backgroundColor: "#fff",
        // bottom: hp('40%'),
        bottom: height / 2.1
      },
      {
        ...Platform.select({
          ios: { backgroundColor: "#fff", bottom: hp("25%") },
          android: { backgroundColor: "#fff", bottom: hp("25%") }
        })
      }
    )
  },

  dotCards: {
    ...ifIphoneX(
      {
        backgroundColor: "rgba(253, 253, 253, 0.50)",
        // bottom: hp('40%'),
        bottom: height / 2.1
      },
      {
        ...Platform.select({
          ios: {
            backgroundColor: "rgba(253, 253, 253, 0.50)",
            bottom: hp("25%")
          },
          android: {
            backgroundColor: "rgba(253, 253, 253, 0.50)",
            bottom: hp("25%")
          }
        })
      }
    )
  },
  // slideCards: {
  //   flex: 1,
  //   paddingTop: '10%',
  // },
  // slide2: {
  //   flex: 1,
  //   paddingTop: 100,
  // },
  viewMonoCards: {
    ...ifIphoneX(
      {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        // height: hp('40%'),
        height: height / 2.2
      },
      {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: hp("27%")
      }
    )
  },
  linearGradientNew1: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
    borderRadius: 10
  },
  cardStyleCards: {
    ...ifIphoneX(
      {
        // height: 170,

        // height: hp('20%'),
        height: height / 4.8,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "black",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: {
          height: 20,
          width: 1
        }
      },
      {
        ...Platform.select({
          ios: {
            // height: 170,
            height: hp("27%"),
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "black",
            shadowOpacity: 0.2,
            shadowRadius: 10,
            shadowOffset: {
              height: 20,
              width: 1
            }
          },
          android: {
            // height: 170,
            height: hp("27%"),
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "black",
            shadowOpacity: 0.2,
            shadowRadius: 10,
            shadowOffset: {
              height: 20,
              width: 1
            }
          }
        })
      }
    )
  },
  alignItemsBtn: {
    alignItems: "center",
    width: "33%"
  },
  touchablesCards: {
    ...ifIphoneX(
      {
        alignItems: "center",
        justifyContent: "center",
        // width: 50,
        // height: 50,
        width: hp("6%"),
        height: hp("6%"),
        backgroundColor: "#292929",
        borderRadius: 50
      },
      {
        ...Platform.select({
          ios: {
            alignItems: "center",
            justifyContent: "center",
            width: 50,
            height: 50,
            backgroundColor: "#292929",
            borderRadius: 50
          },
          android: {
            alignItems: "center",
            justifyContent: "center",
            width: 50,
            height: 50,
            backgroundColor: "#292929",
            borderRadius: 50
          }
        })
      }
    )
  },
  touchablesCardsUsd: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor: "#1F1C2C",
    borderRadius: 50
  },
  styleStrip: {
    marginTop: 20,
    backgroundColor: "#4e4e4e",
    width: "100%",
    height: 46
  },
  txtCard: {
    color: "rgba(255, 255,255, 0.5)",
    fontSize: 15
  },
  secureNumber: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold"
  },
  rowAmountCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 15
  },
  amountCard: {
    color: "#fff",
    fontSize: 23
  },
  currencyCard: {
    color: "#fff",
    fontSize: 14
  },
  rowValueNumber: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingTop: 40,
    paddingLeft: 20
  },
  valueNumber: {
    color: "rgba(255, 255,255, 0.5)",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1.88
  },
  rowDate: {
    flexDirection: "row",
    justifyContent: "center",
    paddingLeft: 45,
    paddingTop: 5
  },
  rowImgCard: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 15,
    top: -10
  },
  imgCard: {
    width: 43,
    height: 26
  },
  rowSecureTxt: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 30,
    paddingRight: 50
  },
  secureTxt: {
    color: "rgba(255, 255,255, 0.5)",
    fontWeight: "bold",
    fontSize: 15
  },
  rowSecureNumber: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 55
  },
  flexColumn: {
    flexDirection: "column"
  },
  slideCards: {
    ...ifIphoneX(
      {
        flex: 1,
        // paddingTop: height / 7.8,
        paddingTop: "10%",
        top: -30
      },
      {
        ...Platform.select({
          ios: { flex: 1, paddingTop: "5%" },
          android: { flex: 1, paddingTop: "3%" }
        })
      }
    )
  },
  iconCardSettings: {
    color: "#fff",
    fontSize: 18
  },
  viewCardSettings: {
    ...ifIphoneX(
      {
        flex: 1,
        paddingTop: "10%",
        flexDirection: "row",
        justifyContent: "center"
      },
      {
        flex: 1,
        paddingTop: "5%",
        flexDirection: "row",
        justifyContent: "center"
      }
    )
  },
  faceCardSettings: {
    // flex: 1,
    borderRadius: 10,
    height: 170,
    backgroundColor: "transparent",
    // alignItems: 'center',
    // justifyContent: 'center',
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: {
      height: 20,
      width: 1
    },
    width: 300
  },
  viewMonoCardsParallax: {
    ...ifIphoneX(
      {
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        height: "50%",
        position: "absolute",
        width,
        // top: -20,
        bottom: 0
      },
      {
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        height: "40%",
        position: "absolute",
        width,
        // top: -20,
        bottom: 0
      }
    )
  },
  bodyBlockSettingsCards: {
    ...ifIphoneX(
      {
        // bottom: hp('65%'),
        paddingLeft: 20,
        paddingRight: 20,
        bottom: "55%"
        // top: 400
      },
      {
        // bottom: hp('68%'),
        paddingLeft: 20,
        paddingRight: 20,
        bottom: "45%"
      }
    )
  },
  colorIconCards: {
    color: "rgba(34,34,34,0.30)",
    paddingTop: 5
  },
  titleHeaderCards: {
    ...Platform.select({
      ios: { marginTop: 20, color: "#313131", fontSize: 17 },
      android: {
        marginTop: 20,
        color: "#313131",
        fontSize: 15
      }
    })
  },
  leftPickerCurrency: {
    marginTop: "2%",
    color: "#313131",
    fontSize: 17,
    fontWeight: "bold",
    paddingLeft: 0
  },
  iconPickerCurrency: {
    color: "#313131",
    fontSize: 17,
    top: 6,
    left: -15
  },
  viewChooseCrypto: {
    paddingHorizontal: 20,
    marginTop: 10
  },
  rowSwitch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center"
  },
  viewFrontCard: {
    flex: 1,
    backgroundColor: "#FDFDFD",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "20%",
    zIndex: 1
  },
  containerScreenAddCard: {
    ...ifIphoneX(
      { flex: 1, alignItems: "center", marginTop: "20%" },
      {
        ...Platform.select({
          ios: { flex: 1, alignItems: "center" },
          android: { flex: 1, alignItems: "center" }
        })
      }
    )
  },
  inputStyleCardNumber: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    paddingLeft: 0
  },
  textComing: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
    paddingBottom: "20%"
  },
  textTitleAddNewCard: {
    ...ifIphoneX(
      { color: "#fff", fontSize: 36, fontWeight: "bold", paddingBottom: "20%" },
      {
        ...Platform.select({
          ios: {
            color: "#fff",
            fontSize: 30,
            fontWeight: "bold",
            paddingBottom: "10%"
          },
          android: {
            color: "#fff",
            fontSize: 30,
            fontWeight: "bold",
            paddingBottom: "10%"
          }
        })
      }
    )
  },
  iconTitleAddNewCard: {
    fontSize: 150,
    color: "#fff"
  },
  gradientBtnAddNewCard: {
    ...ifIphoneX(
      { paddingHorizontal: 20, marginTop: 40 },
      {
        ...Platform.select({
          ios: { paddingHorizontal: 20, marginTop: 40 },
          android: { paddingHorizontal: 20, marginTop: 40 }
        })
      }
    )
  },
  textStylePickerCards: {
    fontWeight: "bold",
    color: "#fff"
  },
  colorWhite: {
    color: "#fff"
  },
  textStyleBtnSend: {
    fontSize: 18
  },
  viewBtnStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginVertical: 20
  },
  btnPayWallet: {
    ...Platform.select({
      ios: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "flex-end",
        width: "80%",
        backgroundColor: "#292929"
      },
      android: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "flex-end",
        width: "80%",
        backgroundColor: "#A6A6A6"
      }
    })
  },
  btnTxtPayWalletIosNone: {
    ...Platform.select({
      ios: { display: "none" },
      android: { fontWeight: "bold", color: "#fff", fontSize: 20 }
    })
  },
  btnImgPayWalletIos: {
    ...Platform.select({
      ios: { width: 46, height: 32 },
      android: { display: "none" }
    })
  },
  btnImgPayWalletAndroid: {
    ...Platform.select({
      ios: { display: "none" },
      android: { width: 88, height: 34 }
    })
  },
  btnTxtPayWalletAndroidNone: {
    ...ifIphoneX(
      { fontWeight: "bold", color: "#fff", fontSize: 20 },
      {
        ...Platform.select({
          ios: { fontWeight: "bold", color: "#fff", fontSize: 16 },
          android: { display: "none" }
        })
      }
    )
  },
  txtPaywalletAndroidNone: {
    ...ifIphoneX(
      { color: "#fff", fontSize: 20 },
      {
        ...Platform.select({
          ios: { color: "#fff", fontSize: 16 },
          android: { display: "none" }
        })
      }
    )
  },
  pickerCurrencyTop: {
    fontWeight: "bold",
    color: "#fff",
    marginLeft: -15
  },
  pickerItemStyle: {
    textAlign: "center",
    color: "#ff0000"
  },
  constNameCards: {
    ...ifIphoneX(
      { fontSize: 16, fontWeight: "bold", color: "rgba(57,57,57,100)" },
      {
        ...Platform.select({
          ios: {
            fontSize: 14,
            fontWeight: "bold",
            color: "rgba(57,57,57,100)"
          },
          android: {
            fontSize: 14,
            fontWeight: "bold",
            color: "rgba(57,57,57,100)"
          }
        })
      }
    )
  },
  constDateCards: {
    ...ifIphoneX(
      { fontSize: 13, fontWeight: "bold", color: "rgba(0,0,0,0.50)" },
      {
        ...Platform.select({
          ios: { fontSize: 12, fontWeight: "bold", color: "rgba(0,0,0,0.50)" },
          android: {
            fontSize: 12,
            fontWeight: "bold",
            color: "rgba(0,0,0,0.50)"
          }
        })
      }
    )
  },
  constCoinsCard: {
    ...ifIphoneX(
      {
        fontSize: 17,
        fontWeight: "bold",
        color: "rgba(82, 220, 144,100)",
        paddingRight: 20
      },
      {
        ...Platform.select({
          ios: {
            fontSize: 14,
            fontWeight: "bold",
            color: "rgba(82, 220, 144,100)",
            paddingRight: 20
          },
          android: {
            fontSize: 14,
            fontWeight: "bold",
            color: "rgba(82, 220, 144,100)",
            paddingRight: 20
          }
        })
      }
    )
  },
  constCoinsExcludeCard: {
    ...ifIphoneX(
      {
        fontSize: 17,
        fontWeight: "bold",
        color: "rgba(255, 93, 113,100)",
        paddingRight: 20
      },
      {
        ...Platform.select({
          ios: {
            fontSize: 14,
            fontWeight: "bold",
            color: "rgba(255, 93, 113,100)",
            paddingRight: 20
          },
          android: {
            fontSize: 14,
            fontWeight: "bold",
            color: "rgba(255, 93, 113,100)",
            paddingRight: 20
          }
        })
      }
    )
  },
  viewFrontCardStart: {
    ...ifIphoneX(
      {
        flex: 1,
        backgroundColor: "#FDFDFD",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: hp("30%"),
        zIndex: 1,
        alignItems: "center",
        justifyContent: "flex-start"
      },
      {
        ...Platform.select({
          ios: {
            flex: 1,
            backgroundColor: "#FDFDFD",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "25%",
            zIndex: 1,
            alignItems: "center",
            justifyContent: "flex-start"
          },
          android: {
            flex: 1,
            backgroundColor: "#FDFDFD",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "20%",
            zIndex: 1,
            alignItems: "center",
            justifyContent: "flex-start"
          }
        })
      }
    )
  },
  containerHeaderCard: {
    zIndex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0
  },
  containerSubCard: {
    // alignItems: 'center',
    backgroundColor: "#fff",
    height: "100%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
    // paddingTop: 16,
  },
  pickerAddCardIos: {
    ...ifIphoneX(
      { flex: 1, alignItems: "center", marginTop: "20%" },
      {
        ...Platform.select({
          ios: { flex: 1, alignItems: "center" },
          android: { display: "none" }
        })
      }
    )
  },
  pickerAddCardAndroid: {
    ...Platform.select({
      ios: { display: "none" },
      android: { flex: 1, alignItems: "center" }
    })
  },
  detail: {
    fontSize: 16,
    fontWeight: "bold"
  },
  detailInfoAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
    paddingTop: 20
    // paddingBottom: 10,
  },
  icon: {
    width: 50,
    height: 50
  },
  detailsHistory: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 50
  },
  alignItems: {
    alignItems: "center"
  },
  alignItemsQr: {
    alignItems: "center",
    paddingHorizontal: 20
  },
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  loadMoreBtn: {
    padding: 10,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  btnText: {
    color: "#707070",
    fontSize: 15,
    textAlign: "center"
  },
  borderItem: {
    borderRadius: 10,
    marginVertical: 5,
    borderColor: "#fff"
  },
  borderItemInput: {
    borderRadius: 10,
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: "#fff"
  },
  widthCard: {
    width: "80%",
    marginTop: 20
  },
  iconBtn: {
    color: "#000",
    fontSize: 28
  },
  mbListItem: {
    marginBottom: 10
  },
  lineMono: {
    borderBottomWidth: 1,
    // borderBottomColor: "#9d41eb",
    borderBottomColor: "rgba(103,120,151,0.40)",
    width: "100%",
    alignItems: "center",
    top: -15,
    zIndex: -1
  },
  lineMonoRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#rgba(103,120,151,0.30)",
    width: "100%",
    // alignItems: "left",
    paddingVertical: 15
  },
  lineMonoRowLast: {
    // alignItems: "left",
    paddingVertical: 15
  },
  badgeMono: {
    backgroundColor: "#563688",
    justifyContent: "center",
    zIndex: 111
  },
  iconCopy: {
    color: "#121212",
    fontSize: 20
  },
  textAddrQr: {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    fontSize: 18
  },
  styleQr: {
    width: 220,
    height: 220,
    borderRadius: 10
  },
  colorTxtBadge: {
    color: "#fff"
  },
  sizeIconBtn: {
    width: 60,
    height: 60
  },
  touchableCenter: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100
  },
  touchableAdd: {
    // position: 'absolute',
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#563688",
    borderRadius: 30,
    elevation: 8,
    borderWidth: 2,
    borderColor: "#563688"
  },
  columnBtnSeed: {
    justifyContent: "space-between",
    padding: 5,
    width: "auto",
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginTop: 25,
    marginHorizontal: 10
  },
  rowBlockBtnSeed: {
    ...ifIphoneX(
      {
        flexDirection: "row",
        justifyContent: "center",
        padding: 5
      },
      {
        ...Platform.select({
          ios: {
            flexDirection: "column",
            justifyContent: "center"
            // padding: 5
          },
          android: {
            flexDirection: "column",
            justifyContent: "center"
            // padding: 5
          }
        })
      }
    )
  },
  btnSeed: {
    ...ifIphoneX(
      {
        padding: 10,
        backgroundColor: "rgba(157, 65, 235, 0.2)",
        width: "auto"
      },
      {
        ...Platform.select({
          ios: {
            // padding: 10,
            marginBottom: 5,
            backgroundColor: "rgba(157, 65, 235, 0.2)",
            width: "100%",
            alignSelf: "center"
          },
          android: {
            // padding: 10,
            marginBottom: 5,
            backgroundColor: "rgba(157, 65, 235, 0.2)",
            width: "auto",
            alignSelf: "center"
          }
        })
      }
    )
  },
  txtBtnSeed: {
    color: "#fff"
  },
  itemSeed: {
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    borderColor: "#fff",
    marginTop: 20
  },
  toastStyle: {
    backgroundColor: "black",
    width: "90%"
  },
  styleLogo: {
    ...Platform.select({
      ios: {
        height: "10%",
        width: "20%"
      },
      android: {
        height: 27.3 * 2,
        width: 31.7 * 2
      }
    })
  },
  iconAdd: {
    ...Platform.select({
      ios: {
        color: "#fff",
        top: 2,
        fontSize: 25
      },
      android: {
        color: "#fff",
        fontSize: 25
      }
    })
  },
  btnClose: {
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  btnTextClose: {
    color: "#009EFD",
    fontSize: 18,
    marginBottom: 10
  },
  containerModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent2: {
    backgroundColor: "white",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40
  },
  imgSizeModal2: {
    width: 51,
    height: 51
  },
  textModalRender: {
    color: "rgba(34,34,34,100)",
    fontSize: 27,
    textAlign: "center",
    paddingHorizontal: 40,
    paddingVertical: 10,
    fontWeight: "bold"
  },
  textModalStyle: {
    fontSize: 17,
    color: "#000",
    paddingHorizontal: 20,
    textAlign: "center",
    marginVertical: 10
  },
  valueModalStyle: {
    color: "rgba(49,49,49,0.60)"
  },
  linkStyle: {
    color: "#2C1FBD",
    textDecorationLine: "underline"
  },
  arrowHeaderLeft: {
    paddingLeft: 15
  },
  arrowIcon: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold"
  },
  bodyConfirm: {
    width: "100%",
    marginTop: 20
  },
  borderItemSeed: {
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    borderColor: "#fff"
  },
  marginBtnSeed: {
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    marginTop: 10
  },
  textTermsStyle: {
    color: "#fff"
  },
  linkTermsStyle: {
    color: "#fff",
    textDecorationLine: "underline"
  },
  linkStyle: {
    color: "#2C1FBD",
    textDecorationLine: "underline"
  },
  styleLogo: {
    ...Platform.select({
      ios: {
        height: 27.3 * 2,
        width: 31.7 * 2
      },
      android: {
        height: 27.3 * 2,
        width: 31.7 * 2
      }
    })
  },
  cardItemSeed: {
    ...Platform.select({
      ios: {
        backgroundColor: "rgba(157, 65, 235, 0.2)",
        borderRadius: 10
      },
      android: { backgroundColor: "rgba(157, 65, 235, 0.2)", borderRadius: 10 }
    })
  },
  bodyTerms: {
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    borderColor: "#fff",
    marginTop: 20,
    height: "50%"
  },
  marginBtn: {
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    marginTop: 20
  },
  spinnerTextStyle: {
    color: "#FFF",
    textShadowColor: "#000",
    textShadowRadius: 5
  },
  titleInput: {
    alignItems: "center",
    marginBottom: 25
  },
  bgMainPage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  styleLogoHead: {
    width: 277 / 2,
    height: 241 / 2
  },
  styleCoinIn: {
    color: "#3FD4B2",
    fontSize: 17,
    fontWeight: "500"
  },
  styleCoinOut: {
    color: "red",
    fontSize: 17,
    fontWeight: "500"
  },
  createWordBlock: {
    ...Platform.select({
      ios: {
        borderRadius: 30,
        borderWidth: 1,
        width: "45%",
        paddingHorizontal: 10,
        borderColor: "rgba(157, 65, 235, 0.5)",
        alignItems: "center",
        paddingVertical: 5,
        marginHorizontal: 7,
        marginVertical: 5
      },
      android: {
        borderRadius: 30,
        borderWidth: 1,
        width: "45%",
        paddingHorizontal: 10,
        borderColor: "rgba(157, 65, 235, 0.5)",
        alignItems: "center",
        paddingVertical: 5,
        marginHorizontal: 5,
        marginVertical: 5
      }
    })
  },
  numberBlock: {
    ...Platform.select({
      ios: {
        borderRadius: 30,
        borderWidth: 1,
        width: 16,
        height: 16,
        marginVertical: 5,
        marginRight: 5,
        backgroundColor: "#7651ae",
        borderColor: "transparent",
        position: "absolute",
        left: 10
      },
      android: {
        borderRadius: 30,
        borderWidth: 1,
        width: 18,
        height: 18,
        marginVertical: 5,
        marginRight: 5,
        backgroundColor: "#7651ae",
        borderColor: "transparent",
        position: "absolute",
        left: 10
      }
    })
  },
  styleIndex: {
    color: "#fff",
    alignSelf: "center",
    fontSize: 10,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    top: 1
  },
  styleSeedWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: 10
  },
  heightQW: {
    borderColor: "red"
  },
  seedContainerStyle: {
    ...ifIphoneX(
      {
        borderWidth: 1,
        borderRadius: 5,
        width: "100%",
        // height: "40%",
        borderColor: "#fff",
        marginTop: 20,
        padding: 10,
        alignItems: "center"
      },
      {
        ...Platform.select({
          ios: {
            borderWidth: 1,
            borderRadius: 5,
            width: "100%",
            height: "40%",
            borderColor: "#fff",
            marginTop: 20,
            padding: 10,
            alignItems: "center"
          },
          android: {
            borderWidth: 1,
            borderRadius: 5,
            width: "100%",
            height: "40%",
            borderColor: "#fff",
            marginTop: 20,
            padding: 10,
            alignItems: "center"
          }
        })
      }
    )
  },
  placeholderSeedInput: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    left: -10,
    top: -5
  },
  itemPickerLang: {
    borderRadius: 10,
    marginVertical: 5,
    borderColor: "#fff",
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  btnLangPage: {
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    marginTop: 20
  },
  langPage: {
    color: "#fff",
    fontSize: 16
  },
  thumbnailStyle: {
    width: 26,
    height: 26,
    borderRadius: 10
  }
});
