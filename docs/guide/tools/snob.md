<script setup>
import FlexImage from '../../components/FlexImage.vue';
</script>

# Academia
Ferramentas para a academia.

## Cunhagem

### Como usar
::: warning Conta premium
Para usar a cunhagem em massa, é necessário ter uma conta premium.
:::

<FlexImage src="/screenshots/panel-snob.png" alt="Painel - Academia" />

Acesse a página da academia e clique no botão `Cunhar`, que surgirá no painel. Para configurar a cunhagem, clique no botão `Configurações`.

### Configurações
::: tip Dica
Se já houver cunhagem em andamento, qualquer alteração nas configurações só terá efeito após o término da cunhagem atual. Se quiser interrompê-la, clique no botão `Parar` presente no painel.
:::

- **Modo de cunhagem**: determina como o Ares irá cunhar as moedas. As opções são:
  - `Simples`: cunha a partir de uma única aldeia.
  - `Grupo`: cunha em massa, usando um grupo de aldeias.

- **Intervalo**: determina o intervalo entre as cunhagens.

- **Unidade de tempo**: determina a unidade de tempo do intervalo.

- **Aldeia**: aldeia que realizará a cunhagem quando o modo de cunhagem for `Simples`.

- **Grupo**: grupo de aldeias que realizarão a cunhagem quando o modo de cunhagem for `Grupo`.

::: tip Dica
A lista de grupos não é atualizada automaticamente quando um grupo é criado ou excluído. É preciso atualizá-la manualmente, clicando no botão `atualizar grupos`.
:::