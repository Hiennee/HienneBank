import { createStackNavigator, StackView } from '@react-navigation/stack';
import { NavigationContainer, StackRouter } from "@react-navigation/native";

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

function LogInSignUpNavigatorScreen()
{
    //try {console.log("loginsignup", props.route.params.params ?? "") }
    //catch { // khi để try catch ở đây thì LogInSignUpNavigatorScreen trả về View trống?
    const LogInSignUp = createStackNavigator();
    return (
        <LogInSignUp.Navigator
        initialRouteName="Greetings"
        screenOptions={{headerShown: false}}>
            <LogInSignUp.Screen name="Register" component={Register} />
            <LogInSignUp.Screen name="Greetings" component={Greetings} />
            <LogInSignUp.Screen name="Login" component={Login} />
            <LogInSignUp.Screen name="Bridge" component={BridgeNavigatorScreen} />
        </LogInSignUp.Navigator>
    ) //}
}

function BridgeNavigatorScreen(prop)
{
    // trùng tên props nên đổi thành prop
    //console.log(props.route)
    //console.log(props.route.params.username)
    /*initialParams={{username: props.route.params.username}}*/
    
    const Bridge = createStackNavigator();
    return (
        <Bridge.Navigator
        initialRouteName="Main"
        screenOptions={{headerShown: false}}>
            <Bridge.Screen name="Main">
                {(props) => <MainNavigatorScreen {...props} username={prop.route.params.username} money={prop.route.params.money} 
                    banknum={prop.route.params.banknum} phonenum={prop.route.params.phonenum} password={prop.route.params.password}
                    color={prop.route.params.color}/>}
            </Bridge.Screen>
        </Bridge.Navigator>
    )
}

function SettingsNavigatorScreen(prop)
{
    //console.log(prop)
    const SettingsNav = createStackNavigator();
    return (
        <SettingsNav.Navigator
    
        initialRouteName="SettingsScreen"
        screenOptions={{headerShown: false, animation: "none"}}>
            <SettingsNav.Screen name="SettingsScreen">
                {(props) => <Settings {...props} username={prop.username} phonenum={prop.phonenum}
                banknum={prop.banknum} password={prop.password}/>}
            </SettingsNav.Screen>
            <SettingsNav.Screen name="ChangeName" component={ChangeNameForm} />
            <SettingsNav.Screen name="ChangePassword" component={ChangePasswordForm} />
            <SettingsNav.Screen name="ChangeAccountNumber" component={ChangeAccountNumberForm} />
            <SettingsNav.Screen name="ChangePhoneNumber" component={ChangePhoneNumberForm} />
            <SettingsNav.Screen name="ChangeTheme" component={ChangeThemeForm} />
            <SettingsNav.Screen name="LogInSignUp" component={LogInSignUpNavigatorScreen} />
        </SettingsNav.Navigator>
    )
}

function MainNavigatorScreen(prop)
{
    //console.log(props)
    //console.log(props.money)
    //prop.navigation.replace("Home");
    const MainNavigator = createStackNavigator();
    return (
        <MainNavigator.Navigator
        initialRouteName="Home"
        screenOptions={{headerShown: false}}>
            <MainNavigator.Screen name="Home">
                {(props) => <Home {...props} username={prop.username} money={prop.money} banknum={prop.banknum} 
                phonenum={prop.phonenum} password={prop.password} color={prop.color}/>}
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
                phonenum={prop.phonenum} password={prop.password}/>}
            </MainNavigator.Screen>
        </MainNavigator.Navigator>
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