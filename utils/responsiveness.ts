import { Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

//Responsive Phone Width
//calculates percentages based on the screen's width.
const RPW = (percentage:number) => {
  return (percentage / 100) * screenWidth;
};

//Responsive Phone Height
//calculates percentages based on the screen's height.
const RPH = (percentage:number) => {
  return (percentage / 100) * screenHeight;
};

//Responsive Phone Pixel
// Calculate font sizes in pixels based on the screen's width.
const RPP = (pixels: number) => {
    const scaleFactor = screenWidth / 360; // 360 is a reference screen width
    const responsiveSize = pixels * scaleFactor ;
    return responsiveSize;
  }

export {
    RPH,
    RPW,
    RPP
}
