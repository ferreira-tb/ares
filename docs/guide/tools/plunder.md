<script setup>
import FlexImage from '../../components/FlexImage.vue';
</script>

# Saque

::: warning Assistente de saque
Para usar essa funcionalidade, é necessário ter assistente de saque ativo.
:::

Dentre todas as coisas que uma ferramenta como o Ares pode fazer, o saque com certeza está entre as mais importantes. Assim sendo, é natural que seja uma das funcionalidades que mais recebe atenção durante o desenvolvimento.

A lógica de funcionamento do saque é bastante simples, mas essencialmente diferente do que a maioria das pessoas está acostumada. Aqui apresentamos uma explicação das opções disponíveis e como elas afetam o funcionamento do saque, para que você possa tirar o máximo proveito dessa funcionalidade.

## Painel

<FlexImage src="/screenshots/panel-plunder.png" alt="Painel - Assistente de Saque" />

- **Ignorar muralha**: impede ataques contra aldeias que tenham muralha. É recomendado utilizar essa opção em conjunto com a opção `destruir muralha` (explicada mais adiante).

- **Destruir muralha**: instrui o Ares a tentar destruir a muralha das aldeias atacadas. Essa opção tem prioridade sobre `ignorar muralha`, ou seja, se ambas estiverem marcadas, o Ares tentará destruir a muralha. Se ele não conseguir e `ignorar muralha` estiver ativo, ele não atacará a aldeia. É bastante comum, e recomendado, utilizar essas duas opções em conjunto.

- **Ignorar delay**: o Tribal Wars impõe um limite em quantas ações podem ser realizadas em um segundo. Para impedir que esse limite seja alcançado durante os ataques, o Ares adiciona um pequeno atraso entre cada ataque. Essa opção permite que você remova esse atraso.

- **Ataque em grupo**: permite que o Ares ataque a partir de várias aldeias, usando como base um grupo dinâmico. Grupos manuais não são permitidos.

- **Usar modelo C**: permite que o Ares utilize o modelo C ao atacar. Esse modelo é bastante propenso ao desperdício, mas, se bem usado, pode ser muito eficiente. Alterar o padrão do modelo C para a modalidade `quando em excesso` pode ajudar a mitigar esse desperdício.

- **Ataque às cegas**: normalmente, o Ares se baseia na quantidade de recursos previstos para a aldeia para determinar se deve ou não atacá-la. Se não há informações suficientes, ele simplesmente não ataca. Essa opção permite que você altere esse comportamento, forçando-o a atacar.

## Ataque
- **Distância máxima**: define a distância máxima (em campos) que o Ares deve atacar. Aldeias mais distantes serão ignoradas.

- **Evitar mais antigos que**: impede que o Ares ataque aldeias contra as quais o último ataque tenha ocorrido há uma quantidade de horas superior ao valor definido.

- **Delay entre ataques**: define o tempo (em milissegundos) que o Ares deve esperar entre cada ataque. Esse valor é ignorado se `ignorar delay` estiver ativo.

- **Razão de saque**: corresponde à razão entre a quantidade de recursos que se espera haver na aldeia e a capacidade de carga do modelo atacante. Quanto menor for o valor definido nessa opção, mais "relaxado" o Ares será ao atacar, o que pode acarretar em desperdícios. Por outro lado, valores muito altos podem fazer com que ele se torne muito estrito e não ataque boas aldeias. Recomenda-se que o valor seja mantido entre 0.5 e 0.8.

- **Padrão do ataque às cegas**: define o parâmetro que será empregado para determinar o modelo atacante, com base na capacidade de carga de cada um, quando a opção `ataque às cegas` estiver ativa e não houver informações suficientes sobre a aldeia.

## Modelo C
- **Padrão do modelo C**: define a maneira como o Ares utilizará o modelo C quando `usar modelo C` estiver ativo.
  - `Normal`: tentará utilizar o modelo C sempre que possível, mas, se não for, usará um modelo convencional.
  - `Somente C`: se o Ares não puder utilizar o modelo C, ele não atacará a aldeia.
  - `Quando em excesso`: como `normal`, mas a tentativa só ocorrerá se a quantidade de recursos prevista na aldeia for muito alta.

- **Distância máxima**: define a distância máxima (em campos) que o Ares deve atacar usando o modelo C. Aldeias mais distantes serão ignoradas.

- **Evitar mais antigos que**: impede que o Ares ataque aldeias contra as quais o último ataque tenha ocorrido há uma quantidade de horas superior ao valor definido quando estiver utilizando o modelo C.

- **Usar C se a razão for maior que**: define a razão entre a quantidade de recursos que se espera haver na aldeia e a capacidade de carga do melhor modelo disponível. Se essa razão for maior que o valor definido, o Ares utilizará o modelo C.

## Grupo
::: warning Conta premium
Para usar o ataque em grupo, é necessário ter uma conta premium.
:::

::: tip Dica
A lista de grupos não é atualizada automaticamente quando um grupo é criado ou excluído. É preciso atualizá-la manualmente, clicando no botão `atualizar grupos`.
:::

- **Grupo de ataque**: define o grupo que será utilizado para atacar. Grupos manuais não são permitidos.

- **Campos por onda**: quando está atacando em grupo, o Ares não envia todos os ataques possíveis de uma vez. Em vez disso, ele envia uma onda de ataques de uma aldeia e então parte para a próxima, repetindo o processo até que todas as aldeias do grupo tenham enviado seus ataques. Essa opção define a distância máxima (em campos) que o Ares deve atacar em cada onda.

- **Delay entre troca de aldeias**: define o tempo (em milissegundos) que o Ares deve esperar antes de trocar de aldeia quando estiver atacando em grupo.

## Muralha
- **Ignorar a partir de**: define o nível da muralha a partir do qual o Ares deve ignorar a aldeia quando a opção `ignorar muralha` estiver ativa.

- **Destruir a partir de**: define o nível da muralha a partir do qual o Ares deve tentar destruí-la quando a opção `destruir muralha` estiver ativa.

- **Distância máxima de demolição**: impede que o Ares tente destruir a muralha de aldeias que estejam a uma distância (em campos) superior à indicada. A opção `distância máxima` da seção `ataque` tem prioridade sobre essa.

## Outros
- **Atualização automática**: determina o tempo (em minutos) até que a página seja atualizada automaticamente.

- **Estimativa de saque**: por padrão, o Ares sempre considera que o modelo que escolheu para atacar irá saquear o máximo que sua capacidade de carga permite. Essa opção permite que você altere esse comportamento, fazendo com que ele considere apenas uma fração dessa capacidade.

- **Delay entre troca de páginas**: quando o Ares vasculha a lista de aldeias para atacar e não encontra bons alvos, ele tenta trocar para a próxima página. Essa opção define o tempo (em milissegundos) que ele deve esperar antes de cada troca.