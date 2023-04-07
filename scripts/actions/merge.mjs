import { WebhookClient } from 'discord.js';

const webhookClient = new WebhookClient({
    id: process.env.DISCORD_WEBHOOK_MERGE_ID,
    token: process.env.DISCORD_WEBHOOK_MERGE_TOKEN
});

webhookClient.send({
	content: 'Webhook test',
});