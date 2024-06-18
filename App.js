import { ActivityIndicator, View, Alert } from 'react-native';
import { useState } from 'react';
import { IPAddr } from './shared/localIP';
import { Text } from '@rneui/themed';

import Main from './components/Main';

export default function App() {
  var [ isLoading, setIsLoading ] = useState(true);
  fetch(IPAddr + "ping")
  .then((respond) => {
    if (respond.status == 234) setIsLoading(false)
    else throw new Error("Error connecting to server");
  })
  .catch((err) => {
    Alert.alert("THÔNG BÁO", "Có lỗi khi kết nối đến máy chủ", [
      {text: "Kết nối lại"}
    ], { cancelable: true })
  })
  console.log(isLoading)
  return ( // Nếu wrap <Main/> vào <View> </View> thì cái View trắng sẽ override Main?
      <>
        { isLoading ? <LoadingScreen/> : 
        <Main /> }
      </> 
  );
}

function LoadingScreen()
{
  return (
    <View style={{justifyContent: 'center', flex: 1}}>
      <ActivityIndicator size="large"/>
      <Text style={{ textAlign: "center" }}>Đang tải...</Text>
    </View>
  )
}



