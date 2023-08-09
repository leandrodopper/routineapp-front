import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Keyboard, Alert } from 'react-native';
import { TarjetaComentario } from '../components/TarjetaComentario';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { ContenidoComentarios, ContenidoRutinas, GetComentariosRutinaResponse } from '../interfaces/appInterfaces';
import { AuthContext } from '../context/AuthContext';
import routineApi from '../api/routineApi';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

type CommentsScreenProps = {
    route: RouteProp<{ params: { rutina: ContenidoRutinas } }, 'params'>;
};

export const CommentsScreen = ({ route }: CommentsScreenProps) => {
    const { rutina } = route.params;
    const navigation = useNavigation<any>();

    const { token, user } = useContext(AuthContext);
    const [comentarios, setComentarios] = useState<ContenidoComentarios[]>([]);
    const [nuevoComentario, setNuevoComentario] = useState<string>('');
    const [mostrarTextInput, setMostrarTextInput] = useState(false);
    const [mostrarNuevoComentario, setMostrarNuevoComentario] = useState(false);
    const [textoRespuesta, setTextoRespuesta] = useState<string>('');
    const [comentarioPadreId, setComentarioPadreId] = useState<number | null>(null);
    const [expandedComments, setExpandedComments] = useState<number[]>([]);


    const fetchData = async () => {
        if (!token) {
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    pageNo: 0,
                    pageSize: 100,
                    sortBy: 'id',
                    sortDir: 'asc',
                },
            };
            const response = await routineApi.get<GetComentariosRutinaResponse>(`/comentarios/comentariosRutina/${rutina.id}`, config);
            setComentarios(response.data.contenido);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const toggleExpandedComment = (comentarioId: number) => {
        setExpandedComments((prev) => {
            if (prev.includes(comentarioId)) {
                return prev.filter((id) => id !== comentarioId);
            } else {
                return [...prev, comentarioId];
            }
        });
    };

    const renderComentarioRecursivo = (comentario: ContenidoComentarios, nivel: number, isMainComment: boolean) => {
        const isExpanded = expandedComments.includes(comentario.id);
        const username = user?.username;
        return (
            <View key={comentario.id} style={[styles.comentarioContainer, { marginLeft: nivel * 5 }]}>

                <TarjetaComentario comentario={comentario} isMainComment={isMainComment} />

                <View style={{ flexDirection: 'row', marginBottom:5,marginTop:5, flex:1, justifyContent:'flex-end' }}>
                    {username === comentario.usuario && (
                        <TouchableOpacity style={styles.responderButton} onPress={() => handleBorrar(comentario.id)}>
                            <Text style={styles.responderText}>Borrar</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.responderButton} onPress={() => handleResponder(comentario.id)}>
                        <Text style={{...styles.responderText, marginLeft:10}}>Responder</Text>
                    </TouchableOpacity>
                </View>
                {comentario.respuestas.length > 0 && (
                    <TouchableOpacity style={styles.responderButton} onPress={() => toggleExpandedComment(comentario.id)}>
                        <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color="gray" />
                        <Text style={styles.responderText}>{isExpanded ? 'Ocultar respuestas' : 'Ver respuestas'}</Text>
                    </TouchableOpacity>
                )}

                {isExpanded && comentario.respuestas.map((respuesta) => renderComentarioRecursivo(respuesta, nivel + 1, false))}
            </View>
        );
    };

    const handlePublicar = async () => {
        if (!token) {
            return;
        }
        if (!nuevoComentario.trim()) {
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const body = {
                contenido: nuevoComentario,
                comentarioPadre_id: null,
            };
            const response = await routineApi.post(`/comentarios/${rutina.id}`, body, config);

            fetchData();

            setNuevoComentario('');
            Keyboard.dismiss();
        } catch (error) {
            console.error(error);
        }
    };

    const handleResponder = (comentariopadreId: number) => {
        setComentarioPadreId(comentariopadreId);
        setTextoRespuesta('');
        setMostrarTextInput(true);
        setMostrarNuevoComentario(false);

    }

    const handlePublicarRespuesta = async () => {
        if (!token) {
            return;
        }
        // if (!textoRespuesta.trim()) {
        //     return;
        // }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const body = {
                contenido: textoRespuesta,
                comentarioPadre_id: comentarioPadreId,
            };
            const response = await routineApi.post(`/comentarios/${rutina.id}`, body, config);

            fetchData();

            setTextoRespuesta('');
            setMostrarTextInput(false);
            Keyboard.dismiss();
        } catch (error) {
            console.error(error);
        }
    }

    const handleBorrar = async (comentarioId: number) => {
        Alert.alert('Confirmación', `Vas a eliminar un comentario ${comentarioId} de la rutina , ¿estás seguro?`,
            [
                {
                    text: 'Aceptar', onPress: async () => {
                        if (!token || !rutina) {
                            return; // No realizar la llamada a la API si no hay un token de autenticación o si rutina es undefined
                        }
                        try {
                            const config = {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            };
                            const response = await routineApi.delete(`/comentarios/${comentarioId}`, config);
                            fetchData();
                        } catch (error) {
                            console.log('Error al eliminar el comentario:', error);
                        }
                    }
                },
                { text: 'Cancelar', onPress: () => { } }
            ]);
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
            >
                <Icon name="arrow-back-outline" size={25} color="#5856D6" />
                <Text style={{ ...styles.buttonTextVolver, fontSize: 20 }}>Volver</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{rutina?.nombre}: Comentarios {comentarios.length}</Text>

            <FlatList
                data={comentarios.filter((comentario) => comentario.comentarioPadre_id === null)}
                renderItem={({ item }) => renderComentarioRecursivo(item, 0, true)}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
            />


            {!mostrarTextInput && (
                <View style={styles.nuevoComentarioContainer}>
                    <TextInput
                        style={styles.nuevoComentarioInput}
                        value={nuevoComentario}
                        onChangeText={setNuevoComentario}
                        placeholder="Escribe un nuevo comentario"
                    />
                    <TouchableOpacity
                        style={[styles.enviarButton, nuevoComentario.trim() ? {} : styles.enviarButtonDisabled]}
                        onPress={handlePublicar}
                        disabled={!nuevoComentario.trim()}
                    >
                        <Text style={{ color: 'white' }}>Enviar</Text>
                    </TouchableOpacity>
                </View>
            )}


            {mostrarTextInput && (
                <View style={styles.nuevoComentarioContainer}>
                    <TextInput
                        style={styles.nuevoComentarioInput}
                        value={textoRespuesta}
                        onChangeText={setTextoRespuesta}
                        placeholder="Escribe tu respuesta"
                        autoFocus={true}
                    />
                    <TouchableOpacity
                        style={[styles.enviarButton, textoRespuesta.trim() ? {} : styles.enviarButtonDisabled]}
                        onPress={handlePublicarRespuesta}
                        disabled={!textoRespuesta.trim()}
                    >
                        <Text style={{ color: 'white' }}>Enviar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    title: {
        color: '#5856D6',
        fontSize: 24,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    comentarioContainer: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    usuario: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    responderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    responderText: {
        marginLeft: 5,
        color: 'gray',
    },
    nuevoComentarioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 0,
        borderTopColor: 'grey',
        paddingTop: 10,
        paddingBottom: 10,
    },
    nuevoComentarioInput: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginRight: 10,
    },
    enviarButton: {
        backgroundColor: '#5856D6',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        alignItems: 'center',
    },
    enviarButtonDisabled: {
        backgroundColor: 'gray',
    }, button: {
        backgroundColor: 'white',
        paddingVertical: 10,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#5856D6',
        width: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        marginLeft: 14,
    },
    buttonTextVolver: {
        color: '#5856D6',
        textAlign: 'center',
    },
});
