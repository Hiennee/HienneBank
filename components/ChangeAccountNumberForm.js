import { Alert, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Button, Input } from "@rneui/themed";
import { useState } from "react";
import { IPAddr } from "../shared/IP";

export default function ChangeAccountNumberForm(props)
{
    //console.log("From changename, ", props.route.params.username)
    var { navigate } = props.navigation
    var { username, phonenum, banknum } = props.route.params;
    var [ newBanknum, setNewBanknum ] = useState("");
    //console.log("abc");

    function onSubmitChangeAccountNumber()
    {
        Alert.alert("THÔNG BÁO", `Bạn đã yêu cầu đổi số tài khoản\nSố tài khoản cũ: ${banknum}\nSố tài khoản mới: ${newBanknum}\n`, [
            { text: "Hủy", onPress: () => {} },
            { text: "OK", onPress: () => ChangeAccountNumber()}
        ])

        function AlertChangeAccountNumberSuccess()
        {
            Alert.alert("THÔNG BÁO", `Đổi số tài khoản thành công\nSố tài khoản cũ: ${banknum}\nSố tài khoản mới: ${newBanknum}`, [
                { text: "OK", onPress: () => {
                    setNewBanknum("");
                    navigate("Greetings");
                    //navigate("LogIn"); 
                    //replace("LogInSignUp", {screen: "Login"})props.navigation.pop(1)
                }}
            ], { cancelable: false })
        }
        function AlertAccountNumberAlreadyExist()
        {
            Alert.alert("THÔNG BÁO", `Số tài khoản ${newBanknum} đã được sử dụng, vui lòng chọn số tài khoản khác`, [
                { text: "OK", onPress: () => {} }
            ], { cancelable: true, onDismiss: () => {} })
        }
        function AlertError()
        {
            Alert.alert("THÔNG BÁO", "Có lỗi không xác định khi đổi số tài khoản, vui lòng thử lại", [
                { text: "OK", onPress: () => {} }
            ], { cancelable: true, onDismiss: () => {} })
        }
        function ChangeAccountNumber()
        {
            fetch(IPAddr + `update/users/banknum/${username}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newBanknum: newBanknum.trim(),
                })
            })
            .then(async (respond) => {
                //console.log(respond.json())
                //console.log(respond);
                if (respond.status == 345) {
                    AlertError();
                }
                else if (respond.status == 346) {
                    AlertAccountNumberAlreadyExist();
                }
                else {
                    AlertChangeAccountNumberSuccess();
                }
            })
            .catch((err) => console.log(err))
        }
    }

    return (
        <SafeAreaView>
            <Card>
                <Card.Title style={{fontSize: 35}}>HienneBank</Card.Title>
                <Card.Title style={{ fontWeight: "bold", fontSize: 25, textAlign: "center" }}>Thay đổi số tài khoản</Card.Title>
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
            <Input placeholder="Nhập số tài khoản mới..." keyboardType="numeric" value={newBanknum}
            leftIcon={{ type: "font-awesome", name: "chevron-left" }} onChangeText={(accountNum) => {setNewBanknum(accountNum)}} />
            <View style={{flexDirection: "row", marginTop: 50, alignSelf: "center"}}>
                <Button title="ĐỔI" disabled={newBanknum == ""} onPress={() => onSubmitChangeAccountNumber()} />
                <View style={{paddingHorizontal: 30}} />
                <Button title="HỦY" color="#E95552" onPress={() => { navigate("SettingsScreen") }}/>
            </View>
        </SafeAreaView>
    )
}