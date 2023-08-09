import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ContenidoComentarios } from '../interfaces/appInterfaces';
import moment from 'moment';

type TarjetaComentarioProps = {
  comentario: ContenidoComentarios;
  isMainComment: boolean;
};

export const TarjetaComentario = ({ comentario, isMainComment }: TarjetaComentarioProps) => {
  const formattedDate = moment(comentario.fecha).format('DD/MM/YYYY HH:mm');

  return (
    <View style={[styles.container, isMainComment && styles.mainCommentContainer]}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{comentario.usuario[0]}</Text>
        </View>
        <View style={styles.userInfoText}>
          <Text style={styles.username}>{comentario.usuario}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>
      <View style={styles.separador} />
      <Text style={styles.content}>{comentario.contenido}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#F5F5F5',
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  mainCommentContainer: {
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5856D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  userInfoText: {
    marginLeft: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#5856D6',
  },
  date: {
    color: 'gray',
  },
  separador: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#EAEAEA',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 20,
    color: '#333',
  },
});









