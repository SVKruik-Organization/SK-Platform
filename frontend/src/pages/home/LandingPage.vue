<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "LandingPage",
    mounted() {
        console.log(import.meta.env.VITE_API_BASE)
    }
});
</script>

<template>
    <div class="content-parent flex">
        <section class="card-container left">
            <RouterLink class="card full-card" to="/home/product">
                <p>About DEPLOYMENT TEST STRING 1</p>
            </RouterLink>
            <RouterLink class="card half-card small-card" to="/home/pricing">
                <p>Plans</p>
            </RouterLink>
            <RouterLink class="card half-card" to="/home/product">
                <p>Commander App</p>
            </RouterLink>
        </section>
        <section class="card-container right">
            <RouterLink class="card half-card" to="/home/developer">
                <p>API</p>
            </RouterLink>
            <RouterLink class="card half-card small-card" to="/home/documentation">
                <p>Documentation</p>
            </RouterLink>
            <RouterLink class="card full-card" to="/home/product">
                <p>Product</p>
            </RouterLink>
        </section>
    </div>
</template>

<style scoped>
.content-parent {
    display: grid;
    align-items: stretch;
    grid-template-columns: 1fr 1fr;
    margin: auto;
    gap: 16px;
    width: 75%;
    height: 42vw;
    max-width: 1560px;
    max-height: 850px;
    min-height: 500px;
    min-width: 1000px;
}

.card-container {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 10px;
    gap: 16px;
}

.left {
    align-content: flex-start;
}

.right {
    align-content: flex-end;
    align-items: flex-end;
}

.card {
    border-radius: 16px;
    outline: 1px solid white;
    box-sizing: border-box;
    padding: 30px;
}

.full-card {
    width: 100%;
    aspect-ratio: 2.5 / 1;
}

.half-card {
    width: calc(50% - 8px);
    aspect-ratio: 1 / 1;
}

.small-card {
    height: 10vw;
    min-height: 150px;
}

@media (width <=1050px) {
    .content-parent {
        display: grid;
        grid-template-columns: 1fr;
        width: 90%;
        min-width: 0;
    }
}
</style>
