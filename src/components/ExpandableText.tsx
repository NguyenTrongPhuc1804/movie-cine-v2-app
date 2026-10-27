import { useState } from "react";
import { Text } from "react-native";

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
}

export default function ExpandableText({ text, maxLength = 150 }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  if (text.length <= maxLength || expanded) {
    return <Text className="leading-6 text-white">{text}</Text>;
  }

  return (
    <Text className="leading-6 text-white">
      {text.slice(0, maxLength)}...{" "}
      <Text onPress={() => setExpanded(true)} className="text-blue-500">
        xem thêm
      </Text>
    </Text>
  );
}
