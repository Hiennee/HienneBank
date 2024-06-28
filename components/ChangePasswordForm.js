import { Alert, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Button, Input } from "@rneui/themed";
import { useState } from "react";
import { IPAddr } from "../shared/localIP";

export default function ChangePasswordForm(props)
{
    //console.log("From changename, ", props.route.params.username)
    var { navigate, replace } = props.navigation
    var { username, phonenum, banknum, password } = props.route.params;
    var [ newPassword, setNewPassword ] = useState("");
    var [ currentPassword, setCurrentPassword ] = useState("");

    function onSubmitChangePassword()
    {
        console.log("New:", newPassword, "Current:", currentPassword)
        if (password != currentPassword) {
            AlertIncorrectPassword();
            return;
        }
        if (newPassword == password) {
            AlertSamePassword();
            return;
        }
        Alert.alert("THÔNG BÁO", `Bạn đã yêu cầu đổi mật khẩu\nMật khẩu mới: ${newPassword}`, [
            { text: "Hủy", onPress: () => {} },
            { text: "OK", onPress: () => ChangePassword()}
        ])
        function AlertIncorrectPassword()
        {
            Alert.alert("THÔNG BÁO", "Sai mật khẩu", [
                { text: "OK", onPress: () => {} },
            ], { cancelable: true })
        }
        function AlertSamePassword()
        {
            Alert.alert("THÔNG BÁO", "Mật khẩu mới trùng với mật khẩu hiện tại, vui lòng chọn mật khẩu khác", [
                { text: "OK", onPress: () => {} },
            ], { cancelable: true })
        }
        function AlertChangePasswordSuccess()
        {
            Alert.alert("THÔNG BÁO", `Đổi tên thành công\nMật khẩu mới: ${newPassword}`, [
                { text: "OK", onPress: () => {
                    setNewPassword("");
                    navigate("Greetings");
                    //navigate("LogIn");
                    //replace("LogInSignUp", { screen: "Login" })
                }}
            ], {cancelable: false})
        }
        function AlertError()
        {
            Alert.alert("THÔNG BÁO", "Có lỗi không xác định khi đổi mật khẩu, vui lòng thử lại", [
                { text: "OK", onPress: () => {} }
            ], { cancelable: true, onDismiss: () => {} })
        }
        function ChangePassword()
        {
            fetch(IPAddr + `update/users/password/${username}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newPassword: newPassword,
                })
            })
            .then(async (respond) => {
                //console.log(respond.json())
                if (respond.status == 345) {
                    AlertError();
                }
                else {
                    AlertChangePasswordSuccess();
                }
            })
            .catch((err) => console.log(err))
        }
    }

    return (
        <SafeAreaView>
            <Card>
                <Card.Title style={{fontSize: 35}}>HienneBank</Card.Title>
                <Card.Title style={{ fontWeight: "bold", fontSize: 25, textAlign: "center" }}>Thay đổi mật khẩu</Card.Title>
                <Card.Divider />
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text style={{fontWeight: "bold", fontSize: 15}}>Số tài khoản</Text>
                    <Text>{banknum}</Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text style={{fontWeight: "bold", fontSize: 15}}>Họ tên</Text>
                    <Text>{username}</Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text style={{fontWeight: "bold", fontSize: 15}}>Số điện thoại</Text>
                    <Text>{phonenum}</Text>
                </View>
            </Card>
            <View style={{marginTop: 120}}/>
            <Input placeholder="Nhập mật khẩu hiện tại..." keyboardType="ascii-capable" secureTextEntry onChangeText={(password) => {setCurrentPassword(password)}} 
                    leftIcon={{ type: "font-awesome", name: "chevron-left" }}/>
            <Input placeholder="Nhập mật khẩu mới..." keyboardType="ascii-capable" secureTextEntry onChangeText={(password) => {setNewPassword(password)}} 
                    leftIcon={{ type: "font-awesome", name: "chevron-left" }}/>
            <View style={{flexDirection: "row", marginTop: 50, alignSelf: "center"}}>
                <Button title="ĐỔI" disabled={newPassword == ""} onPress={() => onSubmitChangePassword()} />
                <View style={{paddingHorizontal: 30}} />
                <Button title="HỦY" color="#E95552" onPress={() => { navigate("SettingsScreen") }}/>
            </View>
        </SafeAreaView>
    )
}