<script lang="ts">
import type { DocumentationIndexItem, RecommendedItem } from '@/assets/customTypes';
import DocumentationCategoryItem from '@/components/DocumentationCategoryItem.vue';
import DocumentationRecommendedItem from '@/components/DocumentationRecommendedItem.vue';
import { useDocumentationStore } from '@/stores/DocumentationStore';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "DocumentationHomePage",
    components: {
        DocumentationRecommendedItem,
        DocumentationCategoryItem
    },
    setup() {
        return {
            documentationStore: useDocumentationStore()
        }
    },
    data() {
        return {
            "docIndexItems": [] as Array<DocumentationIndexItem>,
            "guideIndexItems": [] as Array<DocumentationIndexItem>,
            "recommendedItems": [] as Array<RecommendedItem>,
            "pressedButton": "" as string
        }
    },
    async mounted() {
        // Pinia Watcher
        this.documentationStore.$subscribe((mutation, state) => {
            this.docIndexItems = state.docIndex;
            this.guideIndexItems = state.guideIndex;

            const newRecommendedItems: Array<RecommendedItem> = state.recommendedDocItems.concat(state.recommendedGuideItems);
            this.recommendedItems = newRecommendedItems;
        });

        // Initial Load - Indices
        this.docIndexItems = await this.documentationStore.getIndex(false, "Doc");
        this.guideIndexItems = await this.documentationStore.getIndex(false, "Guide");

        // Initial Load - Recommended
        const initialRecommendedItems: Array<RecommendedItem> = (await this.documentationStore.getRecommendedItems(false, "Doc"))
            .concat(await this.documentationStore.getRecommendedItems(false, "Guide"));
        this.recommendedItems = initialRecommendedItems;

        // Anchor Scroll
        if (this.$route.hash) {
            this.scrollAnchor(this.$route.hash === "#Documentation" ? "Doc" : "Guide");
            this.$router.push(this.$route.path);
        }
    },
    methods: {
        scrollAnchor(type: string): void {
            const element: HTMLHeadingElement = this.$refs[type === "Doc" ? "Documentation" : "Guides"] as HTMLHeadingElement;
            if (!element) return;
            element.scrollIntoView({ behavior: "smooth" });
        }
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
            </div>
            <div class="hero-right flex">
                <RouterLink to="/documentation/read/Doc/Products/First_Generation#Ciconia">
                    <img src="/Ciconia.png" class="hero-bot-image" title="Ciconia, first gen main production bot.">
                </RouterLink>
                <RouterLink to="/documentation/read/Doc/Products/Discord_Bots#Interpres">
                    <img src="/Interpres.png" class="hero-bot-image" title="Interpres, GitHub API proxy bot.">
                </RouterLink>
                <RouterLink to="/documentation/read/Doc/Products/Discord_Bots#Ispidina">
                    <img src="/Ispidina.png" class="hero-bot-image" title="Ispidina, TypeScript pioneer bot.">
                </RouterLink>
                <RouterLink to="/documentation/read/Doc/Products/Discord_Bots#Stelleri">
                    <img src="/Stelleri.png" class="hero-bot-image" title="Stelleri, early-access features bot.">
                </RouterLink>
                <RouterLink to="/documentation/read/Doc/Products/Discord_Bots#Apricaria">
                    <img src="/Apricaria.png" class="hero-bot-image" title="Apricaria, second gen main production bot.">
                </RouterLink>
            </div>
        </div>
    </section>
    <section class="content-container">
        <div class="content-item recommended-parent">
            <h3 class="banner-content content-splitter-header">Recommended pages</h3>
            <div class="banner-content recommended-item-container flex">
                <DocumentationRecommendedItem @scrollAnchor="scrollAnchor"
                    v-if="recommendedItems.length > 0 && recommendedItems[0].title !== 'Not_Found'"
                    v-for="recommendedItem of recommendedItems" :key="recommendedItem.id" :data="recommendedItem">
                </DocumentationRecommendedItem>
                <article v-else-if="recommendedItems.length > 0 && recommendedItems[0].category === 'Not_Found'"
                    class="flex-col">
                    <p>Looks like there aren't any recommended items available right now. This is likely due to your
                        language and/or version settings.</p>
                    <p>Please change them to their defaults and try again.</p>
                </article>
                <div v-else>Something went wrong while retrieving the recommended items. Please try again later.
                </div>
            </div>
        </div>
        <div class="banner-content flex-col section-title-container">
            <h2 ref="Documentation">Information</h2>
            <p class="light-text">In-depth information about all topics from integrating to
                managing the SK Platform products.</p>
        </div>
        <div class="content-item">
            <div class="banner-content category-container-parent flex">
                <div class="banner-content category-container"
                    v-if="docIndexItems.length > 0 && docIndexItems[0].category !== 'Not_Found'">
                    <DocumentationCategoryItem v-for="docIndexItem of docIndexItems" :data="docIndexItem" type="Doc"
                        :key="docIndexItem.category"></DocumentationCategoryItem>
                </div>
                <article v-else-if="docIndexItems.length > 0 && docIndexItems[0].category === 'Not_Found'"
                    class="flex-col">
                    <p>Looks like there aren't any docs available right now. This is likely due to your language
                        and/or version settings.</p>
                    <p>Please change them to their defaults and try again.</p>
                </article>
                <div v-else>Something went wrong while retrieving the documentation index. Please try again later.
                </div>
            </div>
        </div>
    </section>
    <section class="content-container last-content-container">
        <div class="banner-content flex-col section-title-container">
            <h2 ref="Guides">Guides</h2>
            <p class="light-text">Step-by-step tutorials on performing a wide variety of actions.</p>
        </div>
        <div class="content-item">
            <div class="banner-content category-container-parent flex">
                <div class="banner-content category-container"
                    v-if="guideIndexItems.length > 0 && guideIndexItems[0].category !== 'Not_Found'">
                    <DocumentationCategoryItem v-for="guideIndexItem of guideIndexItems" :key="guideIndexItem.category"
                        :data="guideIndexItem" type="Guide">
                    </DocumentationCategoryItem>
                </div>
                <article v-else-if="docIndexItems.length > 0 && docIndexItems[0].category === 'Not_Found'"
                    class="flex-col">
                    <p>Looks like there aren't any guides available right now. This is likely due to your language
                        and/or version settings.</p>
                    <p>Please change them to their defaults and try again.</p>
                </article>
                <div v-else>Something went wrong while retrieving the guide index. Please try again later.</div>
            </div>
        </div>
    </section>
    <section class="content-container last-content-container">
        <div class="banner-content flex-col section-title-container">
            <h2 ref="More">More</h2>
            <span class="splitter"></span>
        </div>
        <div class="banner-content documentation-footer">
            <form class="flex-col documentation-footer-item">
                <h4>Happy with SK Docs?</h4>
                <div class="flex">
                    <button @click="pressedButton = 'like'" class="flex footer-button footer-button-like"
                        :class="{ 'active-button-like': pressedButton === 'like' }" type="button"
                        title="Click this if you like the design and information available.">
                        <p>Yes</p>
                        <i class="fa-regular fa-heart light-text"></i>
                    </button>
                    <button @click="pressedButton = 'dislike'" class="flex footer-button footer-button-dislike"
                        :class="{ 'active-button-dislike': pressedButton === 'dislike' }" type="button"
                        title="Click this if you think some things could be better.">
                        <p>No</p>
                        <i class="fa-regular fa-heart-crack light-text"></i>
                    </button>
                </div>
            </form>
            <div class="flex-col documentation-footer-item">
                <h4>Contributing</h4>
                <p class="light-text small-text">See room for improvement or something unclear?</p>
                <div class="flex-col">
                    <RouterLink to="/documentation/read/Doc/Contributing/SK_Docs"
                        class="flex footer-button footer-button-contribute">
                        <p>Help writing SK Docs</p>
                        <i class="fa-regular fa-handshake-angle light-text"></i>
                    </RouterLink>
                </div>
            </div>
            <div class="flex-col documentation-footer-item">
                <h4>Docs didn't cut it?</h4>
                <div class="flex-col">
                    <RouterLink to="/documentation/read/Doc/Community/Support" class="flex footer-link">
                        <i class="fa-regular fa-mailbox-flag-up"></i>
                        <p>Contact support</p>
                    </RouterLink>
                    <RouterLink to="/documentation/read/Doc/Community/Links#Discord" class="flex footer-link">
                        <i class="fa-brands fa-discord"></i>
                        <p>Join the Discord</p>
                    </RouterLink>
                </div>
            </div>
        </div>
        <a href="https://github.com/SVKruik" target="_blank"
            class="banner-content last-content-container footer-note flex">
            <p class="disabled-text">Stefan Kruik</p>
            <i class="fa-regular fa-circle-small disabled-text"></i>
            <p class="disabled-text">{{ new Date().getFullYear() }}</p>
            <i class="fa-regular fa-circle-small disabled-text"></i>
            <p class="disabled-text">v1_dev_alpha</p>
        </a>
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
    border: 1px solid var(--fill);
    aspect-ratio: 1 / 1;
    height: 150px;
    object-fit: cover;
    margin-left: -75px;
    user-select: none;
}

