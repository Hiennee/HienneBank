import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native";

import Register from "./Register";
import Greetings from './Greetings';
import Login from './Login';
import Home from "./Home";
import AddMoney from "./AddMoney";
import WithdrawMoney from "./WithdrawMoney";
import TransferMoney from "./TransferMoney";
import History from "./History";
import FAQ from "./FAQ";
import Information from './Information';
import Settings from './Settings';
import ChangeNameForm from './ChangeNameForm';
import ChangePasswordForm from './ChangePasswordForm';
import ChangeAccountNumberForm from './ChangeAccountNumberForm';
import ChangePhoneNumberForm from './ChangePhoneNumberForm';
import ChangeThemeForm from './ChangeThemeForm';
import Contact from './Contact';
import { useEffect } from 'react';
// import asd from './asd';

function LogInSignUpNavigatorScreen()
{
    //try {console.log("loginsignup", props.route.params.params ?? "") }
    console.log("Login Signup navigator is called");
    //catch { // khi để try catch ở đây thì LogInSignUpNavigatorScreen trả về View trống?
    const LogInSignUp = createStackNavigator();
    return (
        <LogInSignUp.Navigator
        initialRouteName="Greetings"
        screenOptions={{headerShown: false}}>
            <LogInSignUp.Screen name="Greetings" component={Greetings} />
            <LogInSignUp.Screen name="Register" component={Register} />
            <LogInSignUp.Screen name="Login" component={Login} />
            <LogInSignUp.Screen name="Bridge" component={BridgeNavigatorScreen} />
            {/* <LogInSignUp.Screen name="asd" component={asd} /> */}
        </LogInSignUp.Navigator>
    ) //}
}

function BridgeNavigatorScreen(prop)
{
    console.log("from bridge", prop);
    // trùng tên props nên đổi thành prop
    //console.log(props.route)
    //console.log(props.route.params.username)
    /*initialParams={{username: props.route.params.username}}*/
    // if (prop.route.params == null) {
    //     prop.route.params = JSON.parse(`{"params": {"banknum": "15467", "money": 50000, "password": "1", "phonenum": "6497", "username": "AA"}}`);
    
    // }
    // prop = JSON.parse(`navigation": "route": {"key": "Bridge-bQX_sOqU0PTs0YBv1MeK-", "name": "Bridge", "params": {"banknum": "15467", "money": 50000, "password": "1", "phonenum": "6497", "username": "AA"}, "path": undefined}}`);
    const Bridge = createStackNavigator();
    return (
        <Bridge.Navigator
        initialRouteName="Main"
        screenOptions={{ headerShown: false }}>
            <Bridge.Screen name="Main">
                {(props) => <MainNavigatorScreen {...props} username={prop.route.params.username} money={prop.route.params.money} 
                    banknum={prop.route.params.banknum} phonenum={prop.route.params.phonenum} password={prop.route.params.password}
                    theme={prop.route.params.theme}/>}
            </Bridge.Screen>
        </Bridge.Navigator>
    )
}

function MainNavigatorScreen(prop)
{
    //console.log("from main nav", prop)
    //console.log(props.money)
    //prop.navigation.replace("Home");
    const MainNavigator = createStackNavigator();
    return (
        <MainNavigator.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}>
            <MainNavigator.Screen name="Home">
                { (props) => <Home {...props} username={prop.username} money={prop.money} banknum={prop.banknum} 
                phonenum={prop.phonenum} password={prop.password} theme={prop.theme} /> }
            </MainNavigator.Screen>
            <MainNavigator.Screen name="AddMoney" component={AddMoney} />
            <MainNavigator.Screen name="WithdrawMoney" component={WithdrawMoney} />
            <MainNavigator.Screen name="TransferMoney" component={TransferMoney} />
            <MainNavigator.Screen name="History" component={History} />
            <MainNavigator.Screen name="FAQ" component={FAQ} />
            <MainNavigator.Screen name="Information" component={Information} />
            <MainNavigator.Screen name="Contact" component={Contact} />
            <MainNavigator.Screen name="SettingsNavigator">
                {(props) => <SettingsNavigatorScreen {...props} username={prop.username} banknum={prop.banknum}
                phonenum={prop.phonenum} password={prop.password} theme={prop.theme}/>}
            </MainNavigator.Screen>
        </MainNavigator.Navigator>
    )
}

function SettingsNavigatorScreen(prop)
{
    //khi gọi settings, ở lần gọi thứ 1, khi bấm vào settings sẽ render n lần (n console log),
    //nhưng back ra khỏi screen gọi settings n+1 lần (n+1 console log),
    console.log("Settingsnav:", prop);
    var initDate = new Date();
    useEffect(() => {
        var renderedSuccessfullyTime = new Date();
        console.log("Delta time from SettingsNav: ", renderedSuccessfullyTime - initDate + " ms");
    })
    //console.log(prop)
    const SettingsNav = createStackNavigator();
    return (
        <SettingsNav.Navigator
        initialRouteName="SettingsScreen"
        screenOptions={{ headerShown: false }}>
            <SettingsNav.Screen name="SettingsScreen">
                {(props) => <Settings {...props} username={prop.username} phonenum={prop.phonenum}
                banknum={prop.banknum} password={prop.password} theme={prop.theme}/>}
            </SettingsNav.Screen>
            <SettingsNav.Screen name="ChangeName" component={ChangeNameForm} />
            <SettingsNav.Screen name="ChangePassword" component={ChangePasswordForm} />
            <SettingsNav.Screen name="ChangeAccountNumber" component={ChangeAccountNumberForm} />
            <SettingsNav.Screen name="ChangePhoneNumber" component={ChangePhoneNumberForm} />
            <SettingsNav.Screen name="ChangeTheme" component={ChangeThemeForm} />
            {/* <SettingsNav.Screen name="LogInSignUp" component={LogInSignUpNavigatorScreen} /> */}
            <SettingsNav.Screen name="LogIn" component={Login} />
            <SettingsNav.Screen name="Greetings" component={Greetings}/>
            {/* <SettingsNav.Screen name="asd" component={asd} /> */}
        </SettingsNav.Navigator>
    )
}

export default function Main()
{
    return (
        <NavigationContainer>
            <LogInSignUpNavigatorScreen />
        </NavigationContainer>
    )
}