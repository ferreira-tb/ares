<script setup>
import FlexImage from '../components/FlexImage.vue';
</script>

# Contribua

Devido a limitações de tempo, o desenvolvimento do Ares tem sido lento. Por isso, qualquer ajuda é muito bem-vinda, para que assim consigamos entregar novas funcionalidades mais rapidamente.

## Testes
Sem sombra alguma de dúvida, a melhor forma de contribuir é testando o Ares e reportando qualquer problema que você encontrar. Seja um bug, uma funcionalidade que não funciona como deveria ou até mesmo um texto mal escrito, qualquer coisa que você achar que pode ser melhorada pode ser reportada no [Discord](https://discord.gg/tNQbrqbmdK).

Ao reportar um erro, é recomendado exportar o registro de erros e enviar o arquivo junto com a descrição do problema. Para isso, basta clicar no botão no mostrado na imagem abaixo e então em `Exportar`. O arquivo será salvo num local de sua preferência.

<FlexImage src="/screenshots/error-log.png" alt="Registro de erros" />

## Tradução
Atualmente o Ares só está disponível em português do Brasil, mas a ideia é que ele seja eventualmente traduzido para outras línguas. No entanto, não é suficiente apenas traduzir o texto, pois algumas funcionalidades são muito dependentes da região.

Um exemplo simples, mas muito pertinente, é a obtenção de datas para certos cálculos. Em alguns casos, o Ares precisa analisar um texto e, a partir de seu formato, determinar quando um dado evento ocorreu. Se ele não for capaz de reconhecer o formato, não será possível obter a data.

## Código
Se você é um desenvolvedor, pode contribuir de forma muito mais direta, seja corrigindo bugs, implementando novas funcionalidades ou até mesmo melhorando o código existente.

O Ares é escrito usando [TypeScript](https://www.typescriptlang.org/), que, grosso modo, é uma versão tipada do [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript). Se você já conhece JavaScript, não terá dificuldades em aprender TypeScript, pois a sintaxe é praticamente a mesma.

A interface do usuário é construída usando [Vue.js](https://vuejs.org/), um framework bastante simples, mas extremamente poderoso. Se você já conhece algum framework como React ou Angular, não terá dificuldades em aprender Vue.

Dentre outras coisas, o Ares usa [Electron](https://www.electronjs.org/), que é a ferramenta que possibilita a criação de aplicativos desktop a partir de puro TypeScript, e [Sequelize](https://sequelize.org/) (versão 6), que é um [ORM](https://pt.wikipedia.org/wiki/Mapeamento_objeto-relacional) para [Node.js](https://nodejs.org/en). Embora não seja necessário conhecê-los para contribuir, é recomendado que você ao menos leia a documentação deles.

::: info Iniciantes são bem-vindos
Não é necessariamente um problema se você quer ajudar com o código, mas não tem experiência com TypeScript ou Vue. Se você estiver disposto a aprender, pode começar com tarefas mais simples, como corrigir erros de digitação ou melhorar a organização do código.

No entanto, dar o suporte que você precisa para aprender essas tecnologias é algo que despende bastante tempo. Apesar de estarmos dispostos a disponibilizar esse tempo, é necessário muito comprometimento da sua parte.
:::