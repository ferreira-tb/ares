import { EmbedBuilder, WebhookClient } from 'discord.js';
import { Octokit } from '@octokit/core';

const requestInfo = {
    owner: 'ferreira-tb',
    repo: 'ares',
    headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        accept: 'application/vnd.github+json'
    }
};

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const issue = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}', {
    ...requestInfo, issue_number: Number.parseInt(process.env.GITHUB_EVENT_ISSUE_NUMBER, 10)
});

const data = {
    title: issue.data.title,
    url: issue.data.html_url,
    body: issue.data.body,
    date: Date.parse(issue.data.created_at),
    state: issue.data.state,
    number: issue.data.number,
    labels: issue.data.labels,

    author: issue.data.user.login,
    author_url: issue.data.user.html_url,
    avatar: issue.data.user.avatar_url,

    isPR: Boolean(issue.data.pull_request)
};

const validLabels = ['bug', 'enhancement', 'question'];
if (!data.isPR && data.labels.length > 0 && data.labels.some((label) => validLabels.includes(label.name))) {
    const embed = new EmbedBuilder()
        .setTitle(data.title)
        .setURL(data.url)
        .setThumbnail(data.avatar)
        .setTimestamp(data.date)
        .setFooter({ text: 'Essa mensagem foi gerada automaticamente.' });

    if (data.body) {
        let description = data.body.substring(0, 500);
        if (data.body.length > 500) description += '...';
        embed.setDescription(description);
    };

    if (data.state === 'open') {
        embed.setColor('#6cc644');
        if (process.env.GITHUB_EVENT_ACTION === 'reopened') {
            embed.addFields({ name: 'Status', value: 'Reaberto', inline: true });
        } else {
            embed.addFields({ name: 'Status', value: 'Em aberto', inline: true });
        };

    } else if (data.state === 'closed') {
        embed.setColor('#6e5494');
        embed.addFields({ name: 'Status', value: 'Concluído', inline: true });
    };

    embed.addFields({ name: 'Autor', value: data.author, inline: true });
    embed.addFields({ name: 'Número', value: data.number.toString(10), inline: true });

    const labels = issue.data.labels.map((label) => label.name).join(', ');
    embed.addFields({ name: 'Labels', value: labels });

    const webhookClient = createWebhookClient();
    await webhookClient.send({ embeds: [embed] });
};

function createWebhookClient() {
    let credentials;

    if (data.labels.some((label) => label.name === 'bug')) {
        credentials = {
            id: process.env.DISCORD_WEBHOOK_BUG_ID,
            token: process.env.DISCORD_WEBHOOK_BUG_TOKEN
        };
    } else if (data.labels.some((label) => label.name === 'enhancement')) {
        credentials = {
            id: process.env.DISCORD_WEBHOOK_ENHANCEMENT_ID,
            token: process.env.DISCORD_WEBHOOK_ENHANCEMENT_TOKEN
        };
    } else if (data.labels.some((label) => label.name === 'question')) {
        credentials = {
            id: process.env.DISCORD_WEBHOOK_QUESTION_ID,
            token: process.env.DISCORD_WEBHOOK_QUESTION_TOKEN
        };
    } else {
        credentials = {
            id: process.env.DISCORD_WEBHOOK_TEST_ID,
            token: process.env.DISCORD_WEBHOOK_TEST_TOKEN
        };
    };

    return new WebhookClient(credentials);
};