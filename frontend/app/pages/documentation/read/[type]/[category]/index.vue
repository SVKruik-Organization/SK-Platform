<script setup lang="ts">
import type{ DocumentationTypes } from "@/assets/customTypes";

// Setup
const route = useRoute();

// Route Params
const type: Ref<DocumentationTypes> = ref(route.params.type as DocumentationTypes);
const category: Ref<string> = ref(route.params.category as string);
</script>

<template>
    <DocumentationRead :type="type" :category="category" />
</template>