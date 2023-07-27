import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { ContenidoComentarios } from '../interfaces/appInterfaces';
import moment from 'moment';


type TarjetaComentarioProps = {
    comentario: ContenidoComentarios;
    isMainComment: boolean;
    
};

export const TarjetaComentario = ({ comentario, isMainComment }: TarjetaComentarioProps) => {
    const formattedDate = moment(comentario.fecha).format('DD/MM/YYYY HH:mm');

    return (
        <View>
            <View style={[styles.container, isMainComment && styles.mainCommentContainer]}>
                <View style={styles.separador}>
                    <View style={styles.userInfo}>
                        <Text style={{ fontWeight: 'bold' , marginRight:50}}>{comentario.usuario}</Text>
                        <Text style={{ fontWeight:'200'}}>{formattedDate}</Text>
                    </View>
                </View>
                <Text>{comentario.contenido}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 10,
        marginBottom: 1,
        backgroundColor: 'white',
        borderWidth: 0,
    },
    mainCommentContainer: {
        elevation: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    separador: {
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    },
    userInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems:'center',
        
    },
});








