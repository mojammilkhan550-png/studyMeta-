import React, {useEffect, useState} from "react";
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert, ActivityIndicator
} from "react-native";
import Purchases, {LOG_LEVEL} from "react-native-purchases";

const RC_ANDROID_KEY = "YOUR_REVENUECAT_ANDROID_PUBLIC_SDK_KEY";
const RC_IOS_KEY = "YOUR_REVENUECAT_IOS_PUBLIC_SDK_KEY";

export default function App() {
  const [topic, setTopic] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [premium, setPremium] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function initRevenueCat() {
      try {
        Purchases.setLogLevel(LOG_LEVEL.INFO);
        const key = PlatformOS() === "ios" ? RC_IOS_KEY : RC_ANDROID_KEY;
        if (!key.startsWith("YOUR_")) {
          Purchases.configure({apiKey: key});
          const info = await Purchases.getCustomerInfo();
          setPremium(Boolean(info.entitlements.active["premium"]));
          setReady(true);
        }
      } catch (e) {
        console.log("RevenueCat init:", e.message);
      }
    }
    initRevenueCat();
  }, []);

  function PlatformOS() {
    return require("react-native").Platform.OS;
  }

  function explainTopic() {
    if (!topic.trim()) {
      Alert.alert("Enter a topic", "Example: Explain Newton's laws simply.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setAnswer(
        `Simple explanation of "${topic}":\\n\\n` +
        "1. Start with the basic idea.\\n" +
        "2. Connect it to a real-life example.\\n" +
        "3. Remember the key formula/definition.\\n\\n" +
        "Quick revision: explain the topic in your own words, then solve 3 practice questions."
      );
      setLoading(false);
    }, 700);
  }

  async function showPremium() {
    try {
      const offerings = await Purchases.getOfferings();
      if (!offerings.current) {
        Alert.alert("Premium setup", "Add a RevenueCat Offering with a premium entitlement.");
        return;
      }
      const pkg = offerings.current.availablePackages[0];
      if (!pkg) return;
      const result = await Purchases.purchasePackage(pkg);
      setPremium(Boolean(result.customerInfo.entitlements.active["premium"]));
    } catch (e) {
      if (!e.userCancelled) Alert.alert("Purchase", e.message);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.badge}>CODER BABA • STUDENT EDITION</Text>
        <Text style={styles.title}>StudyMate AI</Text>
        <Text style={styles.subtitle}>Learn smarter. Revise faster. Build confidence.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🤖 Explain any topic</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Explain Ohm's Law simply"
            placeholderTextColor="#8a8fa3"
            value={topic}
            onChangeText={setTopic}
          />
          <TouchableOpacity style={styles.primary} onPress={explainTopic}>
            {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.primaryText}>Explain with AI</Text>}
          </TouchableOpacity>
        </View>

        {answer ? (
          <View style={styles.answer}>
            <Text style={styles.answerTitle}>Your quick lesson</Text>
            <Text style={styles.answerText}>{answer}</Text>
          </View>
        ) : null}

        <View style={styles.grid}>
          <Feature icon="📝" title="Smart Notes" text="Turn long notes into revision points." />
          <Feature icon="🧠" title="Quiz Mode" text="Practice with quick topic quizzes." />
          <Feature icon="📅" title="Study Plan" text="Create a focused daily roadmap." />
          <Feature icon="📈" title="Progress" text="Track your learning streak." />
        </View>

        <View style={styles.premium}>
          <Text style={styles.premiumTitle}>{premium ? "⭐ Premium active" : "🚀 StudyMate Premium"}</Text>
          <Text style={styles.premiumText}>Unlimited AI lessons, advanced quizzes and personalized study plans.</Text>
          <TouchableOpacity style={styles.secondary} onPress={showPremium}>
            <Text style={styles.secondaryText}>{premium ? "Premium unlocked" : "Unlock Premium"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>RevenueCat-powered monetization • Hackathon MVP</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Feature({icon, title, text}) {
  return (
    <View style={styles.feature}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:"#0b1020"},
  container:{padding:22,paddingBottom:40},
  badge:{color:"#9aa6ff",fontSize:11,fontWeight:"800",letterSpacing:1.2,marginBottom:10},
  title:{color:"#fff",fontSize:38,fontWeight:"900"},
  subtitle:{color:"#b9bfd5",fontSize:16,lineHeight:23,marginTop:5,marginBottom:22},
  card:{backgroundColor:"#151c33",borderRadius:22,padding:18,marginBottom:16},
  cardTitle:{color:"#fff",fontSize:19,fontWeight:"800",marginBottom:12},
  input:{backgroundColor:"#0e1427",color:"#fff",borderWidth:1,borderColor:"#2c3555",borderRadius:14,padding:14,fontSize:15},
  primary:{backgroundColor:"#6c63ff",padding:15,borderRadius:14,alignItems:"center",marginTop:12},
  primaryText:{color:"#fff",fontSize:15,fontWeight:"800"},
  answer:{backgroundColor:"#101a2e",borderRadius:18,padding:18,borderWidth:1,borderColor:"#29385c",marginBottom:16},
  answerTitle:{color:"#fff",fontWeight:"800",fontSize:17,marginBottom:8},
  answerText:{color:"#cbd2e8",fontSize:14,lineHeight:22},
  grid:{flexDirection:"row",flexWrap:"wrap",gap:12},
  feature:{width:"48%",backgroundColor:"#151c33",borderRadius:18,padding:15,minHeight:130},
  icon:{fontSize:25,marginBottom:8},
  featureTitle:{color:"#fff",fontSize:15,fontWeight:"800"},
  featureText:{color:"#9fa8c2",fontSize:12,lineHeight:18,marginTop:5},
  premium:{backgroundColor:"#1d2440",borderRadius:20,padding:18,marginTop:16,borderWidth:1,borderColor:"#424d7d"},
  premiumTitle:{color:"#fff",fontSize:18,fontWeight:"900"},
  premiumText:{color:"#b7bfd9",fontSize:13,lineHeight:19,marginTop:6},
  secondary:{backgroundColor:"#fff",padding:13,borderRadius:13,alignItems:"center",marginTop:12},
  secondaryText:{color:"#11162a",fontWeight:"900"},
  footer:{color:"#69728e",fontSize:11,textAlign:"center",marginTop:22}
});
