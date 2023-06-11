import { defineConfig } from 'vitepress';

export default defineConfig({
    base: '/ares/',
    title: 'Ares',
    description: 'Uma ferramenta para Tribal Wars',
    lang: 'pt-br',
    lastUpdated: true,

    head: [
        ['link', { rel: 'icon', href: '/ares/favicon.ico' }]
    ],

    themeConfig: {
        logo: '/favicon.ico',
        outlineTitle: 'Nesta página',
        lastUpdatedText: 'Última atualização',
        darkModeSwitchLabel: 'Aparência',
        returnToTopLabel: 'Voltar ao topo',
        langMenuLabel: 'Idioma',

        nav: [
            { text: 'Guia', link: '/guide/what-is-ares', activeMatch: '/guide/' }
        ],

        sidebar: {
            '/guide/': sidebarGuide()
        },

        editLink: {
            pattern: 'https://github.com/ferreira-tb/ares/edit/main/docs/:path',
            text: 'Editar esta página no GitHub'
        },

        search: {
            provider: 'local',
            options: {
                locales: {
                    root: {
                        translations: {
                            button: {
                                buttonText: 'Pesquisar',
                                buttonAriaLabel: 'Pesquisar'
                            },
                            modal: {
                                noResultsText: 'Nenhum resultado encontrado',
                                resetButtonTitle: 'Limpar',
                                displayDetails: 'Mostrar detalhes',
                                backButtonTitle: 'Voltar',
                                footer: {
                                    navigateText: 'Ir',
                                    selectText: 'Selecionar',
                                    closeText: 'Fechar'
                                }
                            }
                        }
                    }
                }
            }
        },

        socialLinks: [
            { icon: 'discord', link: 'https://discord.gg/tNQbrqbmdK' },
            { icon: 'github', link: 'https://github.com/ferreira-tb/ares' }
        ],

        footer: {
            message: '<a href="https://github.com/ferreira-tb/ares/blob/main/LICENSE">Licença MIT</a>',
            copyright: 'Copyright © 2023 <a href="https://github.com/ferreira-tb">Andrew Ferreira</a>'
        },

        docFooter: {
            prev: 'Página anterior',
            next: 'Próxima página'
        }
    }
});

function sidebarGuide() {
    return [
        {
            text: 'Introdução',
            collapsed: false,
            items: [
                { text: 'O que é o Ares?', link: '/guide/what-is-ares' },
                { text: 'Como usar', link: '/guide/how-to-use' },
                { text: 'Contribua', link: '/guide/contribute' }
            ]
        },
        {
            text: 'Ferramentas',
            collapsed: false,
            items: [
                { text: 'Academia', link: '/guide/tools/snob' },
                { text: 'Etiquetador', link: '/guide/tools/incomings' },
                { text: 'Saque', link: '/guide/tools/plunder' }
            ]
        }
    ]
};