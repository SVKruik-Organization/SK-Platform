<script setup lang="ts">
import { type DocumentationTypes } from '@/assets/customTypes';

// Setup
const emit = defineEmits(["dropdownState"]);
const route = useRoute();

// Props
defineProps({
    "informationDropdownVisible": { type: Boolean, required: false },
    "productDropdownVisible": { type: Boolean, required: false },
    "navigationDropdownVisible": { type: Boolean, required: false },
    "commentOverlayVisible": { type: Boolean, required: true },
});

// Route Params
const type: Ref<DocumentationTypes> = ref(route.params.type as DocumentationTypes);
const category: Ref<string> = ref(route.params.category as string);
</script>

<template>
    <div>
        <DocumentationRead :type="type" :category="category" :page="undefined"
            :information-dropdown-visible="informationDropdownVisible"
            :product-dropdown-visible="productDropdownVisible" :navigation-dropdown-visible="navigationDropdownVisible"
            :comment-overlay-visible="commentOverlayVisible" />
    </div>
</template>