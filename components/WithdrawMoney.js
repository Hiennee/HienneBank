import { useState } from 'react';
import { View, Text, Alert, Modal } from 'react-native';
import { Input, Button, Card } from '@rneui/themed';
import { IPAddr } from '../shared/IP';
import { Picker } from '@react-native-picker/picker';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import replaceDate from '../shared/DateStringReplacer';
import Format from "../shared/CurrencyFormatter";

import * as Notifications from "expo-notifications";

export default function WithdrawMoney(props) {
    const { navigate } = props.navigation

    var [moneyToWithdraw, setMoneyToWithdraw] = useState(0.0);
    var [moneyDestination, setMoneyDestination] = useState("");
    
    var [showSuccessModal, setShowSuccessModal] = useState(false);
    //var [date, setDate] = useState("");
    var date = new Date().toString();
    function setDate(str) { date = str; }
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
                    body: `Tài khoản ${props.route.params.banknum} - ${Format(moneyToWithdraw)} vào lúc ${date} đến ${moneyDestination}`,
                    sound: true,
                    vibrate: true,
                },
                trigger: null,
            })
        }
    }
    // const AlertWithdrawMoneySuccess = () => {
    //     Alert.alert("Thông báo", "Đã rút thành công " + moneyToWithdraw + "đ về " + moneyDestination, [
    //         {text: "Rút tiếp", onPress: () => {}},
    //         {text: "OK", onPress: () => navigate("Home")}
    //     ], {cancelable: true})
    // }
    const AlertNotEnoughMoney = () => {
        Alert.alert("Thông báo", "Không đủ tiền để rút\nTài khoản: " + Format(props.route.params.money) + "\nSố tiền rút: " + Format(moneyToWithdraw),
        [
            {text: "OK", onPress: () => {}}
        ], {cancelable: true})
    }

    const AlertInvalidMoney = () => {
        Alert.alert("Thông báo", "Số tiền phải lớn hơn 1.000đ", [
            { text: "OK" }
        ], { cancelable: true })
    }

    const AlertWithdrawMoneyFailed = () => {
        Alert.alert("Thông báo", "Xảy ra lỗi khi rút tiền, vui lòng thử lại", [
            {text: "OK", onPress: () => {}}
        ], {cancelable: true})
    }

    function onSubmitWithdrawMoney(username, destination, money, date)
    {
        if (money > Number(props.route.params.money)) {
            AlertNotEnoughMoney();
            return;
        }
        if (money < 1000) {
            AlertInvalidMoney();
            return;
        }
        //console.log(username, destination, money)
        fetch(IPAddr + "money/withdraw", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username.trim(),
                source: username,
                source_banknum: props.route.params.banknum,
                destination: destination,
                destination_banknum: destination,
                money: money,
                date: date,
            })
        })
        .then(async (respond) => {
            //console.log(respond.json());
            setShowSuccessModal(true);
            Notify();
        })
        .catch((err) => AlertWithdrawMoneyFailed())
    }

    return (
        <SafeAreaView>
            <Card>
                <Card.Title style={{fontSize: 35}}>HienneBank</Card.Title>
                <Card.Title style={{ fontWeight: "bold", fontSize: 25, textAlign: "center" }}>Rút tiền từ tài khoản</Card.Title>
                <Card.Title style={{ fontWeight: "bold", fontSize: 20, textAlign: "center" }}>{props.route.params.username}</Card.Title>
                <Card.Divider />
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15 }}>Số tài khoản</Text>
                    <Text>{ props.route.params.banknum }</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15 }}>Số dư</Text>
                    <Text style={{ color: "green"}}>{Format(props.route.params.money) }</Text>
                </View>
            </Card>
            <View style={{ flexDirection: "column", width: "100%", marginTop: 100 }}>
                <Input placeholder="Nhập số tiền" keyboardType="numeric" onChangeText={ (money) => { setMoneyToWithdraw(Number(money)) } } 
                    leftIcon={<MaterialIcons name="attach-money" size={24} />}/>
                <View style={{ flexDirection: "row", paddingLeft: 30 }}>
                    <FontAwesome name="bank" size={24} color="black" style={{ marginLeft: -20 }}/>
                    <Text style={{color: "#565656"}}>Chọn ngân hàng</Text>
                    <Picker style={{width: 200, marginTop: -18 }} selectedValue={ moneyDestination }
                    onValueChange={ (src, idx) => setMoneyDestination(src) }>
                        <Picker.Item label="ACB" value="ACB" />
                        <Picker.Item label="Vietcombank" value="Vietcombank" />
                        <Picker.Item label="TPBank" value="TPBank" />
                        <Picker.Item label="BIDV" value="BIDV" />
                        <Picker.Item label="TechcomBank" value="TechcomBank" />
                    </Picker>
                </View>
            </View>
            <View style={{ flexDirection: "row", marginTop: 50, alignSelf: "center" }}>
                <Button title="NẠP" disabled={moneyToWithdraw == "" || moneyDestination == ""} onPress={() => {
                    //console.log("date", replaceDate(new Date().toString().replace(" GMT+0700", "")))
                    setDate(replaceDate(new Date().toString()));
                    onSubmitWithdrawMoney(props.route.params.username, moneyDestination, moneyToWithdraw, date);
                    //Notify();
                }} />
                <View style={{ paddingHorizontal: 30 }} />
                <Button title="HỦY" color="#E95552" onPress={() => {
                    setMoneyToWithdraw(0.0);
                    setMoneyDestination("");
                    setDate("");
                    navigate("Home")}}/>
            </View>
                <Modal visible={showSuccessModal} onRequestClose={() => setShowSuccessModal(false)}>
                        <WithdrawMoneySuccessModal date = { date } moneyToWithdraw = { moneyToWithdraw } username = { props.route.params.username }
                            banknum = { props.route.params.banknum } destination = { moneyDestination }
                            onOk = { () => { navigate("Home") } } onNext = { () => { setShowSuccessModal(false) } }/>
                </Modal>
        </SafeAreaView>
    )
}

function WithdrawMoneySuccessModal(props)
{
    return (
        <View>
            <Card>
                <Card.Title style={{fontSize: 35}}>HienneBank</Card.Title>
                <Card.Title style={{fontSize: 20}}>Rút tiền thành công</Card.Title>
                <AntDesign style={{alignSelf: "center", marginBottom: 10}}name="checkcircle" size={40} color="green" />
                <Card.Title style={{fontSize: 25, color: "green"}}>{Format(props.moneyToWithdraw)}</Card.Title>
                <Card.Title>{replaceDate(props.date)}</Card.Title>
                <Card.Divider />
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text>Tên người rút</Text>
                    <Text style={{fontSize: 15, fontWeight: "bold"}}>{props.username}</Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text>Tài khoản rút</Text>
                    <Text style={{fontSize: 15, fontWeight: "bold"}}>{props.banknum}</Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text>Về ngân hàng</Text>
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