import { Input } from '@rneui/themed';
import { Button, Text, View, Alert, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import { IPAddr } from "../shared/localIP";

export default function Register(props)
{
    var [username, setUsername] = useState('');
    var [banknum, setBanknum] = useState('');
    var [phonenum, setPhonenum] = useState('');
    var [password, setPassword] = useState('');
    //navigation.popToTop()
    var { navigate } = props.navigation;
    console.log(props.navigation);
    const AlertRegisterSuccess = () =>
    {
        Alert.alert("THÔNG BÁO", "Tạo tài khoản  " + username + " thành công",
        [{ text: "OK", onPress: () => {navigate("Login") }}
        ], {cancelable: true})
    }

    const AlertFetchFailed = () => {
        Alert.alert("THÔNG BÁO", "Có lỗi khi kết nối đến máy chủ",
        [
            { text: "OK", onPress: () => {navigate("Register")}}
        ],  {cancelable: true})
    }

    const AlertInvalidInput = () => {
        Alert.alert("THÔNG BÁO", "Ký tự không hợp lệ",
        [
            { text: "OK", onPress: () => {navigate("Register")}}
        ],  {cancelable: true})
    }

    const AlertRegisterFailed = () =>
    {
        Alert.alert("THÔNG BÁO", "Tên người dùng " + username + " đã tồn tại!",
        [
            { text: "OK", onPress: () => {navigate("Login")}}
        ],  {cancelable: true})
    }
    const onSubmitRegister = (username, banknum, phonenum, password) => {
        fetch(IPAddr + "register", {
            method: "POST",
            headers: { // nhớ cái này giùm cái
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username.trim(),
                banknum: banknum,
                phonenum: phonenum,
                password: password
            })
        })
        .then((respond) => {
            if (respond.status == 345)
            {
                AlertRegisterFailed();
            }
            else if (respond.status == 234)
            {   
                AlertRegisterSuccess();
            }
        })
        .catch((err) => {
            console.log(err);
            AlertFetchFailed();
        })
    }
    //console.log("Register")
    return (
        <SafeAreaView style={{backgroundColor: "#e7e4e42d", height: "100vh", width: "100vh"}}>
            <Text style ={{ fontSize: 40, textAlign: "center", paddingTop: 50, paddingBottom: 20 }}>HienneBank</Text>
            <Text style ={{ fontSize: 40, textAlign: "center", paddingBottom: 80 }}>Đăng ký tài khoản</Text>
            <Input placeholder='Tên đăng nhập...' value={username} onChangeText={(username) => { setUsername(username.toUpperCase()) }} 
                leftIcon={{ type: "font-awesome", name: "chevron-left" }}/>
            <Input placeholder='Số tài khoản...' keyboardType="numeric" leftIcon={{ type: "font-awesome", name: "chevron-left" }} onChangeText={(banknum) => { 
                try {
                    setBanknum(Number(banknum))
                } 
                catch (err)
                {
                    console.log(err)
                    console.log("Not a number")
                    AlertInvalidInput()
                }
            }} />
            <Input placeholder='Số điện thoại...' keyboardType="numeric" leftIcon={{ type: "font-awesome", name: "chevron-left" }} onChangeText={(phonenum) => { 
                try {
                    setPhonenum(Number(phonenum))
                } 
                catch (err)
                {
                    console.log(err)
                    console.log("Not a number")
                    AlertInvalidInput()
                }
             }} />
            <Input placeholder='Mật khẩu...' secureTextEntry={true} onChangeText={(txt) => { setPassword(txt) }} 
                leftIcon={{ type: "font-awesome", name: "chevron-left" }}
                errorMessage='Mật khẩu phải từ 7-12 ký tự, gồm ký tự đặc biệt và số' />
            <View style={{ flexDirection:"row", justifyContent:"center", marginTop: 80 }}>
                <Button title="Đăng ký" disabled={username == "" || password == "" || banknum == "" || phonenum == ""} 
                    onPress={() => { onSubmitRegister(username, banknum, phonenum, password); }} />
                <View style={{ paddingHorizontal:10 }} />
                <Button title="Hủy" onPress={() => navigate("Greetings")} />
            </View>
        </SafeAreaView>
    )
}