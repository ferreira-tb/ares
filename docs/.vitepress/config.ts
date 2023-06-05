import { defineConfig } from 'vitepress';

export default defineConfig({
    base: '/ares/',
    title: 'Ares',
    description: 'Uma ferramenta para Tribal Wars',
    lang: 'pt-br',

    themeConfig: {
        logo: '/favicon.ico',
        socialLinks: [
            { icon: 'discord', link: 'https://discord.gg/tNQbrqbmdK' },
            { icon: 'github', link: 'https://github.com/ferreira-tb/ares' }
        ],
        footer: {
            message: 'Released under the <a href="https://github.com/ferreira-tb/ares/blob/main/LICENSE">MIT License</a>.',
            copyright: 'Copyright © 2023 <a href="https://github.com/ferreira-tb">Andrew Ferreira</a>'
        }
    }
});