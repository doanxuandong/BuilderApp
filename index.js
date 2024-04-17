/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import Test from './src/screens/test'
import Login from './src/screens/Login'
import Register from './src/screens/Register'
import AppNavigator from './src/screens/Navigation/AppNavigator';
import { name as appName } from './app.json';
import Edit from './src/screens/Component/ListPro/Edit';
LogBox.ignoreAllLogs();

AppRegistry.registerComponent(appName, () => Edit);
