<script setup lang="ts">
import { DropdownStates, type DocumentationTypes } from "@/assets/customTypes";

// Setup
const route = useRoute();

// Props
defineProps<{
    informationDropdownVisible?: boolean;
    productDropdownVisible?: boolean;
    navigationDropdownVisible?: boolean;
    commentOverlayVisible: boolean;
}>();

// Route Params
const type: Ref<DocumentationTypes> = ref(route.params.type as DocumentationTypes);
const category: Ref<string> = ref(route.params.category as string);

// Emitters
const emit = defineEmits(["dropdownState"]);
function handleDropdownState(name: DropdownStates, newValue: boolean): void {
    emit("dropdownState", name, newValue);
};
</script>

<template>
    <div>
        <DocumentationRead @dropdown-state="handleDropdownState" :type="type" :category="category" :page="undefined"
            :information-dropdown-visible="informationDropdownVisible"
            :product-dropdown-visible="productDropdownVisible" :navigation-dropdown-visible="navigationDropdownVisible"
            :comment-overlay-visible="commentOverlayVisible" />
    </div>
</template>