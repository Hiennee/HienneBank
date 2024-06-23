import { SafeAreaView, View, Text, FlatList, Modal } from "react-native";
import { Card, ListItem, Button } from '@rneui/themed'
import { IPAddr } from "../shared/localIP";
import { useState, useEffect } from "react"
import { MaterialCommunityIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-virtualized-view'

import CurrencyFormatter from "../shared/CurrencyFormatter";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function History(props)
{
    var [histories, setHistories] = useState([]);
    var { navigate } = props.navigation

    useEffect(() => {
        fetch(IPAddr + `history/${props.route.params.username}`)
        .then((respond) => respond.json())
        .then((data) => setHistories(data))
        .catch((err) => console.log(err))
        //console.log(histories)
    }, [])

    //console.log(props)
    return (
        <ScrollView style={{marginTop: 50}}>
            <View style={{flexDirection: "row"}}>
                <Button iconRight={true} type="clear" onPress={() => navigate("Home")}>
                    Trang chủ
                    <AntDesign name="arrowleft" color="#457EE5" size={24}/>
                </Button>
                <View />
            </View>
            <Card containerStyle={{height: "auto"}}>
                <Card.Title style={{fontSize: 35}}>HienneBank</Card.Title>
                <Card.Title style={{fontSize: 25, marginBottom: 5}}>{props.route.params.banknum}</Card.Title>
                <Card.Title>{props.route.params.username}</Card.Title>
                <Card.Divider />
                <Card.Title style={{fontSize: 18}}>LỊCH SỬ GIAO DỊCH</Card.Title>
                <FlatList data={histories}
                renderItem={({item, index}) => <RenderHistory item = {item}/>} />
                {/* Nếu syntax là function (RenderHistory(item)) thì sẽ báo lỗi invalid hook call 
                    (sử dụng useState trong function không phải Component)
                    Nhưng nếu syntax là một React Component (<RenderHistory item={item}/>) thì không lỗi 
                    (lúc này component mới được xem là React Component)*/}
            </Card>
        </ScrollView>
    )
}

function RenderHistory(props)
{
    var [showHistoryDetailModal, setShowHistoryDetailModal] = useState(false)
    //var [ showHistoryDetailModal, setShowHistoryDetailModal ] = useState(false)
    var { action, source, destination, money, remainmoney, date, description } = props.item
    //console.log(item)
    return (
       <TouchableOpacity>
            <ListItem style={{borderColor: action == "ADD" ? "green" : "red", borderWidth: 2, borderRadius: 0,
            marginTop: 30, justifyContent: "space-between"}} onPress={() => setShowHistoryDetailModal(true)}>
                <View style={{ flexDirection: "row" }}>
                    {action == "ADD" ? <Ionicons style={{ marginTop: 20, marginRight: 20 }} name="add-circle-outline" size={45} color="green" /> : 
                    <MaterialCommunityIcons style={{marginTop: 20, marginRight: 20 }} name="minus-circle-outline" size={45} color="red" />}
                    <View>
                        <Text style={{fontStyle: "italic", fontSize: 11}}>{date}</Text>
                        <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                            <Text>Từ: {source}</Text>
                            <Text>Đến: {destination}</Text>
                        </View>
                        <Text style={{color: action == "ADD" ? "green" : "red"}}>Số tiền: {action == "ADD" ? "+ " : "- "}{CurrencyFormatter(money)}</Text>
                        {action == "ADD" ? <Text style={{color: "green"}}>Số dư: {CurrencyFormatter(remainmoney)}</Text>:
                        <Text style={{color: "red"}}>Còn lại: {CurrencyFormatter(remainmoney)}</Text>}
                    </View>
                </View>
            </ListItem>
            <Modal visible={showHistoryDetailModal} onRequestClose={() => setShowHistoryDetailModal(false)}>
                <DetailedHistory item={props.item} />
            </Modal>
       </TouchableOpacity>
    )

    function DetailedHistory(props)
    {
        var { action, source, source_banknum, destination, destination_banknum, money, remainmoney, date } = props.item;

        const isAddedFromBank = (source) =>
        {
            if (source == "BIDV" || source.toLowerCase().endsWith("bank"))
                return true;
            return false;
        }

        const isWithdrawnToBank = (destination) =>
        {
            if (destination == "BIDV" || destination.toLowerCase().endsWith("bank"))
                return true;
            return false;
        }

        const isAddedFromUser = (action, source) =>
        {
            if (action == "ADD" && source != "BIDV" && !source.toLowerCase().endsWith("bank"))
                return true;
            return false;
        }

        if (isAddedFromBank(source))
        return (
            <SafeAreaView>
                <View style={{flexDirection: "row"}}>
                    <Button iconRight={true} type="clear" onPress={() => setShowHistoryDetailModal(false)}>
                        Lịch sử giao dịch
                        <AntDesign name="arrowleft" size={24}/>
                    </Button>
                    <View />
                </View>
                <Card>
                    <Card.Title style={{fontSize: 20}}>CHI TIẾT GIAO DỊCH</Card.Title>
                    <AntDesign style={{alignSelf: "center", marginBottom: 10}}name="checkcircle" size={40} color="green" />
                    <Card.Title>Giao dịch thành công</Card.Title>
                    <Card.Divider />
                    <Card.Title style={{fontStyle: "italic"}}>{date}</Card.Title>
                    <View style={{marginBottom: 30}}/>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text>Tên người thực hiện</Text>
                        <Card.Title>{destination}</Card.Title>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text>Tài khoản thực hiện</Text>
                        <Card.Title>{destination_banknum}</Card.Title>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text>Từ ngân hàng</Text>
                        <Card.Title>{source}</Card.Title>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text>Số tiền</Text>
                        <Card.Title style={{color: "green"}}>+ {CurrencyFormatter(money)}</Card.Title>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text>Số dư</Text>
                        <Card.Title style={{color: "green"}}>{CurrencyFormatter(remainmoney)}</Card.Title>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text>Nội dung</Text>
                        <Card.Title style={{fontSize: 11}}>{description}</Card.Title>
                    </View>
                </Card>
            </SafeAreaView>
        )
        
        if (isWithdrawnToBank(destination))
        return (
            <SafeAreaView>
                <View style={{flexDirection: "row"}}>
                    <Button iconRight={true} type="clear" onPress={() => setShowHistoryDetailModal(false)}>
                        Lịch sử giao dịch
                        <AntDesign name="arrowleft" size={24}/>
                    </Button>
                    <View />
                </View>
                <Card>
                    <Card.Title style={{fontSize: 20}}>CHI TIẾT GIAO DỊCH</Card.Title>
                    <AntDesign style={{alignSelf: "center", marginBottom: 10}}name="checkcircle" size={40} color="green" />
                    <Card.Title>Giao dịch thành công</Card.Title>
                    <Card.Divider />
                    {/* cái này cần fix */}
                    <Card.Title style={{fontStyle: "italic"}}>{date != "" ? date : (new Date).toString()}</Card.Title> 
                    <View style={{marginBottom: 30}}/>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text>Tên người thực hiện</Text>
                        <Card.Title>{source}</Card.Title>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text>Tài khoản thực hiện</Text>
                        <Card.Title>{source_banknum}</Card.Title>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text>Từ ngân hàng</Text>
                        <Card.Title style={{fontSize: 11}}>{destination}</Card.Title>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text>Số tiền</Text>
                        <Card.Title style={{color: "red"}}>- {CurrencyFormatter(money)}</Card.Title>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text>Còn lại</Text>
                        <Card.Title style={{color: "red"}}>{CurrencyFormatter(remainmoney)}</Card.Title>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text>Nội dung</Text>
                        <Card.Title>{description}</Card.Title>
                    </View>
                </Card>
            </SafeAreaView>
        )

        if(isAddedFromUser(action, source))
        {
            return (
                <SafeAreaView>
                    <View style={{flexDirection: "row"}}>
                        <Button iconRight={true} type="clear" onPress={() => setShowHistoryDetailModal(false)}>
                            Lịch sử giao dịch
                            <AntDesign name="arrowleft" size={24}/>
                        </Button>
                        <View />
                    </View>
                    <Card>
                        <Card.Title style={{fontSize: 20}}>CHI TIẾT GIAO DỊCH</Card.Title>
                        <AntDesign style={{alignSelf: "center", marginBottom: 10}}name="checkcircle" size={40} color="green" />
                        <Card.Title>Giao dịch thành công</Card.Title>
                        <Card.Divider />
                        {/* cái này cần fix */}
                        <Card.Title style={{fontStyle: "italic"}}>{date != "" ? date : (new Date).toString()}</Card.Title> 
                        <View style={{marginBottom: 30}}/>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text>Tên người thực hiện</Text>
                            <Card.Title>{source}</Card.Title>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text>Tài khoản thực hiện</Text>
                            <Card.Title>{source_banknum}</Card.Title>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text>Tên người thụ hưởng</Text>
                            <Card.Title>{destination}</Card.Title>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text>Tài khoản thụ hưởng</Text>
                            <Card.Title>{destination_banknum}</Card.Title>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text>Số tiền</Text>
                            <Card.Title style={{color: "green"}}>+ {CurrencyFormatter(money)}</Card.Title>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text>Số dư</Text>
                            <Card.Title style={{color: "green"}}>{CurrencyFormatter(remainmoney)}</Card.Title>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text>Nội dung</Text>
                            <Card.Title style={{fontSize: 11}}>{description}</Card.Title>
                        </View>
                    </Card>
                </SafeAreaView>
            )
        }

        return (
            <SafeAreaView>
                <View style={{flexDirection: "row"}}>
                    <Button iconRight={true} type="clear" onPress={() => setShowHistoryDetailModal(false)}>
                        Lịch sử giao dịch
                        <AntDesign name="arrowleft" size={24}/>
                    </Button>
                    <View />
                </View>
                <Card>
                    <Card.Title style={{fontSize: 20}}>CHI TIẾT GIAO DỊCH</Card.Title>
                    <AntDesign style={{alignSelf: "center", marginBottom: 10}}name="checkcircle" size={40} color="green" />
                    <Card.Title>Giao dịch thành công</Card.Title>
                    <Card.Divider />
                    {/* cái này cần fix */}
                    <Card.Title style={{fontStyle: "italic"}}>{date != "" ? date : (new Date).toString()}</Card.Title> 
                    <View style={{marginBottom: 30}}/>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text>Tên người thực hiện</Text>
                        <Card.Title>{source}</Card.Title>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text>Tài khoản thực hiện</Text>
                        <Card.Title>{source_banknum}</Card.Title>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text>Tên người thụ hưởng</Text>
                        <Card.Title>{destination}</Card.Title>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text>Tài khoản thụ hưởng</Text>
                        <Card.Title>{destination_banknum}</Card.Title>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text>Số tiền</Text>
                        <Card.Title style={{color: "red"}}>- {CurrencyFormatter(money)}</Card.Title>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text>Còn lại</Text>
                        <Card.Title style={{color: "red"}}>{CurrencyFormatter(remainmoney)}</Card.Title>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text>Nội dung</Text>
                        <Card.Title style={{fontSize: 11}}>{description}</Card.Title>
                    </View>
                </Card>
            </SafeAreaView>
        )
    }
}

