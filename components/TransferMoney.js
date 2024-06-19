import { useState } from 'react'
import { View, Text, Alert, Modal } from 'react-native'
import { Input, Button, Card } from '@rneui/themed'
import { IPAddr } from '../shared/localIP';
import { AntDesign, MaterialIcons, FontAwesome6 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import replaceDate from '../shared/DateStringReplacer';
import Format from "../shared/CurrencyFormatter";

import * as Notifications from "expo-notifications"

export default function TransferMoney(props) {
    const { navigate } = props.navigation

    var [moneyToTransfer, setMoneyToTransfer] = useState(0.0);
    var [moneyDestination, setMoneyDestination] = useState("");
    var [banknumDestination, setBanknumDestination] = useState("");
    var [description, setDescription] = useState("");
    var [showSuccessModal, setShowSuccessModal] = useState(false);

    //var [date, setDate] = useState("");
    var date = new Date().toString();
    function setDate(str) { date = str; }
    
    // const AlertTransferMoneySuccess = () => {
    //     Alert.alert("Thông báo", "Đã chuyển thành công " + moneyToTransfer + " từ " + props.route.params.username + " đến " + moneyDestination,
    //     [
    //         {text: "Chuyển tiếp", onPress: () => {}},
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
                    body: `Tài khoản ${props.route.params.banknum} - ${Format(moneyToTransfer)} vào lúc ${date} đến ${moneyDestination}`,
                    sound: true,
                    vibrate: true,
                },
                trigger: null,
            })
        }
    }

    const AlertNotEnoughMoney = () => {
        Alert.alert("Thông báo", "Không đủ tiền để chuyển\nTài khoản: " + Format(props.route.params.money) + "\nSố tiền chuyển: " + Format(moneyToTransfer),
        [
            {text: "OK", onPress: () => {}}
        ], {cancelable: true})
    }

    const AlertInvalidDestination = () => {
        Alert.alert("Thông báo", "Tài khoản " + moneyDestination + " không tồn tại", [
            { text: "OK", onPress: () => {} }
        ], {cancelable: true})
    }

    const AlertSameDestination = () => {
        Alert.alert("Thông báo", "Không thể chuyển và nhận cùng một tài khoản", [
            { text: "OK", onPress: () => {} }
        ], {cancelable: true})
    }

    const AlertTransferMoneyFailed = () => {
        Alert.alert("Thông báo", "Xảy ra lỗi khi chuyển tiền, vui lòng thử lại", [
            { text: "OK", onPress: () => {} }
        ], {cancelable: true})
    }

    function onSubmitTransferMoney(username, destination, money, date, description)
    {
        var destination = destination.trim().toUpperCase();
        //console.log(destination);
        var username = username.trim().toUpperCase();
        if (destination == username) {
            AlertSameDestination();
            return;
        }
        if (money > Number(props.route.params.money)) {
            AlertNotEnoughMoney();
            return;
        }
        //console.log(username, destination, money)
        fetch(IPAddr + "money/transfer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                source: username,
                source_banknum: props.route.params.banknum,
                destination: destination,
                destination_banknum: banknumDestination,
                money: money,
                date: date,
                description: description,
            })
        })
        .then(async (respond) => {
            fetch(IPAddr + `banknum/${destination}`)
            .then((respond) => respond.json())
            .then((data) => setBanknumDestination(data.banknum))
            .catch((err) => console.log(err))
            //console.log(respond.json());
            //console.log(respond.status)
            if (respond.status == 345) {
                throw Error();
            }
            else if (respond.status == 346) {
                AlertInvalidDestination();
            }
            else {
                setShowSuccessModal(true);
            }
        })
        .catch((err) => AlertTransferMoneyFailed())
    }

    return (
        <SafeAreaView style={{ justifyContent: "center", alignItems: "center" }}>
            <Card>
                <Card.Title style={{ fontSize: 35} }>HienneBank</Card.Title>
                <Card.Title style={{ fontSize: 25, textAlign: "center"}}>Chuyển tiền từ tài khoản</Card.Title>
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
            <View style={{ marginTop: 70 }}/>
            <Input placeholder='Nhập người nhận...' value={moneyDestination} onChangeText={(destination) => setMoneyDestination(destination.toUpperCase()) } 
                leftIcon={<AntDesign name="user" size={24} />}/>
            <Input placeholder="Nhập số tiền" keyboardType="numeric" onChangeText={(money) => {setMoneyToTransfer(Number(money))}} 
                leftIcon={<MaterialIcons name="attach-money" size={24} />}/>
            <Input placeholder='Nhập nội dung chuyển khoản...' onChangeText={(description) => setDescription(description) } 
                leftIcon={<MaterialIcons name="abc" size={24} />}/>
            <View style={{flexDirection: "row", marginTop: 30}}>
                <Button title="CHUYỂN" disabled={moneyToTransfer == "" || moneyDestination == ""} onPress={() => {
                    setDate(replaceDate(new Date().toString()));
                    onSubmitTransferMoney(props.route.params.username, moneyDestination, moneyToTransfer, date, description);
                    Notify();
                }}/>
                <View style={{paddingHorizontal: 30}} />
                <Button title="HỦY" color="#E95552" onPress={() => {
                    setMoneyToTransfer(0.0);
                    setMoneyDestination("");
                    navigate("Home")}}/>
            </View>
            <Modal visible={showSuccessModal} onRequestClose={() => setShowSuccessModal(false)}>
                    <TransferMoneySuccessModal date = {date} moneyToTransfer = {moneyToTransfer} username = {props.route.params.username}
                        banknumSource = {props.route.params.banknum} destination = {moneyDestination} banknumDestination = {banknumDestination}
                        description = {description} onOk = {() => {navigate("Home")}} onNext = {() => {setShowSuccessModal(false)}}/>
            </Modal>
        </SafeAreaView>
    )
}

