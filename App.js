import React, {useState, useEffect} from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput
} from "react-native";
import moment from "moment";
import "moment/locale/th";
import {initializeApp} from "firebase/app";
import {getDatabase, ref, update, set, onValue} from "firebase/database";
import {firebaseConfig} from "./firebase/firebase";
import Modal from "react-native-modal";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import * as Font from "expo-font";
import {useFonts} from "expo-font";
moment.locale("th");

const App = () => {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Realtime Database and get a reference to the service
  const database = getDatabase(app);

  const [isOn, setIsOn] = useState(false);
  const [timerType, setTimerType] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const toggleSwitch1 = () => setIsOn((previousState) => !previousState);
  const toggleSwitch2 = () => setIsOn((previousState) => !previousState);
  const toggleSwitch3 = () => setIsOn((previousState) => !previousState);

  const [isButton1On, setButton1On] = useState(false);
  const [timerType1, setTimerType1] = useState({});
  const [isEnableTimer1, setIsEnableTimer1] = useState(false);
  const [isButton2On, setButton2On] = useState(false);
  const [timerType2, setTimerType2] = useState({});
  const [isEnableTimer2, setIsEnableTimer2] = useState(false);
  const [isButton3On, setButton3On] = useState(false);
  const [timerType3, setTimerType3] = useState({});
  const [isEnableTimer3, setIsEnableTimer3] = useState(false);
  const [isButton4On, setButton4On] = useState(false);
  const [timerType4, setTimerType4] = useState({});
  const [isEnableTimer4, setIsEnableTimer4] = useState(false);
  const [openHour, onChangeOpenHour] = React.useState("");
  const [openMinutes, onChangeOpenMinutes] = React.useState("");
  const [closeHour, onChangeCloseHour] = React.useState("");
  const [closeMinutes, onChangeCloseMinutes] = React.useState("");
  const toggleDateTimePicker = (type) => {
    setDatePickerVisibility(!isDatePickerVisible);
    setTimerType(type);
  };

  const handleSettingTime = () => {
    var now = new Date();
    var nowDateTime = now.toISOString();
    var nowDate = nowDateTime.split("T")[0];
    console.warn("openMinutes", openMinutes);
    var openTime = `${openHour}:${openMinutes}:00`;
    var closeTime = `${closeHour}:${closeMinutes}:00`;
    var targetOpen = new Date(nowDate + "T" + openTime);
    var targetClose = new Date(nowDate + "T" + closeTime);
    var formatOpen = targetOpen.toISOString().split("T");
    var formatDateOpen = formatOpen[0].split("-");
    var formatClose = targetClose.toISOString().split("T");
    var formatDateClose = formatClose[0].split("-");
    var formatterOpen = `${formatDateOpen[2]}/${formatDateOpen[1]}/${formatDateOpen[0]} ${openTime}`;
    var formatterClose = `${formatDateClose[2]}/${formatDateClose[1]}/${formatDateClose[0]} ${closeTime}`;
    console.warn("open", `${formatDateOpen[2]}/${formatDateOpen[1]}/${formatDateOpen[0]} ${openTime}`);
    console.warn("close", `${formatDateClose[2]}/${formatDateClose[1]}/${formatDateClose[0]} ${closeTime}`);

    // console.warn("time", time);
    if (timerType === "ระบบไฟเหลือง") {
      update(ref(database, `/cluster_object/value1`), {
        createdAt: formatterOpen,
        createdAtTime: openTime,
        endedAt: formatterClose,
        endedAtTime: closeTime
      });
    }
    if (timerType === "ระบบพัดลมระบายอากาศ") {
      update(ref(database, `/cluster_object/value2`), {
        createdAt: formatterOpen,
        createdAtTime: openTime,
        endedAt: formatterClose,
        endedAtTime: closeTime
      });
    }
    if (timerType === "ระบบฉีดพ่นแมลงพาหะ") {
      update(ref(database, `/cluster_object/value3`), {
        createdAt: formatterOpen,
        createdAtTime: openTime,
        endedAt: formatterClose,
        endedAtTime: closeTime
      });
    }
    if (timerType === "ระบบพัดลมดูดแมลงพาหะ") {
      update(ref(database, `/cluster_object/value4`), {
        createdAt: formatterOpen,
        createdAtTime: openTime,
        endedAt: formatterClose,
        endedAtTime: closeTime
      });
    }

    toggleDateTimePicker();
    getDataFromFirebase();
    onChangeOpenHour("");
    onChangeOpenMinutes("");
    onChangeCloseHour("");
    onChangeCloseMinutes("");
  };

  useEffect(() => {
    getDataFromFirebase();

    checkIsEnableTimer();
  }, []);
  const getDataFromFirebase = () => {
    try {
      const starCountRef = ref(database, "/cluster_object");
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setButton1On(data.value1.isEnableSystem);
        setTimerType1({createdAt: data.value1.createdAt, endedAt: data.value1.endedAt});
        setIsEnableTimer1(data.value1.isEnableTimer);
        setButton2On(data.value2.isEnableSystem);
        setTimerType2({createdAt: data.value2.createdAt, endedAt: data.value2.endedAt});
        setIsEnableTimer2(data.value2.isEnableTimer);
        setButton3On(data.value3.isEnableSystem);
        setTimerType3({createdAt: data.value3.createdAt, endedAt: data.value3.endedAt});
        setIsEnableTimer3(data.value3.isEnableTimer);
        setButton4On(data.value4.isEnableSystem);
        setTimerType4({createdAt: data.value4.createdAt, endedAt: data.value4.endedAt});
        setIsEnableTimer4(data.value4.isEnableTimer);
      });
    } catch (e) {
      console.log("err get data", e);
    }
  };
  const checkIsEnableTimer = () => {
    if (isEnableTimer1) {
      const openTime = Date.parse(timerType1.createdAt) - Date.now();
      const closeTime = Date.parse(timerType1, endedAt) - Date.now();
      if (openTime < 0) {
        update(ref(database, `/cluster_object/value1`), {
          isEnableSystem: true,
          isEnableTimer: true
        });
        getDataFromFirebase();
      }
      if (closeTime < 0) {
        update(ref(database, `/cluster_object/value1`), {
          isEnableSystem: false,
          isEnableTimer: false,
          createdAt: "",
          createdAtTime: ""
        });
        getDataFromFirebase();
      }
    }
    if (isEnableTimer2) {
      const openTime = Date.parse(timerType2.createdAt) - Date.now();
      const closeTime = Date.parse(timerType2, endedAt) - Date.now();
      if (openTime < 0) {
        update(ref(database, `/cluster_object/value2`), {
          isEnableSystem: true,
          isEnableTimer: true
        });
        getDataFromFirebase();
      }
      if (closeTime < 0) {
        update(ref(database, `/cluster_object/value2`), {
          isEnableSystem: false,
          isEnableTimer: false,
          createdAt: "",
          createdAtTime: ""
        });
        getDataFromFirebase();
      }
    }
    if (isEnableTimer3) {
      const openTime = Date.parse(timerType3.createdAt) - Date.now();
      const closeTime = Date.parse(timerType3, endedAt) - Date.now();
      if (openTime < 0) {
        update(ref(database, `/cluster_object/value3`), {
          isEnableSystem: true,
          isEnableTimer: true
        });
        getDataFromFirebase();
      }
      if (closeTime < 0) {
        update(ref(database, `/cluster_object/value3`), {
          isEnableSystem: false,
          isEnableTimer: false,
          createdAt: "",
          createdAtTime: ""
        });
        getDataFromFirebase();
      }
    }
    if (isEnableTimer4) {
      const openTime = Date.parse(timerType4.createdAt) - Date.now();
      const closeTime = Date.parse(timerType4, endedAt) - Date.now();
      if (openTime < 0) {
        update(ref(database, `/cluster_object/value4`), {
          isEnableSystem: true,
          isEnableTimer: true
        });
        getDataFromFirebase();
      }
      if (closeTime < 0) {
        update(ref(database, `/cluster_object/value4`), {
          isEnableSystem: false,
          isEnableTimer: false,
          createdAt: "",
          createdAtTime: ""
        });
        getDataFromFirebase();
      }
    }
  };
  const toggleButton1 = () => {
    update(ref(database, `/cluster_object/value1`), {
      isEnableSystem: !isButton1On,
      isEnableTimer: false,
      datetime: ""
    });

    getDataFromFirebase();
  };

  const toggleButton2 = () => {
    update(ref(database, `/cluster_object/value2`), {
      isEnableSystem: !isButton2On,
      isEnableTimer: false,
      datetime: ""
    });

    getDataFromFirebase();
  };

  const toggleButton3 = () => {
    update(ref(database, `/cluster_object/value3`), {
      isEnableSystem: !isButton3On,
      isEnableTimer: false,
      datetime: ""
    });

    getDataFromFirebase();
  };

  const toggleButton4 = () => {
    update(ref(database, `/cluster_object/value4`), {
      isEnableSystem: !isButton4On,
      isEnableTimer: false,
      datetime: ""
    });

    getDataFromFirebase();
  };

  return (<View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerText}>
        ระบบป้องกัน ขับไล่ และกำจัดแมลงพาหะ
      </Text>
    </View>
    {/* BOX1########################################################################################################################################################################## */}
    <View style={styles.content}>
      <View style={styles.box}>
        <Image source={require("./img/lightbulb1.png")} style={styles.image}/>
        <Text style={[
            styles.boxText, {
              textAlign: "right",
              marginRight: 45
            }
          ]}>
          ระบบไฟเหลือง
        </Text>

        <TouchableOpacity onPress={toggleButton1} style={styles.imageButton}>
          <Image source={isButton1On
              ? require("./img/on.png")
              : require("./img/off.png")} style={styles.imageButtonIcon}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button1} onPress={() => toggleDateTimePicker("ระบบไฟเหลือง")}>
          <Text style={styles.buttonText}>ตั้งเวลาการทำงาน</Text>
        </TouchableOpacity>
      </View>

      {/* BOX2########################################################################################################################################################################## */}
      <View style={styles.box}>
        <Image source={require("./img/fan1.png")} style={styles.image}/>
        <Text style={[
            styles.boxText, {
              textAlign: "right",
              marginRight: 18
            }
          ]}>
          ระบบพัดลมระบายอากาศ
        </Text>

        <TouchableOpacity onPress={toggleButton2} style={styles.imageButton}>
          <Image source={isButton2On
              ? require("./img/on.png")
              : require("./img/off.png")} style={styles.imageButtonIcon}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button1} onPress={() => toggleDateTimePicker("ระบบพัดลมระบายอากาศ")}>
          <Text style={styles.buttonText}>ตั้งเวลาการทำงาน</Text>
        </TouchableOpacity>
      </View>

      {/* BOX3########################################################################################################################################################################## */}
      <View style={styles.box}>
        <Image source={require("./img/spay1.png")} style={styles.image}/>

        <Text style={[
            styles.boxText, {
              textAlign: "right",
              marginRight: 27
            }
          ]}>
          ระบบฉีดพ่นแมลงพาหะ
        </Text>

        <TouchableOpacity onPress={toggleButton3} style={styles.imageButton}>
          <Image source={isButton3On
              ? require("./img/on.png")
              : require("./img/off.png")} style={styles.imageButtonIcon}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button1} onPress={() => toggleDateTimePicker("ระบบฉีดพ่นแมลงพาหะ")}>
          <Text style={styles.buttonText}>ตั้งเวลาการทำงาน</Text>
        </TouchableOpacity>
      </View>

      {/* BOX4########################################################################################################################################################################## */}
      <View style={styles.box}>
        <Image source={require("./img/fandd1.png")} style={styles.image}/>
        <Text style={[
            styles.boxText, {
              textAlign: "right",
              marginRight: 18
            }
          ]}>
          ระบบพัดลมดูดแมลงพาหะ
        </Text>

        <TouchableOpacity onPress={toggleButton4} style={styles.imageButton}>
          <Image source={isButton4On
              ? require("./img/on.png")
              : require("./img/off.png")} style={styles.imageButtonIcon}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button1} onPress={() => toggleDateTimePicker("ระบบพัดลมดูดแมลงพาหะ")}>
          <Text style={styles.buttonText}>ตั้งเวลาการทำงาน</Text>
        </TouchableOpacity>
      </View>
    </View>
    {/* <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={toggleDateTimePicker}
      /> */
    }
    <View>
      <Modal isVisible={isDatePickerVisible} onBackdropPress={() => setDatePickerVisibility(false)}>
        <View style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}>
          <View style={{
              backgroundColor: "white",
              width: windowWidth * 0.8,
              height: windowHeight * 0.22,
              borderRadius: 12,
              padding: 12
            }}>
            <Text>{"ตั้งค่าเวลา" + " " + timerType}</Text>
            <View style={{
                flexDirection: "row",
                marginTop: 20
              }}>
              <View style={{
                  flexDirection: "column"
                }}>
                <Text>เวลาเปิด</Text>
                <View style={{
                    flexDirection: "row",
                    marginTop: 10
                  }}>
                  <TextInput style={styles.input} onChangeText={onChangeOpenHour} value={openHour} placeholder="0.0" keyboardType="numeric"/>
                  <TextInput style={styles.input} onChangeText={onChangeOpenMinutes} value={openMinutes} placeholder="0.0" keyboardType="numeric"/>
                </View>
              </View>
              <View style={{
                  flexDirection: "column"
                }}>
                <Text>เวลาปิด</Text>
                <View style={{
                    flexDirection: "row",
                    marginTop: 10
                  }}>
                  <TextInput style={styles.input} onChangeText={onChangeCloseHour} value={closeHour} placeholder="0.0" keyboardType="numeric"/>
                  <TextInput style={styles.input} onChangeText={onChangeCloseMinutes} value={closeMinutes} placeholder="0.0" keyboardType="numeric"/>
                </View>
              </View>
            </View>
            <View style={{
                flexDirection: "row",
                marginTop: 20,
                justifyContent: "space-between",
                marginLeft: 10,
                marginRight: 20
              }}>
              <TouchableOpacity onPress={() => setDatePickerVisibility(!isDatePickerVisible)}>
                <Text style={styles.buttonText}>ปิด</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSettingTime()}>
                <Text style={styles.buttonText}>ตั้งเวลา</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  </View>);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7EF2F6"
  },
  header: {
    backgroundColor: "#ffff",
    height: 100,
    justifyContent: "center",
    alignItems: "center"
  },
  headerText: {
    color: "#1755FE",
    fontWeight: "bold",

    fontSize: 20
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between"
  },
  box: {
    height: 150,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "white",
    justifyContent: "center",
    // alignItems: 'center',
    borderRadius: 20,
    elevation: 20,
    shadowOpacity: 5,
    shadowRadius: 20,
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowColor: "#000000"
  },
  boxText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1755FE",
    marginBottom: 10,
    // textAlign: 'canter',
    marginLeft: 100,
    fontSize: 15,
    marginBottom: 10
  },
  button: {
    width: 50,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#1755FE",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 230,
    alignItems: "center",
    elevation: 10,
    shadowOpacity: 5,
    shadowRadius: 20,
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowColor: "#000000"
  },
  imageButton: {
    // padding: 10,
    paddingLeft: 10,
    width: 50,
    height: 50,
    borderRadius: 20
  },
  imageButtonIcon: {
    width: 50,
    height: 50,
    marginLeft: 220
  },
  button1: {
    width: 120,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginTop: 20,
    marginLeft: 190,
    alignItems: "center",
    elevation: 10,
    shadowOpacity: 20,
    shadowRadius: 20,
    shadowOffset: {
      width: 3,
      height: 0
    },
    shadowColor: "#000000"
  },

  buttonText: {
    color: "#1755FE",
    fontSize: 12,
    fontWeight: "bold"
  },

  image: {
    width: 130,
    height: 130,
    position: "absolute",
    left: 0,
    marginLeft: 20
  },
  input: {
    height: 40,
    width: 70,
    marginRight: 5,
    borderWidth: 1,
    padding: 10,
    borderRadius: 12
  }
});

export default App;
