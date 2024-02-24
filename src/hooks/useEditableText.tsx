import { useState, useRef, KeyboardEvent } from "react";

const useEditableText = ({
  initialValue,
  onDoubleClick,
  onBlur,
}: {
  initialValue: string;
  onDoubleClick?: () => void;
  onBlur?: (text: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialValue);
  const textRef = useRef(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
    onDoubleClick && onDoubleClick();
  };

  const handleBlur = () => {
    setIsEditing(false);
    onBlur && onBlur(text);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  return {
    isEditing,
    text,
    textRef,
    handleDoubleClick,
    handleBlur,
    handleKeyDown,
    setText,
  };
};

export default useEditableText;
