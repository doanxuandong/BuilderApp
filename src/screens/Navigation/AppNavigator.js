import React from "react";
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from "@react-navigation/native";
import TestScreen from "../test";
import Login from "../Login";
import Register from "../Register";
import MainScreen from "../MainScreen";
import HomeScreen from "../HomeScreen";
import UserScreen from "../UserScreen";
import BookScreen from "../BookScreen";
import AddPostScreen from "../AddPostScreen";
import BrickCalculator from "../BrickCalculator";
import Edit from "../Component/ListPro/Edit";
import ForgotPassword from "../ForgotPassword";
import Tabsatthep from "../Tabsatthep";
import EditPosts from "../EditPosts";
import ProfileScreen from "../ProfileScreen";
const Stack = createStackNavigator();


const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="test"
                    component={props => <TestScreen {...props} />}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Login"
                    component={props => <Login {...props} />}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Edit"
                    component={props => <Edit {...props} />}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Register"
                    component={props => <Register {...props} />}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MainScreen"
                    component={props => <MainScreen {...props} />}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="UserScreen"
                    component={props => <UserScreen {...props} />}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="BookScreen"
                    component={props => <BookScreen {...props} />}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AddPostScreen"
                    component={props => <AddPostScreen {...props} />}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="BrickCalculator"
                    component={props => <BrickCalculator {...props} />}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="HomeScreen"
                    component={props => <HomeScreen {...props} />}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ForgotPassword"
                    component={props => <ForgotPassword {...props} />}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Tabsatthep"
                    component={props => <Tabsatthep {...props} />}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="EditPosts"
                    component={props => <EditPosts {...props} />}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ProfileScreen"
                    component={props => <ProfileScreen {...props} />}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
export default AppNavigator;