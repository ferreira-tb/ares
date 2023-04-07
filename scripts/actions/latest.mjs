import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Octokit } from '@octokit/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
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
        download: assets.data.browser_download_url
    };

    const docsDir = path.resolve(__dirname, '../../docs');
    const latestJson = path.resolve(docsDir, 'latest.json');
    await fs.writeFile(latestJson, JSON.stringify(latest, null, 4), 'utf-8');

} catch (err) {
    if (err instanceof Error) console.error(err);
};