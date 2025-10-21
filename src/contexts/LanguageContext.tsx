import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.alerts": "Alerts",
    "nav.analytics": "Analytics",
    "nav.prediction": "AI Prediction",
    "nav.settings": "Settings",
    
    // Dashboard
    "dashboard.title": "GrainGuard Dashboard",
    "dashboard.subtitle": "Real-time monitoring of grain storage conditions",
    "dashboard.bluetooth.connected": "Bluetooth Connected",
    "dashboard.sensors.title": "Sensor Readings",
    "dashboard.status.overview": "Status Overview",
    "dashboard.status.all_systems": "All systems operational",
    "dashboard.status.check_alerts": "Check alerts for details",
    "dashboard.last_updated": "Last updated",
    
    // Sensors
    "sensor.temperature": "Temperature",
    "sensor.humidity": "Humidity",
    "sensor.gas": "Gas Level",
    "sensor.vibration": "Vibration",
    "sensor.status.safe": "🟢 Safe",
    "sensor.status.warning": "🟡 Warning",
    "sensor.status.danger": "🔴 Danger",
    "sensor.temp.optimal": "Optimal range",
    "sensor.temp.high": "Above threshold",
    "sensor.humidity.optimal": "Optimal range",
    "sensor.humidity.high": "Above threshold",
    "sensor.gas.normal": "Normal levels",
    "sensor.gas.elevated": "Elevated levels detected",
    "sensor.vibration.stable": "Stable",
    "sensor.vibration.detected": "Activity detected",
    
    // Alerts
    "alerts.title": "Alerts",
    "alerts.subtitle": "Recent notifications and warnings",
    "alerts.no_alerts": "No alerts at the moment",
    "alerts.type.info": "Info",
    "alerts.type.warning": "Warning",
    "alerts.type.danger": "Danger",
    "alerts.type.prediction": "AI Prediction",
    
    // Analytics
    "analytics.title": "Analytics",
    "analytics.subtitle": "Historical data and trends",
    "analytics.temp_humidity": "Temperature & Humidity",
    "analytics.temp_humidity.desc": "Last 24 hours",
    "analytics.gas": "Gas Levels",
    "analytics.gas.desc": "Parts per million (ppm)",
    "analytics.vibration": "Vibration Activity",
    "analytics.vibration.desc": "Movement detection",
    
    // Prediction
    "prediction.title": "AI-Driven Spoilage Risk Analysis",
    "prediction.subtitle": "Predictive analytics for grain quality",
    "prediction.confidence": "Confidence",
    "prediction.risk": "Risk Assessment",
    "prediction.risk.low": "Low Risk",
    "prediction.risk.medium": "Medium Risk",
    "prediction.risk.high": "High Risk",
    "prediction.factors": "Key Contributing Factors",
    "prediction.actions": "Recommended Actions",
    "prediction.action.inspect": "Inspect Storage",
    "prediction.action.ventilate": "Increase Ventilation",
    "prediction.action.monitor": "Monitor Closely",
    
    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Configure thresholds and notifications",
    "settings.thresholds": "Safety Thresholds",
    "settings.temp.max": "Maximum Temperature (°C)",
    "settings.temp.min": "Minimum Temperature (°C)",
    "settings.temp.alert": "Alert when temperature exceeds this value",
    "settings.humidity.max": "Maximum Humidity (%)",
    "settings.humidity.min": "Minimum Humidity (%)",
    "settings.gas.max": "Maximum Gas Level (ppm)",
    "settings.vibration.max": "Maximum Vibration",
    "settings.notifications": "Notifications",
    "settings.notifications.push": "Push Notifications",
    "settings.notifications.push.desc": "Receive alerts on your device",
    "settings.notifications.voice": "Voice Alerts",
    "settings.notifications.voice.desc": "Enable audio notifications for critical alerts",
    "settings.notifications.sms": "SMS Notifications",
    "settings.notifications.sms.desc": "Send text messages for urgent alerts",
    "settings.notifications.ai": "AI Prediction Alerts",
    "settings.notifications.ai.desc": "Notify when AI detects spoilage risk",
    "settings.connection": "Connection",
    "settings.connection.type": "Connection Type",
    "settings.language": "Language",
    "settings.language.select": "Select Language",
    "settings.save": "Save Settings",
    "settings.reset": "Reset to Default",
    
    // Bluetooth
    "bluetooth.title": "Bluetooth Sensor",
    "bluetooth.scan": "Scan for Sensors",
    "bluetooth.disconnect": "Disconnect",
    "bluetooth.status.searching": "Searching for sensors...",
    "bluetooth.status.connected": "Connected to",
    "bluetooth.status.disconnected": "Not connected",
    "bluetooth.unsupported": "Bluetooth not supported in this browser",
  },
  hi: {
    // Navigation
    "nav.dashboard": "डैशबोर्ड",
    "nav.alerts": "चेतावनी",
    "nav.analytics": "विश्लेषण",
    "nav.prediction": "एआई पूर्वानुमान",
    "nav.settings": "सेटिंग्स",
    
    // Dashboard
    "dashboard.title": "ग्रेनगार्ड डैशबोर्ड",
    "dashboard.subtitle": "अनाज भंडारण स्थितियों की रीयल-टाइम निगरानी",
    "dashboard.bluetooth.connected": "ब्लूटूथ कनेक्टेड",
    "dashboard.sensors.title": "सेंसर रीडिंग",
    "dashboard.status.overview": "स्थिति अवलोकन",
    "dashboard.status.all_systems": "सभी सिस्टम सामान्य",
    "dashboard.status.check_alerts": "विवरण के लिए चेतावनी देखें",
    "dashboard.last_updated": "अंतिम अपडेट",
    
    // Sensors
    "sensor.temperature": "तापमान",
    "sensor.humidity": "आर्द्रता",
    "sensor.gas": "गैस स्तर",
    "sensor.vibration": "कंपन",
    "sensor.status.safe": "🟢 सुरक्षित",
    "sensor.status.warning": "🟡 चेतावनी",
    "sensor.status.danger": "🔴 खतरा",
    "sensor.temp.optimal": "इष्टतम सीमा",
    "sensor.temp.high": "सीमा से ऊपर",
    "sensor.humidity.optimal": "इष्टतम सीमा",
    "sensor.humidity.high": "सीमा से ऊपर",
    "sensor.gas.normal": "सामान्य स्तर",
    "sensor.gas.elevated": "उच्च स्तर का पता चला",
    "sensor.vibration.stable": "स्थिर",
    "sensor.vibration.detected": "गतिविधि का पता चला",
    
    // Alerts
    "alerts.title": "चेतावनी",
    "alerts.subtitle": "हाल की सूचनाएं और चेतावनियां",
    "alerts.no_alerts": "फिलहाल कोई चेतावनी नहीं",
    "alerts.type.info": "जानकारी",
    "alerts.type.warning": "चेतावनी",
    "alerts.type.danger": "खतरा",
    "alerts.type.prediction": "एआई पूर्वानुमान",
    
    // Analytics
    "analytics.title": "विश्लेषण",
    "analytics.subtitle": "ऐतिहासिक डेटा और रुझान",
    "analytics.temp_humidity": "तापमान और आर्द्रता",
    "analytics.temp_humidity.desc": "पिछले 24 घंटे",
    "analytics.gas": "गैस स्तर",
    "analytics.gas.desc": "पार्ट्स प्रति मिलियन (पीपीएम)",
    "analytics.vibration": "कंपन गतिविधि",
    "analytics.vibration.desc": "गति का पता लगाना",
    
    // Prediction
    "prediction.title": "एआई-संचालित खराब होने का जोखिम विश्लेषण",
    "prediction.subtitle": "अनाज गुणवत्ता के लिए पूर्वानुमानात्मक विश्लेषण",
    "prediction.confidence": "विश्वास",
    "prediction.risk": "जोखिम मूल्यांकन",
    "prediction.risk.low": "कम जोखिम",
    "prediction.risk.medium": "मध्यम जोखिम",
    "prediction.risk.high": "उच्च जोखिम",
    "prediction.factors": "मुख्य योगदान करने वाले कारक",
    "prediction.actions": "अनुशंसित कार्य",
    "prediction.action.inspect": "भंडारण की जांच करें",
    "prediction.action.ventilate": "वेंटिलेशन बढ़ाएं",
    "prediction.action.monitor": "बारीकी से निगरानी करें",
    
    // Settings
    "settings.title": "सेटिंग्स",
    "settings.subtitle": "सीमा और सूचनाएं कॉन्फ़िगर करें",
    "settings.thresholds": "सुरक्षा सीमा",
    "settings.temp.max": "अधिकतम तापमान (°C)",
    "settings.temp.min": "न्यूनतम तापमान (°C)",
    "settings.temp.alert": "जब तापमान इस मान से अधिक हो तो चेतावनी दें",
    "settings.humidity.max": "अधिकतम आर्द्रता (%)",
    "settings.humidity.min": "न्यूनतम आर्द्रता (%)",
    "settings.gas.max": "अधिकतम गैस स्तर (पीपीएम)",
    "settings.vibration.max": "अधिकतम कंपन",
    "settings.notifications": "सूचनाएं",
    "settings.notifications.push": "पुश सूचनाएं",
    "settings.notifications.push.desc": "अपने डिवाइस पर चेतावनी प्राप्त करें",
    "settings.notifications.voice": "वॉयस अलर्ट",
    "settings.notifications.voice.desc": "महत्वपूर्ण चेतावनियों के लिए ऑडियो सूचनाएं सक्षम करें",
    "settings.notifications.sms": "एसएमएस सूचनाएं",
    "settings.notifications.sms.desc": "तत्काल चेतावनियों के लिए टेक्स्ट संदेश भेजें",
    "settings.notifications.ai": "एआई पूर्वानुमान चेतावनी",
    "settings.notifications.ai.desc": "जब एआई खराब होने का जोखिम पता लगाए तो सूचित करें",
    "settings.connection": "कनेक्शन",
    "settings.connection.type": "कनेक्शन प्रकार",
    "settings.language": "भाषा",
    "settings.language.select": "भाषा चुनें",
    "settings.save": "सेटिंग्स सहेजें",
    "settings.reset": "डिफ़ॉल्ट पर रीसेट करें",
    
    // Bluetooth
    "bluetooth.title": "ब्लूटूथ सेंसर",
    "bluetooth.scan": "सेंसर स्कैन करें",
    "bluetooth.disconnect": "डिस्कनेक्ट करें",
    "bluetooth.status.searching": "सेंसर खोज रहे हैं...",
    "bluetooth.status.connected": "कनेक्टेड",
    "bluetooth.status.disconnected": "कनेक्टेड नहीं",
    "bluetooth.unsupported": "इस ब्राउज़र में ब्लूटूथ समर्थित नहीं है",
  },
};
