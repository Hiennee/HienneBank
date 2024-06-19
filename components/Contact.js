import { View, Text } from "react-native";
import { Card, Button } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Fontisto, FontAwesome5 } from "@expo/vector-icons";
import * as MailComposer from "expo-mail-composer";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Contact(props)
{
    var { navigate } = props.navigation
    function SendMail()
    {
        MailComposer.composeAsync({
            recipients: ["chanhien55@gmail.com"],
            subject: "[REQ] <Vấn đề của bạn>",
        })
    }
    return (
        <SafeAreaView>
            <View style={{flexDirection: "row"}}>
                <Button iconRight={true} type="clear" onPress={() => navigate("Home")}>
                    Trang chủ
                    <AntDesign name="arrowleft" color="#457EE5" size={24}/>
                </Button>
                <View />
            </View>
            <Card>
                <Card.Title style={{fontSize: 35}}>HienneBank</Card.Title>
                <Card.Title h4>Liên hệ với chúng tôi</Card.Title>
                <Card.Divider style={{marginBottom: 40}}/>
                <Text style={{marginBottom: 30}}>
                    <FontAwesome5 name="user-alt" size={24} color="black" />
                    {"\t"}Sư Phụ Mã
                </Text>
                <Text style={{marginBottom: 15}}>
                    <AntDesign name="phone" size={24} color="black" />
                    {"\t"}0902 522 036 {"\n"}
                </Text>
                <TouchableOpacity onPress={() => SendMail()}>
                    <Text style={{marginBottom: 30}}>
                        <Fontisto name="email" size={24} color="black" />
                        {"\t"}chanhien55@gmail.com
                    </Text>
                </TouchableOpacity>
                <Text style={{marginBottom: 15}}>
                    <AntDesign name="facebook-square" size={24} color="black" />
                    {"\t"}facebook.com/hihienne
                </Text>
            </Card>
        </SafeAreaView>
    )
}