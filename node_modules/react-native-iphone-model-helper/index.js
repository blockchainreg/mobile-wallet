import DeviceInfo from "react-native-device-info";
import { Dimensions } from "react-native";

const floorBelowTwoDecimal = integer => {
  return Math.floor(integer * 100) / 100;
};
const floorToFloat = integer => {
  return Math.floor(integer);
};

export const screenHeight = Dimensions.get("window").height;
export const screenWidth = Dimensions.get("window").width;

export const screenRatio = floorBelowTwoDecimal(screenHeight / screenWidth);

export const getDeviceModel = () => {
  return DeviceInfo.getModel();
};

export const isIphoneX = () => {
  return DeviceInfo.getModel() === "iPhone X";
};
export const isIphoneXs = () => {
  return DeviceInfo.getModel() === "iPhone XS";
};
export const isIphoneXsMax = () => {
  return DeviceInfo.getModel() === "iPhone XS Max";
};
export const isIphoneXr = () => {
  return DeviceInfo.getModel() === "iPhone XR";
};
export const isIphone8 = () => {
  return DeviceInfo.getModel() === "iPhone 8";
};
export const isIphone8Plus = () => {
  return DeviceInfo.getModel() === "iPhone 8 Plus";
};
export const isIphone7 = () => {
  return DeviceInfo.getModel() === "iPhone 7";
};
export const isIphone7Plus = () => {
  return DeviceInfo.getModel() === "iPhone 7 Plus";
};

export const isIphoneSe = () => {
  return DeviceInfo.getModel() === "iPhone SE";
};

export const isIphone6 = () => {
  return DeviceInfo.getModel() === "iPhone 6";
};
export const isIphone6Plus = () => {
  return DeviceInfo.getModel() === "iPhone 6 Plus";
};
export const isIphone5s = () => {
  return DeviceInfo.getModel() === "iPhone 5s";
};
export const isIphone5c = () => {
  return DeviceInfo.getModel() === "iPhone 5c";
};

export default {
  screenHeight,
  screenWidth,
  screenRatio,
  getDeviceModel,
  isIphoneX,
  isIphoneXs,
  isIphoneXsMax,
  isIphoneXr,
  isIphone8,
  isIphone8Plus,
  isIphone7,
  isIphone7Plus,
  isIphoneSe,
  isIphone6,
  isIphone6Plus,
  isIphone5s,
  isIphone5c
};
