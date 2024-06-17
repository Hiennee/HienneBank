import { View, Text, TouchableOpacity, Alert, } from 'react-native';
import { Card, Input, Button } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import { useState } from 'react';
import { AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { IPAddr } from '../shared/localIP';

export default function Settings(props)
{
    //console.log(props)
    //console.log(props.username)
    var { navigate } = props.navigation
    //console.log(props.navigation.state.routes.length);
    var SettingsOptions = [
        {
            option: "Thay đổi tên đăng nhập",
            option_type: "Name change",
            defaultValue: props.username,
            icon: <MaterialIcons name="abc" size={24} color="black" />,
            action: () => navigate("ChangeName", { username: props.username, phonenum: props.phonenum, banknum: props.banknum }),
        },
        {
            option: "Thay đổi mật khẩu",
            option_type: "Password change",
            defaultValue: "******",
            icon: <MaterialIcons name="password" size={20} color="black" />,
            action: () => navigate("ChangePassword", { username: props.username, phonenum: props.phonenum,
                banknum: props.banknum, password: props.password }),
        },
        {
            option: "Thay đổi số tài khoản",
            option_type: "Account number change",
            defaultValue: props.banknum,
            icon: <MaterialIcons name="123" size={24} color="black" />,
            action: () => navigate("ChangeAccountNumber", { username: props.username, phonenum: props.phonenum, banknum: props.banknum }),
        },
        {
            option: "Thay đổi số điện thoại",
            option_type: "Phone change",
            defaultValue: props.phonenum,
            icon: <AntDesign name="phone" size={24} color="black" />,
            action: () => navigate("ChangePhoneNumber", { username: props.username, phonenum: props.phonenum, banknum: props.banknum }),
        },
        {
            option: "Thay đổi màu chủ đạo",
            option_type: "Theme change",
            defaultValue: "",
            icon: <Ionicons name="color-palette-outline" size={24} color="black" />,
            action: () => {}//navigate("ChangeTheme", { username: props.username, phonenum: props.phonenum, banknum: props.banknum })
        }
    ]
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
                <Card.Title h4>Cài đặt</Card.Title>
                <Card.Divider />
                <FlatList data={SettingsOptions} renderItem={({ item, index }) => <RenderSettingsOption item={{...item, index: index}}/> }/>
            </Card>
        </SafeAreaView>
    )
}

function RenderSettingsOption(props)
{
    //console.log(props)
    var { option, index, action, defaultValue, icon } = props.item
    var color = (index % 2 == 1) ? "#e7e4e42d": "white";
    return (
        <View>
            <TouchableOpacity style={{backgroundColor: color,
            paddingVertical: 20, display: "flex"}}
            onPress={() => action()}>
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row"}}>
                        {icon}
                        <Text style={{fontStyle: "italic", fontSize: 16}}>{option}</Text>
                    </View>
                    <Text>{defaultValue}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}