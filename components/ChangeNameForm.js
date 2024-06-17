import { Alert, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Button, Input } from "@rneui/themed";
import { useState } from "react";
import { IPAddr } from "../shared/localIP";

export default function ChangeNameForm(props)
{
    //console.log("From changename, ", props.route.params.username)
    var { navigate, replace } = props.navigation
    var { username, phonenum, banknum } = props.route.params;
    var [ newName, setNewName ] = useState("");
    console.log(props.navigation.getState().routes.length);
    function onSubmitChangeName()
    {
        Alert.alert("THÔNG BÁO", `Bạn đã yêu cầu đổi tên\nTên cũ: ${username}\nTên mới: ${newName}\n`, [
            { text: "Hủy", onPress: () => {} },
            { text: "OK", onPress: () => ChangeName()}
        ])

        function AlertChangeNameSuccess()
        {
            Alert.alert("THÔNG BÁO", `Đổi tên thành công\nTên cũ: ${username}\nTên mới: ${newName}`, [
                { text: "OK", onPress: () => replace("LogInSignUp", { screen: "Login" }) }
            ], {cancelable: false})
        }
        function AlertNewNameAlreadyExist()
        {
            Alert.alert("THÔNG BÁO", `Tên ${newName} đã được sử dụng, vui lòng chọn tên khác`, [
                { text: "OK", onPress: () => {} }
            ], { cancelable: true, onDismiss: () => {} })
        }
        function AlertError()
        {
            Alert.alert("THÔNG BÁO", "Có lỗi không xác định khi đổi tên, vui lòng thử lại", [
                { text: "OK", onPress: () => {} }
            ], { cancelable: true, onDismiss: () => {} })
        }
        function ChangeName()
        {
            fetch(IPAddr + `update/users/username/${username}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newUserName: newName.trim(),
                })
            })
            .then(async (respond) => {
                //console.log(respond.json())
                if (respond.status == 345) {
                    AlertError();
                }
                else if (respond.status == 346) {
                    AlertNewNameAlreadyExist();
                }
                else {
                    AlertChangeNameSuccess();
                }
            })
            .catch((err) => console.log(err))
        }
    }

    return (
        <SafeAreaView>
            <Card>
                <Card.Title style={{fontSize: 35}}>HienneBank</Card.Title>
                <Card.Title style={{ fontWeight: "bold", fontSize: 25, textAlign: "center" }}>Thay đổi tên đăng nhập</Card.Title>
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
            <Input placeholder="Nhập tên mới..." keyboardType="ascii-capable" onChangeText={(name) => {setNewName(name)}} 
                    leftIcon={{ type: "font-awesome", name: "chevron-left" }}/>
            <View style={{flexDirection: "row", marginTop: 50, alignSelf: "center"}}>
                <Button title="ĐỔI" disabled={newName == ""} onPress={() => {onSubmitChangeName()}} />
                <View style={{paddingHorizontal: 30}} />
                <Button title="HỦY" color="#E95552" onPress={() => {navigate("SettingsScreen")}}/>
            </View>
        </SafeAreaView>
    )
}