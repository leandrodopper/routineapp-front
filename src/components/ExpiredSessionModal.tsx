import React, { useContext } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';

interface ExpiredSessionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPress: () => void;
}

export const ExpiredSessionModal = ({ isVisible, onClose, onPress }: ExpiredSessionModalProps) => {
  const { logOut } = useContext(AuthContext);

  const handlePress = () => {
    logOut();
    onPress();
  }

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.modalContent}>
        <Text style={styles.title}>Sesión expirada</Text>
        <Text style={styles.message}>Tu sesión ha expirado, por favor inicia sesión de nuevo.</Text>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
