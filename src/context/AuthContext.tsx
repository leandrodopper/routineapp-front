import React, { createContext, useEffect, useReducer } from "react";
import { LoginData, LoginResponse, RegisterData, Usuario } from '../interfaces/appInterfaces';
import { AuthState, authReducer } from "./authReducer";
import routineApi from "../api/routineApi";
import axios, { AxiosError } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';


type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signUp: (registerData: RegisterData) => void;
    signIn: (loginData: LoginData) => void;
    logOut: () => void;
    removeError: () => void;
}

const authInitialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMessage: ''
}

export const AuthContext = createContext({} as AuthContextProps);



export const AuthProvider = ({ children }: any) => {

    const [state, dispatch] = useReducer(authReducer, authInitialState);

    useEffect(() => {
        checkToken();
    }, [])

     const checkToken = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          return dispatch({type: 'notAuthenticated'});
        }
      
        try {
          const resp = await routineApi.get('/auth/validarToken', {
            headers: {Authorization: `Bearer ${token}`},
          });
          dispatch({
            type: 'signIn',
            payload: {
              token: resp.data.token,
              user: resp.data.usuario,
            },
          });
        } catch (error) {
          // Eliminar token no válido del AsyncStorage
          await AsyncStorage.removeItem('token');
          dispatch({type: 'notAuthenticated'});
          Alert.alert('Error', 'Ha ocurrido un error al validar el token de sesión. Por favor, inicie sesión de nuevo.')
        }
      };



    const signUp = async (data: RegisterData) => {
        try {
            const { data: LoginResponse } = await routineApi.post<LoginResponse>('/auth/registrar', data);
            await signIn({ usernameOrEmail: data.username, password: data.password });

        } catch (error) {
            if (error instanceof AxiosError) {
                dispatch({
                    type: 'addError',
                    payload: error.response?.data || 'Error al registrarse'
                })
            } else {
                console.log(error);
            }
        }
    };

    const signIn = async ({ usernameOrEmail, password }: LoginData) => {
        try {
            const { data } = await routineApi.post<LoginResponse>('/auth/iniciarSesion', { usernameOrEmail, password });
            dispatch({
                type: 'signIn',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });

            await AsyncStorage.setItem('token', data.token);

        } catch (error) {
            if (error instanceof AxiosError) {
                dispatch({
                    type: 'addError',
                    payload: error.response?.data || 'Información incorrecta'
                })
            } else {
                console.log(error);
            }

        }
    };


    const logOut = async () => {
        await AsyncStorage.removeItem('token');
        dispatch({ type: 'logout' });
    };


    const removeError = () => {
        dispatch({ type: 'removeError' })
    };

    return (
        <AuthContext.Provider value={{
            ...state,
            signUp,
            signIn,
            logOut,
            removeError,
        }}>
            {children}
        </AuthContext.Provider>

    )
}