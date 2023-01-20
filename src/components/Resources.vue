<script setup lang="ts">

</script>

<template>
    <div class="res-area">
        <div>
            <span class="wood icon"></span>
            <span>0</span>
        </div>
        <div>
            <span class="stone icon"></span>
            <span>0</span>
        </div>
        <div>
            <span class="iron icon"></span>
            <span>0</span>
        </div>
        <div>
            <span class="storage icon"></span>
            <span>0</span>
        </div>
    </div>
</template>

<style scoped>
.res-area {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: center;
    justify-items: center;
}

.res-area > div {
    display: flex;
    justify-content: center;
}
</style>