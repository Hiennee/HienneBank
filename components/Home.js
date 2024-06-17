import { SafeAreaView, Text, View, ScrollView, Alert, TouchableOpacity } from "react-native"
import { Avatar, Divider, Input } from "@rneui/themed"
import { MaterialCommunityIcons, FontAwesome, FontAwesome6, Ionicons, Entypo } from '@expo/vector-icons';
import { useState, useEffect } from "react";
import { IPAddr } from "../shared/localIP";
import CurrencyFormatter from "../shared/CurrencyFormatter";

export default function Home(props)
{
    //console.log("from home", props.username, props.money)
    //tức là khi input thay đổi, <AddMoneyModal /> sẽ re-render -> nhưng vì AddMoneyModal là một component con của <Modal/> là một component con của <Home>
    //nên khi re-render là re-render <Home /> nên dữ liệu hiển thị của <AddMoneyModal /> cũng không còn.
    //Khác với <Register /> hay <Login />, khi re-render, dữ liệu được lưu ở chính state của <Register /> hay <Login /> nên sẽ hiển thị được
    //Còn khi thay đổi input trong <AddMoneyModal />, thực chất là dữ liệu (state) bên ngoài <Home /> thay đổi, chứ bản thân <AddMoneyModal />
    //không có dữ liệu từ state
    const { navigate } = props.navigation
    //console.log(props)
    var [money, setMoney] = useState(0.0);
    //console.log("Home")
    fetch(IPAddr + `money/${props.username}`)
    .then((respond) => respond.json())
    .then((data) => setMoney(Number(data.money)))
    .catch((err) => console.log(err))
    //backgroundColor: props?.color == "" ? "#F7BBCF" : props.color
    return (
        <SafeAreaView style={{backgroundColor: "#F7BBCF"}} flex={1}>
            <View style={{flexDirection: "row", marginTop: 40, justifyContent: "space-between"}}>
                <View />
                <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate("SettingsNavigator")}>
                    <Ionicons name="settings-sharp" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <Text style={{textAlign:"center", marginTop: 20, fontWeight: "bold", fontSize: 30}}>HienneBank</Text>
            <View style={{flexDirection: "row", paddingLeft: 50, marginTop: 50, paddingTop: 20, paddingBottom: 20, backgroundColor: "white", borderRadius: 25}}>
                <Avatar size={80} rounded source={require("../assets/images/hienmc.png")} iconStyle={{}}>
                    <Avatar.Accessory size={24} onPress={() => Alert.alert("Hihi", "Đẹp trai rồi ko cần đổi", 
                    [
                        {text: "OK", onPress: () => {}}
                    ])}/>
                </Avatar>
                <View style={{flexDirection: "column"}}>
                    <Text style ={{marginLeft: 20, fontWeight: "bold", fontSize: 20}}>{props.banknum}</Text>
                    <Text style ={{marginLeft: 20, fontWeight: "bold", fontSize: 20}}>{props.username}</Text>
                    <Text style={{marginLeft: 20, marginTop: 5, fontStyle: "italic"}}>Số dư: {CurrencyFormatter(money)}</Text>
                </View>
            </View>
            <Divider width={2} color="grey" inset insetType="middle" style={{ marginVertical: 20 }}/>
            <View style={{backgroundColor: "white", width: "100vh", height: "50vh", paddingHorizontal: 50, paddingBottom: 400, borderRadius: 25}}>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 50}}>
                    <View style={{flexDirection: "column", justifyContent: "center"}}>
                        <TouchableOpacity onPress={() => navigate("AddMoney", { username: props.username, banknum: props.banknum, money: money })}>
                            <MaterialCommunityIcons name="cash-plus" size={35} color="black" />
                        </TouchableOpacity>
                        <Text style={{marginLeft:-10}}>Nạp tiền</Text>
                    </View>
                    <View style={{flexDirection: "column", justifyContent: "center"}}>
                        <TouchableOpacity onPress={() => navigate("WithdrawMoney", { username: props.username, banknum: props.banknum,
                            money: money })}>
                            <MaterialCommunityIcons name="cash-minus" size={35} color="black" />
                        </TouchableOpacity>
                        <Text style={{marginLeft:-10}}>Rút tiền</Text>
                    </View>
                    <View style={{flexDirection: "column", justifyContent: "center" }}>
                        <TouchableOpacity>
                            <MaterialCommunityIcons name="piggy-bank" size={35} color="black" />
                        </TouchableOpacity>
                        <Text style={{marginLeft:-10}}>Đầu tư</Text>
                    </View>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 50}}>
                    <View style={{flexDirection: "column", justifyContent: "center"}}>
                        <TouchableOpacity onPress={() => navigate("TransferMoney", { username: props.username, banknum: props.banknum,
                            money: money })}>
                            <MaterialCommunityIcons name="cash-fast" size={35} color="black" />
                        </TouchableOpacity>
                        <Text style={{marginLeft:-10, fontSize: 10}}>Chuyển tiền</Text>
                    </View>
                    <View style={{flexDirection: "column", justifyContent: "center"}}>
                        <TouchableOpacity onPress={() => navigate("History", { username: props.username, money: money, 
                            banknum: props.banknum, phonenum: props.phonenum })}>
                            <MaterialCommunityIcons name="history" size={35} color="black" />
                        </TouchableOpacity>
                        <Text style={{marginLeft:-2}}>Lịch sử</Text>
                    </View>
                    <View style={{ flexDirection: "column", justifyContent: "center" }}>
                        <TouchableOpacity onPress={() => navigate("Information", { username: props.username, money: money, 
                            banknum: props.banknum, phonenum: props.phonenum })}>
                            <FontAwesome name="user-circle-o" size={35} color="black"/>
                        </TouchableOpacity>
                        <Text>Hồ sơ</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 50 }}>
                    <View style={{ flexDirection: "column", justifyContent: "center" }}>
                        <TouchableOpacity onPress={() => navigate("FAQ")}>
                            <FontAwesome name="question-circle-o" size={35} color="black" />
                        </TouchableOpacity>
                        <Text style={{marginLeft: -10}}>Hỏi đáp</Text>
                    </View>
                    <View style={{ flexDirection: "column", justifyContent: "center" }}>
                        <TouchableOpacity onPress={() => navigate("Contact")}>
                            <Entypo name="mail" size={25} color="black" />
                        </TouchableOpacity>
                        <Text style={{marginLeft: -10, marginTop: 5}}>Liên hệ</Text>
                    </View>
                    <View style={{flexDirection: "column", justifyContent: "center" }}>
                        <TouchableOpacity onPress={() => navigate("Greetings")}>
                            <FontAwesome6 name="door-open" size={35} color="black"/>
                        </TouchableOpacity>
                        <Text>Thoát</Text>
                    </View>
                </View>
            </View>
            
        </SafeAreaView>
    )
}


