import {Schema, model} from 'mongoose'

export interface UserInterface {
    id: number,
    name?: string,
    age?: number,
    email: string,
    username: string,
    password: string
}

export interface UserLoginInterface {
    email?: string,
    username?: string,
    password: string
}

export const userSchema = new Schema<UserInterface>({
    id: {
        type: Number,
        required: true
    },
    name: String,
    age: Number,
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const UserModel = model('user', userSchema)
export default UserModel