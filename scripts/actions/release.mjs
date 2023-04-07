import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EmbedBuilder, WebhookClient } from 'discord.js';
import { Octokit } from '@octokit/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const requestInfo = {
    owner: 'ferreira-tb',
    repo: 'ares',
    headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        accept: 'application/vnd.github+json'
    }
};

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const releases = await octokit.request('GET /repos/{owner}/{repo}/releases', { ...requestInfo });
const assets = await octokit.request('GET /repos/{owner}/{repo}/releases/assets/{asset_id}', {
    ...requestInfo,
    asset_id: releases.data[0].assets[0].id
});

const latest = {
    version: releases.data[0].tag_name,
    notes: releases.data[0].html_url,
    download: assets.data.browser_download_url,

    isAlpha: releases.data[0].tag_name.includes('alpha'),
    date: Date.parse(releases.data[0].published_at)
};

const previous = {
    version: releases.data[1].tag_name,
    notes: releases.data[1].html_url
};

const embed = new EmbedBuilder()
    .setTitle(latest.version)
    .setURL(latest.notes)
    .setAuthor({ name: 'Nova versão disponível', iconURL: process.env.ICON_URL_LIGHT })
    .setThumbnail(process.env.ICON_URL_LIGHT)
    .addFields(
        { name: 'Download', value: `[Clique aqui](${latest.download})`, inline: true },
        { name: 'Notas de atualização', value: `[Clique aqui](${latest.notes})`, inline: true },
        { name: 'Versão anterior', value: `[${previous.version}](${previous.notes})`, inline: true }
    )
    .addFields({ name: 'Encontrou algum bug?', value: `Por favor, reporte-o [aqui](${process.env.DISCORD_CHANNEL_URL_BUGS}).` })
    .setTimestamp(latest.date)
    .setFooter({ text: 'Essa mensagem foi gerada automaticamente.' });

if (latest.isAlpha) {
    embed.setDescription(
        'Essa versão, assim como toda do tipo alpha, é instável e deve ser usada apenas para testes. ' +
        'Aguarde até que uma versão estável esteja disponível.'
    );
};

const webhookClient = new WebhookClient({
    id: process.env.DISCORD_WEBHOOK_RELEASE_ID,
    token: process.env.DISCORD_WEBHOOK_RELEASE_TOKEN
});

await webhookClient.send({ embeds: [embed] });

// Atualiza o arquivo latest.json
const docsDir = path.resolve(__dirname, '../../docs');
const latestJson = path.join(docsDir, 'latest.json');
await fs.writeFile(latestJson, JSON.stringify(latest, null, 4), 'utf-8');