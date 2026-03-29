/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { setBackgroundHandler } from './src/services/FCMService';

// Must be called before AppRegistry so Firebase can handle background messages
setBackgroundHandler();

AppRegistry.registerComponent(appName, () => App);
