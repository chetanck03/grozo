import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  onOk: () => void;
  okText?: string;
  onCancel?: () => void;
  cancelText?: string;
  showCancel?: boolean;
  extraButtons?: Array<{
    text: string;
    onPress: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }>;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  title,
  message,
  onOk,
  okText = 'OK',
  onCancel,
  cancelText = 'Cancel',
  showCancel = false,
  extraButtons,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onOk}
    >
      <TouchableWithoutFeedback onPress={onOk}>
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-lg">
              {/* Title */}
              <Text className="text-xl font-bold text-gray-800 mb-3 text-center">
                {title}
              </Text>

              {/* Message */}
              <Text className="text-gray-600 mb-6 text-center leading-5">
                {message}
              </Text>

              {/* Buttons */}
              <View>
                {/* First row: Cancel + Extra buttons */}
                {(showCancel && onCancel) || (extraButtons && extraButtons.length > 0) ? (
                  <View className="flex-row mb-2">
                    {showCancel && onCancel && (
                      <TouchableOpacity
                        onPress={onCancel}
                        className="flex-1 bg-gray-200 rounded-xl py-3 mr-3"
                      >
                        <Text className="text-gray-700 text-center font-semibold">
                          {cancelText}
                        </Text>
                      </TouchableOpacity>
                    )}
                    {extraButtons && extraButtons.map((button, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={button.onPress}
                        className={`flex-1 bg-green-500 rounded-xl py-3 ${showCancel && onCancel ? 'mr-3' : ''}`}
                      >
                        <Text className="text-white text-center font-semibold">
                          {button.text}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}
                
                {/* Second row: OK button */}
                <TouchableOpacity
                  onPress={onOk}
                  className="w-full bg-green-500 rounded-xl py-3"
                >
                  <Text className="text-white text-center font-semibold">
                    {okText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
