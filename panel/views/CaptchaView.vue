<script setup lang="ts">
import { NResult } from 'naive-ui';
</script>

<template>
    <main>
        <NResult
            status="warning"
            size="small"
            title="Há um captcha ativo!"
            description="Não será possível usar o Ares até que ele seja removido."
        />
    </main>
</template>

<style scoped lang="scss">
main {
    margin-top: 1.5rem;
}
</style>