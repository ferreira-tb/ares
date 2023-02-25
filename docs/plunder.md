# Assistente de Saque

## Passo-a-passo

### Adição de nova opção de configuração.
- Atualizar o tipo `PlunderConfigType` em `$types/plunder.ts`.
- Atualizar a store em `$vue/stores/plunder.ts`:
    - Adicionar `ref`
    - Atualizar retorno do método `raw()`
    - Atualizar retorno da `store`
- Atualizar o proxy em `$electron/stores/plunder.ts`:
    - Adiciona propriedade à classe `PlunderConfigProxy`
    - Adicionar trap ao proxy
- Atualizar o modelo da tabela do banco de dados em `$tables/plunder.ts`:
    - Adicionar propriedade ao modelo
    - Configurar a coluna da tabela
- Adicionar a nova opção às janelas relevantes, por exemplo:
    - `$panel/views/Plunder.vue`
    - `$modules/components/config/PlunderConfig.vue`
- Testar se tudo está funcionando corretamente.