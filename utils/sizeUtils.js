import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Define the base dimensions from your Adobe XD design
const BASE_WIDTH = 1131;
const BASE_HEIGHT = 2436;

/**
* Function to scale width based on the device's screen width
* @param {number} size - The width in the Adobe XD design
* @return {number} - The scaled width for the device
*/
export const scaleWidth = (size) => (screenWidth / BASE_WIDTH) * size;

/**
* Function to scale height based on the device's screen height
* @param {number} size - The height in the Adobe XD design
* @return {number} - The scaled height for the device
*/
export const scaleHeight = (size) => (screenHeight / BASE_HEIGHT) * size;