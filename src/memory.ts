import { JSONFilePreset } from "lowdb/node";
import type { AIMessage } from "../types";
import { v4 as uuidv4} from "uuid";

export type MessageWithMetadata = AIMessage & {
    id: string
    createdAt: string
}

type Data = {
    messages: MessageWithMetadata[]
}

export const addMetaData =(message : AIMessage) => {
    return {
        ...message,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
    }
}

export const removeMetaData = (message: MessageWithMetadata) => {
    const { id, createdAt, ...rest} = message;
    return rest;
}

const defaultData: Data = {
    messages: []
}

export const getDb = async () => {
    const db = await JSONFilePreset<Data>('db.json', defaultData)
    return db
}

export const addMessages = async ( messages: AIMessage[]) => {
    const db = await getDb()
    db.data.messages.push(...messages.map(addMetaData))
    await db.write()
}

export const getMessages = async () => {
    const db = await getDb()
    return db.data.messages.map(removeMetaData)
}