import { useState } from "react";
import { View, Text, Alert, Modal } from "react-native";
import { Input, Button, Card } from "@rneui/themed";
import { IPAddr } from "../shared/localIP";
import { Picker } from '@react-native-picker/picker';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";

import replaceDate from "../shared/DateStringReplacer";
import Format from "../shared/CurrencyFormatter";

import * as Notifications from "expo-notifications"
//import { fetch } from "react-native-ssl-pinning";

export default function AddMoney(props) {
    const { navigate } = props.navigation

    var [moneyToAdd, setMoneyToAdd] = useState(0.0);
    var [moneySource, setMoneySource] = useState("");

    var [showSuccessModal, setShowSuccessModal] = useState(false);
    //var [date, setDate] = useState("");

    var date = new Date().toString();
    //Khi xài hooking, passing value giữa các props không có vấn đề, nhưng vấn đề của Hooking là hàm set async => dữ liệu không đồng nhất
    //vào thời điểm submit qua API.
    //Khi không xài hooking (sử dụng date, setDate tự tạo), dữ liệu đồng nhất vào các thời điểm submit qua API
    //nhưng passing value giữa các props xảy ra vấn đề.
    //var date = "hihi"
    function setDate(str) { date = str; }
    // const AlertAddMoneySuccess = () => {
    //     Alert.alert("Thông báo", "Đã nạp thành công " + moneyToAdd + "đ vào tài khoản " + props.route.params.username + " từ " + moneySource, [
    //         {text: "Nạp tiếp", onPress: () => {}},
    //         {text: "OK", onPress: () => navigate("Home")}
    //     ], {cancelable: true})
    // }
    async function Notify()
    {
        const req = await Notifications.requestPermissionsAsync();
        if (req.granted) {
            Notifications.setNotificationHandler({
                handleNotification: async () => ({shouldPlaySound: true, shouldSetBadge: true, shouldShowAlert: true})
            });
            Notifications.scheduleNotificationAsync({
                content: {
                    title: "HienneBank THÔNG BÁO BIẾN ĐỘNG SỐ DƯ",
                    body: `Tài khoản ${props.route.params.banknum} + ${Format(moneyToAdd)} vào lúc ${date} từ ${moneySource}`,
                    sound: true,
                    vibrate: true,
                },
                trigger: null,
            })
        }
    }
    const AlertAddMoneyFailed = () => {
        Alert.alert("Thông báo", "Xảy ra lỗi khi nạp tiền, vui lòng thử lại", [
            {text: "OK", onPress: () => {}}
        ], {cancelable: true})
    }

    function onSubmitAddMoney(username, source, money, date)
    {
        //console.log("date inside func", date);
        fetch(IPAddr + "money/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username.trim(),
                source: source,
                destination: username,
                destination_banknum: props.route.params.banknum,
                money: money,
                date: date,
            })
        })
        .then(async (respond) => {
            //console.log(respond.json());
            //AlertAddMoneySuccess();
            setShowSuccessModal(true);
        })
        .catch((err) => AlertAddMoneyFailed())
    }

    return (
        <SafeAreaView>
            <Card>
                <Card.Title style={{fontSize: 35}}>HienneBank</Card.Title>
                <Card.Title style={{ fontWeight: "bold", fontSize: 25, textAlign: "center" }}>Nạp tiền vào tài khoản</Card.Title>
                <Card.Title style={{ fontWeight: "bold", fontSize: 20, textAlign: "center" }}>{props.route.params.username}</Card.Title>
                <Card.Divider />
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text style={{fontWeight: "bold", fontSize: 15}}>Số tài khoản</Text>
                    <Text >{props.route.params.banknum}</Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text style={{fontWeight: "bold", fontSize: 15}}>Số dư</Text>
                    <Text style={{color: "green"}}>{Format(props.route.params.money)}</Text>
                </View>
            </Card>
            <View style={{flexDirection: "column", width: "100%", marginTop: 100}}>
                <Input placeholder="Nhập số tiền" keyboardType="numeric" onChangeText={(money) => {setMoneyToAdd(Number(money))}} 
                    leftIcon={<MaterialIcons name="attach-money" size={24} />}/>
                <View style={{flexDirection: "row", paddingLeft: 30}}>
                    <FontAwesome name="bank" size={24} color="black" style={{ marginLeft: -20 }}/>
                    <Text style={{color: "#565656"}}> Chọn ngân hàng</Text>
                    <Picker style={{width: 200, marginTop: -18}} selectedValue={moneySource} onValueChange={(src, idx) => setMoneySource(src)}>
                        <Picker.Item label="ACB" value="ACB" />
                        <Picker.Item label="Vietcombank" value="Vietcombank" />
                        <Picker.Item label="TPBank" value="TPBank" />
                        <Picker.Item label="BIDV" value="BIDV" />
                        <Picker.Item label="TechcomBank" value="TechcomBank" />
                    </Picker>
                </View>
            </View>
            <View style={{flexDirection: "row", marginTop: 50, alignSelf: "center"}}>
                <Button title="NẠP" disabled={ moneyToAdd == "" || moneySource == "" } onPress={() => {
                    //console.log("date", replaceDate(new Date().toString().replace(" GMT+0700", "")))
                    //console.log("before ", date)
                    setDate(replaceDate(new Date().toString()));
                    // o day ne cuu'
                    //console.log("after ", date)
                    onSubmitAddMoney(props.route.params.username, moneySource, moneyToAdd, date);
                    Notify();
                }} />
                <View style={{paddingHorizontal: 30}} />
                <Button title="HỦY" color="#E95552" onPress={() => {
                    setMoneyToAdd(0.0);
                    setMoneySource("");
                    setDate("");
                    navigate("Home")}}/>
            </View>
                <Modal visible={showSuccessModal} onRequestClose={ () => setShowSuccessModal(false) }>
                        <AddMoneySuccessModal date = {date} moneyToAdd = {moneyToAdd} username = {props.route.params.username}
                            banknum = {props.route.params.banknum} destination = {moneySource}
                            onOk = { () => { navigate("Home") } } onNext = { () => { setShowSuccessModal(false) } }/>
                </Modal>
        </SafeAreaView>
    )
}

