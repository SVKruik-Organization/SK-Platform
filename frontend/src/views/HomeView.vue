<script lang="ts">
export default {
    name: "HomeView"
};
</script>

<template>
    <main>
        <!-- Cards: Code, Team, Products, API, Plans -->
        <section class="card-container left">
            <div class="card full-card">

            </div>
            <div class="card half-card">

            </div>
            <div class="card half-card">

            </div>
        </section>
        <section class="card-container right">
            <div class="card full-card">

            </div>
            <div class="card half-card">

            </div>
            <div class="card half-card">

            </div>
        </section>
    </main>
</template>

<style scoped>
main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 80%;
    max-height: 800px;
    margin: auto;
    gap: 16px;
}

.card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.left {
    align-content: flex-start;
}

.right {
    align-content: flex-end;
}

.card {
    border-radius: 16px;
    outline: 1px solid white;
}

.full-card {
    width: 100%;
    height: 300px;
}

.half-card {
    width: calc(50% - 8px);
    height: 300px;
}
</style>