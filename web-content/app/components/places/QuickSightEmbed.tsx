import React from "react";

const QuickSightEmbed: React.FC = () => {
  const quickSightUrl =
    "https://us-east-1.quicksight.aws.amazon.com/sn/embed/share/accounts/165553610930/dashboards/81c46891-b49d-46f7-8d44-0f3efc958fb2?directory_alias=Cecure-analytics";

  const quickSightUrl2 =
    "https://us-east-1.quicksight.aws.amazon.com/embed/a001b29f287540ebb5f24518dd5e590e/dashboards/81c46891-b49d-46f7-8d44-0f3efc958fb2?identityprovider=quicksight&isauthcode=true&code=AYABeCUiha_5UiGhmMXMamtV-ygAAAABAAdhd3Mta21zAEthcm46YXdzOmttczp1cy1lYXN0LTE6MjU5NDgwNDYyMTMyOmtleS81NGYwMjdiYy03MDJhLTQxY2YtYmViNS0xNDViOTExNzFkYzMAuAECAQB4g1oL4hdUJZc1aKfcGo-VQb_jBEsh0RowAd9MxoJqXpEBxABbaaMuR4WgM5AvuFUiHAAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDOg4mHA1UgdTdxeXTAIBEIA7kzWpcWlP33pKybcz21fng1xfq0Zv-ePnqFbV-YcaiPlBQ84oIIVI3PksffqZdv4B_DCOoKHwwltgNv0CAAAAAAwAABAAAAAAAAAAAAAAAAAAJeh3Un2nVRZANC35hbGtvP____8AAAABAAAAAAAAAAAAAAABAAAAm_9EcoMPWHC8Wa19-wH53MqGR5MZAfcRrjb-M5t-1LIKtxitPXpyUFZrmexrjN_NpHbVLacS6pIBGU24AgjesChxTFyA23cNj7HmAzDsARsk5a6Nh86hMsmKghqYlqyJ--FP2qlX1P-N1iR-6HTpR2VQOJL_Mi3C_3-WVOTeUAJEVUP9ANej2hvNfIXRKF5YNCpOphn69qQfICnALvwxnJ7v1QzVbqlGewV7Kw%3D%3D";
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full h-[100vh] shadow-lg rounded-lg overflow-hidden">
        <iframe
          src={quickSightUrl2}
          className="w-full h-full border-none"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default QuickSightEmbed;
