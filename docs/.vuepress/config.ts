// import * as path from 'node:path';
import { defineUserConfig } from 'vuepress';
import { defaultTheme } from '@vuepress/theme-default';
// import { registerComponentsPlugin } from '@vuepress/plugin-register-components';
import { navbar } from './navbar';

export default defineUserConfig({
    base: '/ares/',
    description: 'Uma ferramenta para Tribal Wars',
    lang: 'pt-br',
    title: 'Ares',

    head: [
        ['link', { rel: 'icon', href: 'favicon.ico' }]
    ],

    theme: defaultTheme({
        colorMode: 'dark',
        colorModeSwitch: true,
        contributors: true,
        docsBranch: 'main',
        docsDir: 'docs',
        editLink: true,
        editLinkText: 'Edite esta página',
        lastUpdated: true,
        lastUpdatedText: 'Última atualização',
        logo: '/favicon.ico',
        repo: 'ferreira-tb/ares',
        repoLabel: 'Repositório',
        navbar
    }),

    /*
    plugins: [
        registerComponentsPlugin({
            componentsDir: path.resolve(__dirname, './components')
        })
    ]
    */
});