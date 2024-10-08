<script setup lang="ts">
import { DropdownStates, type DocumentationIndexItem, type RecommendedItem } from '@/assets/customTypes';
import { useDocumentationStore } from '@/stores/DocumentationStore';

// Setup
const documentationStore = useDocumentationStore();

// Reactive Data
const docIndexItems: Ref<Array<DocumentationIndexItem>> = ref([]);
const guideIndexItems: Ref<Array<DocumentationIndexItem>> = ref([]);
const recommendedItems: Ref<Array<RecommendedItem>> = ref([]);

// Props
defineProps({
    "informationDropdownVisible": { type: Boolean, required: false },
    "productDropdownVisible": { type: Boolean, required: false },
    "navigationDropdownVisible": { type: Boolean, required: false },
    "commentOverlayVisible": { type: Boolean, required: true },
});

// Lifecycle
onMounted(async () => {
    // Pinia Watcher
    documentationStore.$subscribe((_mutation, state) => {
        docIndexItems.value = state.docIndex;
        guideIndexItems.value = state.guideIndex;

        const newRecommendedItems: Array<RecommendedItem> = state.recommendedDocItems.concat(state.recommendedGuideItems);
        recommendedItems.value = newRecommendedItems;
    });

    // Initial Load - Indices
    docIndexItems.value = await documentationStore.getIndex(false, "Doc");
    guideIndexItems.value = await documentationStore.getIndex(false, "Guide");

    // Initial Load - Recommended
    const initialRecommendedItems: Array<RecommendedItem> = (await documentationStore.getRecommendedItems(false, "Doc"))
        .concat(await documentationStore.getRecommendedItems(false, "Guide"));
    recommendedItems.value = initialRecommendedItems;
});

// Emitters
const emit = defineEmits(["dropdownState"]);
function handleDropdownState(name: DropdownStates, newValue: boolean): void {
    emit("dropdownState", name, newValue);
};

// SEO
const metaItems = [
    { name: "keywords", content: `SK Platform, SK Docs, SK Docs, Stefan Kruik, stefankruik, bots, services, products, developers, community` },
    { name: "author", content: "Stefan Kruik, platform@stefankruik.com" },
    { name: "owner", content: "Stefan Kruik" },
    { name: "color-scheme", content: "dark" },
    { name: "theme-color", content: "#1E1F24" },
    { property: "og:title", content: "SK Platform | Documentation" },
    { property: "og:description", content: "The documentation for the SK Platform. Learn how to use the platform, its products, and services." },
    { property: "og:url", content: `https://platform.stefankruik.com/documentation` },
    { property: "og:type", content: "website" },
];
useHead({
    title: "SK Platform",
    meta: metaItems,
    htmlAttrs: {
        lang: documentationStore.language.split("-")[0] || "en"
    }
});
</script>

