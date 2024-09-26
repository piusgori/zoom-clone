'use server'

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY || '';
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
    const user = await currentUser();

    if (!user) throw new Error('user not authentication');
    if (!apiKey) throw new Error('Stream API key is required');
    if (!apiSecret) throw new Error('Stream secret key is required');

    const client = new StreamClient(apiKey, apiSecret);

    const validity = 60 * 60

    const token = client.generateUserToken({
        user_id: user.id,
        validity_in_seconds: validity
    })

    return token;
}