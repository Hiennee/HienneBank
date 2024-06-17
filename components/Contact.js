import { View, Text } from "react-native";
import { Card } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Fontisto, FontAwesome5 } from "@expo/vector-icons";
import * as MailComposer from "expo-mail-composer";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Contact(props)
{
    function SendMail()
    {
        MailComposer.composeAsync({
            recipients: ["chanhien55@gmail.com"],
            subject: "[REQ] <Vấn đề của bạn>",
        })
    }
    return (
        <SafeAreaView>
            <Card>
                <Card.Title style={{fontSize: 35}}>HienneBank</Card.Title>
                <Card.Title h4>Liên hệ với chúng tôi</Card.Title>
                <Card.Divider style={{marginBottom: 40}}/>
                <Text style={{marginBottom: 30}}>
                    <FontAwesome5 name="user-alt" size={24} color="black" />
                    {"\t"}CEO: Mã Chấn Hiền
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