<template>
    <section class="banner flex">
        <div class="banner-content flex hero">
            <div class="hero-left flex-col">
                <h1>Information & Guides</h1>
                <h3 class="content-splitter-header light-text ">Explore information about SK Platform
                    and related product lines.
                </h3>
                <img class="mesh" src="/Mesh_1.png" alt="Abstract Mesh">
            </div>
            <div class="hero-right flex">
                <NuxtLink to="/documentation/read/Doc/Products/Bots#Interpres">
                    <img src="https://files.stefankruik.com/Products/500/Interpres.png" class="hero-bot-image"
                        title="Interpres, GitHub API proxy bot." alt="Interpres Profile Picture">
                </NuxtLink>
                <NuxtLink to="/documentation/read/Doc/Products/Bots#Ispidina">
                    <img src="https://files.stefankruik.com/Products/500/Ispidina.png" class="hero-bot-image"
                        title="Ispidina, TypeScript pioneer bot." alt="Ispidina Profile Picture">
                </NuxtLink>
                <NuxtLink to="/documentation/read/Doc/Products/Bots#Stelleri">
                    <img src="https://files.stefankruik.com/Products/500/Stelleri.png" class="hero-bot-image"
                        title="Stelleri, early-access features bot." alt="Stelleri Profile Picture">
                </NuxtLink>
                <NuxtLink to="/documentation/read/Doc/Products/Bots#Apricaria">
                    <img src="https://files.stefankruik.com/Products/500/Apricaria.png" class="hero-bot-image"
                        title="Apricaria, second gen main production bot." alt="Apricaria Profile Picture">
                </NuxtLink>
            </div>
        </div>
    </section>
    <section class="content-container">
        <div class="content-item recommended-parent">
            <h3 class="banner-content content-splitter-header">Recommended pages</h3>
            <div class="banner-content recommended-item-container flex">
                <DocumentationRecommendedItem
                    v-if="recommendedItems.length > 0 && recommendedItems[0].title !== 'None_Available'"
                    v-for="recommendedItem of recommendedItems" :key="recommendedItem.id" :data="recommendedItem">
                </DocumentationRecommendedItem>
                <article v-else-if="recommendedItems.length > 0 && recommendedItems[0].title === 'None_Available'"
                    class="flex-col error-message">
                    <p>Looks like there aren't any recommended items available in your language and version at this
                        time.</p>
                    <p>I am working hard on versioning and localization. In the meantime, please revert any
                        changes to their default settings.</p>
                </article>
                <div class="error-message" v-else>Something went wrong while retrieving the recommended items. Please
                    try again later.
                </div>
            </div>
        </div>
        <div class="banner-content flex-col section-title-container">
            <h2 id="Information">Information</h2>
            <p class="light-text">In-depth information about all topics from integrating to
                managing the SK Platform products.</p>
        </div>
        <div class="content-item">
            <div class="banner-content category-container-parent flex">
                <div class="banner-content category-container"
                    v-if="docIndexItems.length > 0 && docIndexItems[0].category !== 'None_Available'">
                    <DocumentationCategoryItem v-for="docIndexItem of docIndexItems" :data="docIndexItem" type="Doc"
                        :key="docIndexItem.category"></DocumentationCategoryItem>
                </div>
                <article v-else-if="docIndexItems.length > 0 && docIndexItems[0].category === 'None_Available'"
                    class="flex-col error-message">
                    <p>Looks like there aren't any Docs available in your language and version at this
                        time.</p>
                    <p>I am working hard on versioning and localization. In the meantime, please revert any
                        changes to their default settings.</p>
                </article>
                <div class="error-message" v-else>Something went wrong while retrieving the documentation index. Please
                    try again later.
                </div>
            </div>
        </div>
    </section>
    <section class="content-container last-content-container">
        <div class="banner-content flex-col section-title-container">
            <h2 id="Guides">Guides</h2>
            <p class="light-text">Step-by-step tutorials on performing a wide variety of actions.</p>
        </div>
        <div class="content-item">
            <div class="banner-content category-container-parent flex">
                <div class="banner-content category-container"
                    v-if="guideIndexItems.length > 0 && guideIndexItems[0].category !== 'None_Available'">
                    <DocumentationCategoryItem v-for="guideIndexItem of guideIndexItems" :key="guideIndexItem.category"
                        :data="guideIndexItem" type="Guide">
                    </DocumentationCategoryItem>
                </div>
                <article v-else-if="docIndexItems.length > 0 && docIndexItems[0].category === 'None_Available'"
                    class="flex-col error-message">
                    <p>Looks like there aren't any Guides available in your language and version at this time.</p>
                    <p>I am working hard on versioning and localization. In the meantime, please revert any
                        changes to their default settings.</p>
                </article>
                <p class="error-message" v-else>Something went wrong while retrieving the guide index. Please try again
                    later.</p>
            </div>
        </div>
    </section>
    <section class="content-container last-content-container">
        <div class="banner-content flex-col section-title-container">
            <h2 id="More">More</h2>
            <span class="splitter"></span>
        </div>
        <DocumentationFooter @dropdown-state="handleDropdownState" :comment-overlay-visible="commentOverlayVisible"
            :type="undefined" :category="undefined" :page="undefined"></DocumentationFooter>
        <div class="banner-content last-content-container footer-wrapper flex-col">
            <div class="flex footer-note">
                <a href="https://github.com/SVKruik">
                    <p class="disabled-text">Stefan Kruik</p>
                </a>
                <i class="fa-regular fa-circle-small disabled-text"></i>
                <p class="disabled-text">{{ new Date().getFullYear() }}</p>
                <i class="fa-regular fa-circle-small disabled-text"></i>
                <a href="https://github.com/SVKruik-Organization/SK-Platform" target="_blank">
                    <p class="disabled-text">v2_dev_beta</p>
                </a>
            </div>
            <div class="flex footer-note">
                <p class="disabled-text">Made with</p>
                <i class="fa-solid fa-heart disabled-text"></i>
                <p class="disabled-text">by 🇺🇦, hosted in 🇳🇱</p>
            </div>
        </div>
    </section>
