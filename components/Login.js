import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Input, Button } from "@rneui/themed";
import { IPAddr } from "../shared/IP";
import { AntDesign } from "@expo/vector-icons";
//import { fetch } from "react-native-ssl-pinning"
export default function Login(props)
{

    console.log("Login state:", props.navigation.getState());
    var [ username, setUsername ] = useState('');
    var [ password, setPassword ] = useState('');

    var { navigate, replace } = props.navigation;
    //var { color } = props.route.params;
    console.log("Nav State: ", props.navigation.getState());

    const LogOut = () => 
    {
        function AlertError()
        {
            Alert.alert("THÔNG BÁO", "Có lỗi không xác định khi đăng xuất, vui lòng thử lại", [
                { text: "OK", onPress: () => {} }
            ], { cancelable: true, onDismiss: () => {} })
        }
        function AlertSuccessLogOut()
        {
            Alert.alert("THÔNG BÁO", `Đăng xuất khỏi tài khoản ${username.trim().toUpperCase()} thành công`, [
                { text: "OK", onPress: () => { } }
            ], { cancelable: false })
        }

        fetch(IPAddr + `logout/${username.trim().toUpperCase()}`, {
            method: "GET",
        }).then((respond) => {
            if (respond.status == 345 || respond.status == 346) {
                AlertError();
            }
            else if (respond.status == 234) {
                AlertSuccessLogOut();
            }
        })
    }

    const AlertLoginFailed = () =>
    {
        Alert.alert("THÔNG BÁO", "Sai tên người dùng hoặc mật khẩu",
        [{
                text: "Need help?",
                onPress: () => Alert.alert("THÔNG BÁO", "gg",
                [{ text: ":(", onPress: () => navigate("Greetings") }],
                {cancelable: true})},
            { text: "OK", onPress: () => navigate("Login") }
        ], { cancelable: true })
    }

    const AlertAlreadyLoggedIn = () =>
    {
        Alert.alert("THÔNG BÁO", "Tài khoản đã được đăng nhập ở nơi khác hoặc ứng dụng đã thoát không đúng cách\nĐăng xuất khỏi tất cả thiết bị", [
            { text: "Đăng xuất", onPress: () => LogOut() }
        ], { cancelable: false })
    }

    const AlertLoginSuccess = (json) =>
    {
        //console.log(json.money);
        Alert.alert("THÔNG BÁO", "Đăng nhập thành công với tài khoản " + username.trim().toUpperCase(),
        // khi từ change form navigate thẳng qua Login, do không có khái niệm về bridge nên không route qua được cái này
        [{ text: "OK", onPress: () => {
            setUsername("");
            setPassword("");
            navigate("Bridge", { username: username.trim().toUpperCase(), money: json.money, 
                banknum: json.banknum, phonenum: json.phonenum, password: password, theme: json.theme /*color: color*/ }) 
            }}
        ], { cancelable: true } )
    }

    const onSubmitLogin = (username, password) => {
        fetch(IPAddr + "login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username.trim().toUpperCase(),
                password: password
            })
        }).then(async (respond) => {
            //console.log(respond.status)
            if (respond.status == 345) {
                AlertLoginFailed();
            }
            else if (respond.status == 346) {
                AlertAlreadyLoggedIn();
            }
            else if (respond.status == 234) {
                //AlertLoginSuccess(await respond.json())
                var json = await respond.json();
                //console.log(json);
                //console.log(navigate)
                //console.log("hello");
                //navigate("Bridge", { username: username, money: json.money, banknum: json.banknum, phonenum: json.phonenum })
                AlertLoginSuccess(json);
            }
        }).catch((err) => {
            AlertLoginFailed();
            console.log("Caught Error from Login");
            console.log(err);
        })
    }
    return (
        <SafeAreaView style={{ backgroundColor: "#e7e4e42d", height: "100vh", width: "100vh" }}>
            <Text style={{ textAlign: "center", fontWeight: "bold", justifyContent: "center", fontSize: 50, paddingTop: 150, paddingBottom: 30 }}>Đăng nhập</Text>
            <Input placeholder='Tên người dùng...' value={username.toUpperCase()} onChangeText={(txt) => { setUsername(txt) } } 
                leftIcon={ <AntDesign name="user" size={24}/> }/>
            <Input placeholder='Mật khẩu...' value={password} secureTextEntry={true} onChangeText={(txt) => { setPassword(txt) }} 
                leftIcon={ <AntDesign name="eyeo" size={24}/> } />
            <View style={{ flexDirection:"row", justifyContent:"center", marginTop: 70 }}>
                <Button title="ĐĂNG NHẬP" disabled={username == "" || password == ""} onPress={() => { onSubmitLogin(username, password); }}></Button>
                <View style={{ paddingHorizontal: 20 }}/>
                <Button title="QUAY LẠI" color="warning" onPress={() => navigate("Greetings")}></Button>
            </View>
        </SafeAreaView>
    )
}