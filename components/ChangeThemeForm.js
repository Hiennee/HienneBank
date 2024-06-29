import { Alert, View, Text } from "react-native";
import { Card, Button } from "@rneui/themed";
import { useState } from "react";
import ColorPicker from "react-native-wheel-color-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { IPAddr } from "../shared/IP";
export default function ChangeThemeForm(props)
{
    var [ color, setColor ] = useState("");
    var { navigate } = props.navigation;
    var { username } = props.route.params;

    //console.log(color);

    function onSubmitChangeTheme()
    {
        Alert.alert("THÔNG BÁO", "Bạn đã yêu cầu đổi màu chủ đạo của ứng dụng", [
            { text: "HỦY", onPress: () => {} },
            { text: "OK", onPress: () => ChangeTheme() },
        ], { cancelable: true, onDismiss: () => {} })

        function AlertError()
        {
            Alert.alert("THÔNG BÁO", "Có lỗi không xác định khi đổi màu ứng dụng, vui lòng thử lại", [
                { text: "OK", onPress: () => {} }
            ], { cancelable: true, onDismiss: () => {} })
        }

        function AlertChangeThemeSuccess()
        {
            Alert.alert("THÔNG BÁO", `Đổi màu ứng dụng thành công`, [
                { text: "OK", onPress: () => {
                    setColor("");
                    navigate("Greetings");
                    //navigate("LogIn");
                    //replace("LogInSignUp", { screen: "Login" })
                    //navigate("LogInSignUp", { screen: "Login", params: { color: color } });
                }}
            ], { cancelable: false })
        }

        function ChangeTheme() {
            fetch(IPAddr + `update/users/theme/${username}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    theme: color,
                })
            })
            .then(async (respond) => {
                //console.log(respond.json())
                if (respond.status == 345) {
                    AlertError();
                }
                else {
                    AlertChangeThemeSuccess();
                }
            });
        }
    }

    return (
        <SafeAreaView>
            <Card>
                <Card.Title style={{fontSize: 35}}>HienneBank</Card.Title>
                <Card.Title style={{ fontWeight: "bold", fontSize: 25, textAlign: "center" }}>Thay đổi màu chủ đạo</Card.Title>
                <Card.Divider />
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Button size="sm" buttonStyle={{ backgroundColor: "pink" }} onPress={() => setColor("pink")}>Đặt lại</Button>
                    <View />
                </View>
                <View style={{paddingHorizontal: 20, marginTop: 20}}>
                    <ColorPicker onColorChangeComplete={ (color) => setColor(color) }/>
                </View>
            </Card>
            <View style={{ flexDirection: "row", marginTop: 300, alignSelf: "center" }}>
                <Button title="ĐỔI" disabled={ color == "" } onPress={() => onSubmitChangeTheme()} />
                <View style={{ paddingHorizontal: 30 }} />
                <Button title="HỦY" color="#E95552" onPress={() => { navigate("SettingsScreen") }}/>
            </View>
        </SafeAreaView>
    )
}