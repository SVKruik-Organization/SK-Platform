<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "DocumentationNotFound"
});
</script>

<template>
    <div class="content-container flex-col">
        <h1>Documentation "{{ $route.query.type }}" not found.</h1>
        <h4>Seems like page "{{ $route.query.page || "__" }}" does not exist on category "{{ $route.query.category }}".
        </h4>
    </div>
</template>

<style scoped></style>
