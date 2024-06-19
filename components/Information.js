import { View, Text } from 'react-native';
import { Card, Avatar, Button } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons'
import Format from '../shared/CurrencyFormatter';

export default function Information(props)
{
    var { username, money, banknum, phonenum, avatarUri } = props.route.params;
    var { navigate } = props.navigation
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
                <View style={{flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5}}>
                    <Avatar size={60} rounded source={avatarUri == "" ? require('../assets/images/hienmc.png') : {uri: avatarUri}}/>
                    <View style={{flexDirection: "column", alignItems: "flex-start"}}>
                        <Card.Title style={{fontSize: 25, marginBottom: 5}}>{banknum}</Card.Title>
                        <Card.Title>{username}</Card.Title>
                    </View>
                </View>
                <Card.Title style={{fontSize: 18}}>THÔNG TIN TÀI KHOẢN</Card.Title>
                <Card.Divider />
                <View style={{marginBottom: 50}} />
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text>Tên tài khoản</Text>
                    <Text style={{fontSize: 15, fontWeight: "bold"}}>{username}</Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text>Số tài khoản</Text>
                    <Text style={{fontSize: 15, fontWeight: "bold"}}>{banknum}</Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text>Số điện thoại</Text>
                    <Text style={{fontSize: 15, fontWeight: "bold"}}>{phonenum}</Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginVertical: 10}}>
                    <Text>Số dư</Text>
                    <Text style={{fontSize: 15, fontWeight: "bold", color: "green"}}>{Format(money)}</Text>
                </View>
                <View style={{marginTop: 50}} />
            </Card>
        </SafeAreaView>
    )
}