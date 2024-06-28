import { Alert, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Button, Input } from "@rneui/themed";
import { useState } from "react";
import { IPAddr } from "../shared/localIP";

export default function ChangePhoneNumberForm(props)
{
    //console.log("From changename, ", props.route.params.username)
    var { navigate, replace } = props.navigation
    var { username, phonenum, banknum } = props.route.params;
    var [ newPhonenum, setNewPhonenum ] = useState("");

    function onSubmitChangePhoneNumber()
    {
        Alert.alert("THÔNG BÁO", `Bạn đã yêu cầu đổi số điện thoại\nSố điện thoại cũ: ${phonenum}\nSố điện thoại mới: ${newPhonenum}\n`, [
            { text: "Hủy", onPress: () => {} },
            { text: "OK", onPress: () => ChangePhoneNumber() }
        ])

        function AlertChangePhoneNumberSuccess()
        {
            Alert.alert("THÔNG BÁO", `Đổi số điện thoại thành công\nSố điện thoại cũ: ${phonenum}\nSố điện thoại mới: ${newPhonenum}`, [
                { text: "OK", onPress: () => {
                    setNewPhonenum("");
                    navigate("Greetings");
                    //navigate("LogIn");
                    //replace("LogInSignUp", { screen: "Login" })
                }}
            ], { cancelable: false })
        }
        function AlertPhoneNumberAlreadyExist()
        {
            Alert.alert("THÔNG BÁO", `Số điện thoại ${newPhonenum} đã được sử dụng, vui lòng chọn số điện thoại khác`, [
                { text: "OK", onPress: () => {} }
            ], { cancelable: true, onDismiss: () => {} })
        }
        function AlertError()
        {
            Alert.alert("THÔNG BÁO", "Có lỗi không xác định khi đổi số điện thoại, vui lòng thử lại", [
                { text: "OK", onPress: () => {} }
            ], { cancelable: true, onDismiss: () => {} })
        }
        function ChangePhoneNumber()
        {
            fetch(IPAddr + `update/users/phonenum/${username}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newPhonenum: newPhonenum.trim(),
                })
            })
            .then(async (respond) => {
                //console.log(respond.json())
                if (respond.status == 345) {
                    AlertError();
                }
                else if (respond.status == 346) {
                    AlertPhoneNumberAlreadyExist();
                }
                else {
                    AlertChangePhoneNumberSuccess();
                }
            })
            .catch((err) => console.log(err))
        }
    }

    return (
        <SafeAreaView>
            <Card>
                <Card.Title style={{fontSize: 35}}>HienneBank</Card.Title>
                <Card.Title style={{ fontWeight: "bold", fontSize: 25, textAlign: "center" }}>Thay đổi số điện thoại</Card.Title>
                <Card.Divider />
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text style={{fontWeight: "bold", fontSize: 15}}>Số tài khoản</Text>
                    <Text>{banknum}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15 }}>Họ tên</Text>
                    <Text>{ username }</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15 }}>Số điện thoại</Text>
                    <Text>{ phonenum }</Text>
                </View>
            </Card>
            <View style={{ marginTop: 120 }}/>
            <Input placeholder="Nhập số điện thoại mới..." keyboardType="numeric" onChangeText={ (phoneNum) => {setNewPhonenum(phoneNum) }} 
                    leftIcon={{ type: "font-awesome", name: "chevron-left" }}/>
            <View style={{ flexDirection: "row", marginTop: 50, alignSelf: "center" }}>
                <Button title="ĐỔI" disabled={ newPhonenum == "" } onPress={() => onSubmitChangePhoneNumber()} />
                <View style={{ paddingHorizontal: 30 }} />
                <Button title="HỦY" color="#E95552" onPress={() => { navigate("SettingsScreen") }}/>
            </View>
        </SafeAreaView>
    )
}