function AddMoneySuccessModal(props)
{
    //console.log("In Modal: ", props.date)
    return (
        <View>
            <Card>
                <Card.Title style={{fontSize: 35}}>HienneBank</Card.Title>
                <Card.Title style={{fontSize: 20}}>Nạp tiền thành công</Card.Title>
                <AntDesign style={{alignSelf: "center", marginBottom: 10}}name="checkcircle" size={40} color="green" />
                <Card.Title style={{fontSize: 25, color: "green"}}>{Format(props.moneyToAdd)}</Card.Title>
                <Card.Title>{replaceDate(props.date)}</Card.Title>
                <Card.Divider />
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text>Tên người nhận</Text>
                    <Text style={{fontSize: 15, fontWeight: "bold"}}>{props.username}</Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text>Tài khoản nhận</Text>
                    <Text style={{fontSize: 15, fontWeight: "bold"}}>{props.banknum}</Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text>Từ ngân hàng</Text>
                    <Text style={{fontSize: 15, fontWeight: "bold"}}>{props.destination}</Text>
                </View>
            </Card>
            <Button containerStyle={{marginHorizontal: 15, marginBottom: 20, marginTop: 80}}
                buttonStyle={{borderRadius: 15, backgroundColor: "green"}} onPress={() => {props.onOk()}} title="Đồng ý"/>
            <Button containerStyle={{marginHorizontal: 15, marginVertical: 0}}
                buttonStyle={{borderRadius: 15, backgroundColor: "green"}} onPress={() => {props.onNext()}}title="Thực hiện giao dịch mới"/>
        </View>
    )
}