function TransferMoneySuccessModal(props)
{
    return (
        <View>
            <Card>
                <Card.Title style={{fontSize: 35}}>HienneBank</Card.Title>
                <Card.Title style={{fontSize: 20}}>Chuyển tiền thành công</Card.Title>
                <AntDesign style={{alignSelf: "center", marginBottom: 10}}name="checkcircle" size={40} color="green" />
                <Card.Title style={{fontSize: 25, color: "green"}}>{Format(props.moneyToTransfer)}</Card.Title>
                <Card.Title>{replaceDate(props.date)}</Card.Title>
                <Card.Divider />
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text>Tên người chuyển</Text>
                    <Text style={{fontSize: 15, fontWeight: "bold"}}>{props.username}</Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text>Tài khoản chuyển</Text>
                    <Text style={{fontSize: 15, fontWeight: "bold"}}>{props.banknumSource}</Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text>Từ ngân hàng</Text>
                    <Text style={{fontSize: 15, fontWeight: "bold"}}>HienneBank</Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text>Tên người thụ hưởng</Text>
                    <Text style={{fontSize: 15, fontWeight: "bold"}}>{props.destination}</Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text>Tài khoản thụ hưởng</Text>
                    <Text style={{fontSize: 15, fontWeight: "bold"}}>{props.banknumDestination}</Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text>Nội dung</Text>
                    <Text style={{fontSize: 15, fontWeight: "bold"}}>{props.description}</Text>
                </View>
            </Card>
            <Button containerStyle={{marginHorizontal: 15, marginBottom: 20, marginTop: 80}}
                buttonStyle={{borderRadius: 15, backgroundColor: "green"}} onPress={() => {props.onOk()}} title="Đồng ý"/>
            <Button containerStyle={{marginHorizontal: 15, marginVertical: 0}}
                buttonStyle={{borderRadius: 15, backgroundColor: "green"}} onPress={() => {props.onNext()}}title="Thực hiện giao dịch mới"/>
        </View>
    )
}