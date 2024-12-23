// Helpers
import {
  Expo,
} from 'expo-server-sdk';

// Types
import type {
  $Message as Message,
} from './types';

export type $Message = Message;

const zeroValue: number = 0;
const oneValue: number = 1;

class Push {
  expo: Expo;

  constructor() {
    this.expo = new Expo();
  }

  async send({
    message,
    pushTokens,
  }: {
    message: Message;
    pushTokens: Array<string>;
  }): Promise<void> {
    const messages: Array<Message & {
      to: string;
    }> = [];

    pushTokens.forEach((pushToken: string) => {
      if (Expo.isExpoPushToken(pushToken)) {
        messages.push({
          to: pushToken,
          ...message,
        });
      }
    });

    const chunks = this.expo.chunkPushNotifications(messages);

    for (let index = zeroValue; index < chunks.length; index += oneValue) {
      await this.expo.sendPushNotificationsAsync(chunks[index]);
    }
  }
}

export default Push;