</template>

<style scoped>
.banner {
    width: 100%;
    background-color: var(--fill);
    height: 300px;
    box-sizing: border-box;
    padding: 40px;
    justify-content: center;
    margin-bottom: 40px;
    overflow: hidden;
}

.hero-left {
    position: relative;
}

.hero-left h1,
.hero-left h3 {
    z-index: 1;
}

.mesh {
    position: absolute;
    left: -550px;
    top: -400px;
    width: 1200px;
    opacity: 0.2;
    -webkit-user-select: none;
    user-select: none;
    filter: blur(50px);
}

h1 {
    font-size: xx-large;
}

.content-splitter-header {
    font-weight: 500;
}

.content-container,
.content-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: unset;
    gap: 40px;
}

.content-item {
    gap: 30px;
    width: 100%;
}

.banner-content {
    width: 1200px;
}

.category-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    justify-items: flex-start;
}

.category-header {
    gap: 15px;
}

.hero {
    justify-content: space-between;
}

.hero-bot-image {
    border-radius: 50%;
    border: 5px solid var(--fill);
    aspect-ratio: 1 / 1;
    height: 150px;
    object-fit: cover;
    margin-left: -75px;
    -webkit-user-select: none;
    user-select: none;
}

.recommended-parent {
    margin-bottom: 40px;
}

.recommended-item-container {
    flex-wrap: wrap;
    gap: 20px;
}

.footer-wrapper {
    margin-bottom: 15px;
    margin-top: 40px;
    width: 100%;
    align-items: center;
}

.footer-note {
    align-self: center;
}

.footer-note p {
    font-size: small
}

.footer-note i {
    font-size: 10px;
}

.error-message {
    margin-bottom: 30px;
    width: 95%;
    text-align: center;
}

@media (width <=1280px) {
    .banner {
        padding: 10px;
    }

    .banner-content {
        width: 100%;
    }

    .section-title-container {
        align-items: center;
    }

    .banner-content h2,
    .banner-content p {
        width: 90%;
        text-align: center;
    }

    .category-container-parent {
        justify-content: center;
    }

    .recommended-item-container {
        justify-content: center;
        width: 90%;
    }

    .category-container {
        grid-template-columns: 1fr 1fr 1fr;
        justify-items: flex-end;
    }

    .content-splitter-header {
        text-align: center;
    }

    .hero {
        justify-content: space-evenly;
    }

    .hero-bot-image {
        height: 100px;
        margin-left: -50px;
    }

    .splitter {
        width: 90%;
    }

    .footer-note p {
        width: max-content;
    }
}

@media (width <=1070px) {
    .hero {
        flex-direction: column;
        justify-content: center;
        gap: 30px;
        height: 100%;
    }

    .hero-left {
        width: 95%;
    }

    .hero-left h1,
    .hero-left h3 {
        width: 100%;
        text-align: center;
    }

    .hero-right {
        margin-right: -35px;
    }

    .hero-bot-image {
        height: 70px;
        margin-left: -35px;
    }

    .mesh {
        left: 50%;
        transform: translateX(-50%);
    }
}

@media (width <=580px) {
    .category-container {
        gap: 40px;
    }

    .last-content-container {
        margin-top: 40px;
    }

    .category-container {
        grid-template-columns: 1fr 1fr;
    }
}

@media (width <=360px) {
    .category-container {
        grid-template-columns: 1fr;
    }
}
</style>