.recommended-parent {
    margin-bottom: 40px;
}

.recommended-item-container {
    flex-wrap: wrap;
    gap: 20px;
}

.splitter {
    width: 100%;
    height: 2px;
    background-color: var(--fill);
}

.documentation-footer {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}

.documentation-footer-item {
    gap: 20px;
}

.footer-button {
    border-radius: var(--border-radius-low);
    border: 1px solid var(--border);
    background-color: var(--fill);
    height: 35px;
    box-sizing: border-box;
    padding: 5px 10px;
    width: max-content;
    justify-content: space-between;
    transition: 0.5s;
}

.footer-button p {
    color: var(--font-light);
}

.footer-button-like:hover {
    border: 1px solid #345a32;
    background-color: #5c7f5d;
}

.footer-button-dislike:hover {
    border: 1px solid #9f4c4c;
    background-color: #8e4444;
}

.footer-button-contribute:hover {
    border: 1px solid #355667;
    background-color: #5b6b78;
}

.footer-button-like:hover p,
.footer-button-like:hover i,
.footer-button-dislike:hover p,
.footer-button-dislike:hover i,
.footer-button-contribute:hover p,
.footer-button-contribute:hover i {
    color: var(--font);
}

.active-button-like {
    border: 1px solid #1d331c;
    background-color: #324633;
}

.active-button-dislike {
    border: 1px solid #703434;
    background-color: #572929;
}

.footer-note {
    margin-bottom: 15px;
    margin-top: 40px;
    width: 100%;
    justify-content: center;
}

.footer-note p {
    font-size: small
}

.footer-note i {
    font-size: 10px;
}

.footer-link {
    gap: 10px;
    padding: 5px;
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

    .documentation-footer {
        display: flex;
        justify-content: center;
        margin-bottom: 70px;
        flex-wrap: wrap;
    }

    .documentation-footer-item {
        gap: 20px;
        width: 300px;
        align-items: center;
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
}

@media (width <=910px) {
    .documentation-footer {
        row-gap: 50px;
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
