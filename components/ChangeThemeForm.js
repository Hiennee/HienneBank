import { Alert, View } from "react-native";
import { Card, Button } from "@rneui/themed";
import { useState } from "react";
import ColorPicker from "react-native-wheel-color-picker";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ChangeThemeForm(props)
{
    var [color, setColor] = useState("")
    var { navigate } = props.navigation
    //console.log(color);

    function onSubmitChangeTheme()
    {
        Alert.alert("THÔNG BÁO", "Bạn đã yêu cầu đổi màu chủ đạo của ứng dụng", [
            { text: "HỦY", onPress: () => {} },
            { text: "OK", onPress: () => ChangeTheme() },
        ], { cancelable: true, onDismiss: () => {} })

        function ChangeTheme() {
            navigate("Greetings");
            //navigate("LogInSignUp", { screen: "Login", params: { color: color } });
            //navigate("LogIn");
        }
    }

    return (
        <SafeAreaView>
            <Card>
                <Card.Title style={{fontSize: 35}}>HienneBank</Card.Title>
                <Card.Title style={{ fontWeight: "bold", fontSize: 25, textAlign: "center" }}>Thay đổi màu chủ đạo</Card.Title>
                <Card.Divider />
                <View style={{paddingHorizontal: 20, marginTop: 20}}>
                    <ColorPicker onColorChangeComplete={(color) => setColor(color)}/>
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