import { View, Text, SafeAreaView, Button } from 'react-native'
//import { fetch } from 'react-native-ssl-pinning'
import { IPAddr } from '../shared/localIP'
export default function Greetings(props)
{
    const { navigate } = props.navigation
    return (
        <SafeAreaView style={{backgroundColor: "#e7e4e42d", height: "100vh", width: "100vh"}}>
            <Text style={{fontSize: 50, fontWeight:"bold", textAlign: "center", paddingTop: 200}}>HienneBank</Text>
            <Text style={{fontSize: 30, fontWeight:"light", textAlign: "center", paddingTop: 20}}>Ứng dụng ngân hàng</Text>
            <Text style={{fontSize: 30, fontWeight:"light", textAlign: "center", marginBottom: 50}}>hàng đầu Quận 8</Text>
            <View style ={{flexDirection: "row", justifyContent: "center"}}>
                <Button title = "Đăng ký" style = {{backgroundColor: "orange"}} onPress={() => navigate("Register")}/>
                <View style ={{paddingHorizontal: 20}}/>
                <Button title = "Đăng nhập" style = {{backgroundColor: "yellow"}} onPress={() => navigate("Login")}/>
            </View>
        </SafeAreaView>
    )
}