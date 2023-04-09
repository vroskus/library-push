// Helpers
import {
  Expo,
} from 'expo-server-sdk';

// Types
import type {
  $Message as Message,
} from './types';

export type $Message = Message;

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

    for (let index = 0; index < chunks.length; index += 1) {
      await this.expo.sendPushNotificationsAsync(chunks[index]);
    }
  }
}

export default Push;
