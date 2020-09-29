import userAPI from '../apis/userAPI.js'
import {
    LOGIN_USER,
    AUTH_USER
} from './types.js'



export async function loginUser(datatoSubmit){
    const request = await userAPI.loginUser(datatoSubmit)
    return {
        type: LOGIN_USER,
        payload: request
    }
}

export async function auth(){
    const request = await userAPI.auth()
    return {
        type: AUTH_USER,
        payload: request
    }
}