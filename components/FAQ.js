import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import { Button, Card } from '@rneui/themed';
import { AntDesign, Ionicons, Fontisto, FontAwesome5 } from '@expo/vector-icons';
import { ScrollView } from 'react-native-virtualized-view';

export default function FAQ(props)
{
    var { navigate } = props.navigation;
    var FAQ =
    [
        {
            question: "Tôi muốn thay đổi mật khẩu",
            question_type: "Password change",
        },
        {
            question: "Tôi muốn thay đổi số tài khoản",
            question_type: "Account number change",
        },
        {
            question: "Tôi muốn thay đổi ảnh đại diện",
            question_type: "Avatar change",
        },
        {
            question: "Tôi không chuyển tiền cho tài khoản X được",
            question_type: "Unable to transfer money",
        },
        {
            question: "Tôi không thể rút tiền về tài khoản của mình",
            question_type: "Unable to withdraw money",
        },
        {
            question: "Tôi không thể nạp tiền từ tài khoản ngân hàng khác",
            question_type: "Unable to add money",
        },
        {
            question: "Về chúng tôi",
            question_type: "About HienneBank",
        },
    ]
    return (
        <ScrollView style={{backgroundColor: "#e7e4e42d", flex: 1}}>
            <SafeAreaView>
                <View style={{flexDirection: "row"}}>
                    <Button iconRight={true} type="clear" onPress={() => navigate("Home")}>
                        Trang chủ
                        <AntDesign name="arrowleft" color="#457EE5" size={24}/>
                    </Button>
                    <View />
                </View>
                <Card>
                    <Card.Title style={{textAlign: "center", fontWeight: "bold", fontSize: 20, marginTop: 30, marginBottom: 50}}>NHỮNG CÂU HỎI THƯỜNG GẶP</Card.Title>
                    <FlatList data={FAQ} renderItem={({item, index}) => <RenderFAQ item={{...item, index: index}}/>} />
                </Card>
            </SafeAreaView>
        </ScrollView>
    )
}

function RenderFAQ(props)
{
    var { index, question, question_type } = props.item;
    var [showExpand, setShowExpand] = useState(false);
    var color = (index % 2 == 1) ? "#e7e4e42d": "white";
    //console.log(props.item.index)
    return (
        <View>
            <TouchableOpacity style={{backgroundColor: color,
            paddingVertical: 20, display: "flex"}}
            onPress={() => {setShowExpand(!showExpand)}}>
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row", display: "flex", width: "80%"}}>
                        <Text style={{ fontSize: 16 }}>{index+1}.  </Text>
                        <Text style={{ fontSize: 16, fontStyle: "italic" }}>{question}</Text>
                    </View>
                    {showExpand ? <AntDesign name="up" size={24} color="black" />
                    : <AntDesign name="down" size={24} color="black" /> }
                </View>
            </TouchableOpacity>
            {showExpand ? <Expander question_type = {question_type} color = {color}/> : <View />}
        </View>
    )
    function Expander(props)
    {
        var { question_type, color } = props;
        switch (question_type)
        {
            case "Password change":
                return (
                    <View style={{paddingVertical: 20, paddingHorizontal: 30, backgroundColor: color}}>
                        <Text>Để thay đổi mật khẩu, hãy vào {"\n"}
                        <AntDesign name="home" size={14} color="black" />Trang chủ - 
                        <Ionicons name="settings-sharp" size={14} color="black" /> Cài đặt - Đổi mật khẩu</Text>
                    </View>
                )
            case "Account number change":
                return (
                    <View style={{paddingVertical: 20, paddingHorizontal: 30, backgroundColor: color}}>
                        <Text>Để thay đổi số tài khoản, hãy vào{"\n"}
                        <AntDesign name="home" size={14} color="black" />Trang chủ - 
                        <Ionicons name="settings-sharp" size={14} color="black" /> Cài đặt - Đổi số tài khoản</Text>
                    </View>
                )
            case "Avatar change":
                return (
                    <View style={{paddingVertical: 20, paddingHorizontal: 30, backgroundColor: color}}>
                        <Text>Để thay đổi ảnh đại diện, hãy vào{"\n"}
                        <AntDesign name="home" size={14} color="black" />Trang chủ - 
                        Nhấn vào ảnh đại diện</Text>
                    </View>
                )
            case "Unable to transfer money":
                return (
                    <View style={{paddingVertical: 20, paddingHorizontal: 30, backgroundColor: color}}>
                        <Text>Nếu gặp vấn đề khi chuyển tiền, hãy kiểm tra tài khoản thụ hưởng có tồn tại không, hoặc 
                            Liên hệ CSKH để được hỗ trợ
                        </Text>
                    </View>
                )
            case "Unable to withdraw money":
                return (
                    <View style={{paddingVertical: 20, paddingHorizontal: 30, backgroundColor: color}}>
                        <Text>Nếu gặp vấn đề khi rút tiền, hãy kiểm tra tài khoản có đủ tiền để rút không, hoặc
                            Liên hệ CSKH để được hỗ trợ
                        </Text>
                    </View>
                )
            case "Unable to add money":
                return (
                    <View style={{paddingVertical: 20, paddingHorizontal: 30, backgroundColor: color}}>
                        <Text>Nếu gặp vấn đề khi nạp tiền, hãy kiểm tra tài khoản nguồn có đủ tiền để nạp không, hoặc
                            Liên hệ CSKH để được hỗ trợ
                        </Text>
                    </View>
                )
            case "About HienneBank":
                return (
                    <View style={{paddingVertical: 20, paddingHorizontal: 30, backgroundColor: color}}>
                        <Text>HienneBank được thành lập vào năm 2024{"\n\n"}
                            <FontAwesome5 name="user-alt" size={24} color="black" />Sư Phụ Mã {"\n"}
                            <AntDesign name="phone" size={24} color="black" /> 0902 522 036 {"\n"}
                            <Fontisto name="email" size={24} color="black" /> chanhien55@gmail.com
                        </Text>
                    </View>
                )
        }
    }
}