<script lang="ts">
import { DropdownStates, type DocChapterItem, type DocumentationFile, type DocumentationTypes, type RecommendedItem } from '@/assets/customTypes';
import { useDocumentationStore } from '@/stores/DocumentationStore';
import { fetchDocumentationDefault, fetchDocumentationPage } from '@/utils/fetch';
import { defineComponent, type PropType } from 'vue';
import DocumentationFooter from '@/components/DocumentationFooter.vue';
import type { NavigationFailure, RouteLocation } from 'vue-router';
import DocumentationRecommendedItem from '@/components/DocumentationRecommendedItem.vue';

export default defineComponent({
    name: "ReadPage",
    components: {
        DocumentationFooter,
        DocumentationRecommendedItem
    },
    setup() {
        return {
            documentationStore: useDocumentationStore()
        }
    },
    emits: [
        "dropdownState"
    ],
    data() {
        return {
            "fileData": true as DocumentationFile | boolean,
            "chapterData": [] as Array<DocChapterItem>,
            "relatedItems": [] as Array<RecommendedItem>
        }
    },
    props: {
        "type": { type: String as PropType<DocumentationTypes>, required: true },
        "category": { type: String, required: true },
        "page": { type: String, required: false },
        "informationDropdownVisible": { type: Boolean, required: false },
        "productDropdownVisible": { type: Boolean, required: false },
        "navigationDropdownVisible": { type: Boolean, required: false }
    },
    watch: {
        async $route(from: RouteLocation, to: RouteLocation) {
            if (from.path !== to.path) await this.loadContent();
        }
    },
    async mounted() {
        await this.loadContent();
    },
    unmounted() {
        window.removeEventListener('scroll', this.setActiveChapter);
    },
    methods: {
        /**
         * Load all data and components.
         */
        async loadContent(): Promise<void | NavigationFailure | undefined> {
            if (!this.type || !this.category) return;
            if (!this.documentationStore.docIndex.length || !this.documentationStore.guideIndex.length) await this.documentationStore.refresh();

            // Category Landing Page
            if (!this.page) {
                if (!this.documentationStore.validateFolder(this.category, this.type)) return this.$router.push(`/documentation/notfound?type=${this.type}&category=${this.category}`);
                this.fileData = await fetchDocumentationDefault(this.category, this.documentationStore.version, this.documentationStore.language, this.type);

                // Specific Documentation Page
            } else {
                if (!this.documentationStore.validatePage(this.category, this.page, this.type)) return this.$router.push(`/documentation/notfound?type=${this.type}&category=${this.category}&page=${this.page}`);
                this.fileData = await fetchDocumentationPage(this.category, this.page, this.documentationStore.version, this.documentationStore.language, this.type);
                this.chapterData = [];
                if (typeof this.fileData !== "object") return;
                this.relatedItems = this.fileData.related;

                // Chapter URL Hash
                if (this.$route.hash) setTimeout(() => {
                    this.scrollAnchor();
                }, 300);

                // Other Components
                setTimeout(() => {
                    // Chapters
                    if (typeof this.fileData !== "object") return;
                    if (this.fileData.chapters.length) {
                        window.addEventListener('scroll', this.setActiveChapter);
                        for (const chapter of this.fileData.chapters) {
                            const element: HTMLAnchorElement | null = document.getElementById(chapter.slice(1)) as HTMLAnchorElement | null;
                            if (!element) continue;
                            this.chapterData.push({ "title": element.id, "height": element.getBoundingClientRect().top, "active": false });
                        }

                        window.scrollTo(0, 0);
                        this.setActiveChapter();
                    }

                    // Description
                    const description: HTMLHeadingElement | null = document.querySelector(".page-description");
                    if (description) description.innerHTML = this.fileData.description;
                }, 300);
            }
        },
        /**
         * Toggle the information dropdown menu.
         * @param event The click event.
         */
        toggleInformationMenu(event: Event): void {
            const target: HTMLElement = event.target as HTMLElement;
            if (target.tagName === "MENU") return;
            this.$emit("dropdownState", DropdownStates.information, !this.informationDropdownVisible);
        },
        /**
         * Toggle the information dropdown menu.
         * @param event The click event.
         */
        toggleProductMenu(event: Event): void {
            const target: HTMLElement = event.target as HTMLElement;
            if (target.tagName === "SPAN") return;
            this.$emit("dropdownState", DropdownStates.product, !this.productDropdownVisible);
        },
        /**
         * Toggle the information dropdown menu.
         * @param event The click event.
         */
        toggleNavigationBar(event: Event): void {
            const target: HTMLElement = event.target as HTMLElement;
            if (target.tagName === "NAV") return;
            this.$emit("dropdownState", DropdownStates.navigation, !this.navigationDropdownVisible);
        },
        /**
         * Copy the URL to the client clipboard.
         * @param event The click event.
         */
        share(): void {
            const targetButton: HTMLParagraphElement = this.$refs["shareButtonContents"] as HTMLParagraphElement;
            targetButton.innerHTML = "Copied!";
            setTimeout(() => targetButton.innerHTML = "Share", 1000);
            navigator.clipboard.writeText(window.location.href);
        },
        /**
         * Scroll the URL anchor into view.
         */
        scrollAnchor(): void {
            if (typeof this.fileData === "object") {
                const chapters: Array<string> = this.fileData.chapters;
                if (!chapters.includes(this.$route.hash)) return;
                const element: HTMLAnchorElement | null = document.getElementById(this.$route.hash.slice(1)) as HTMLAnchorElement | null;
                const chapterMarker: HTMLAnchorElement | null = document.getElementById(`${this.$route.hash.slice(1)}_aside`) as HTMLAnchorElement | null;
                if (element && chapterMarker) {
                    element.scrollIntoView({ behavior: "smooth" });
                    document.querySelectorAll(".anchored-chapter").forEach((element) => element.classList.remove("anchored-chapter"));
                    element.classList.add("anchored-chapter");
                    chapterMarker.classList.add("anchored-chapter");
                }
            }
        },
        /**
         * Set the active chapter based on the scroll position.
         */
        setActiveChapter(): void {
            if (!this.chapterData.length) return;
            let activeChapterFound = false;
            const offset: number = 130;

            // First Chapter
            if (window.scrollY < this.chapterData[0].height - offset) {
                this.chapterData[0].active = true;
                activeChapterFound = true;
                return;
            }

            // Other Chapters
            for (let i = 0; i < this.chapterData.length; i++) {
                // Setup
                const chapter: DocChapterItem = this.chapterData[i];
                chapter.active = false;

                // Not yet found and within bounds.
                if (!activeChapterFound && chapter.height < window.scrollY + offset && (this.chapterData[i + 1]?.height || Infinity) > window.scrollY + offset) {
                    chapter.active = true;
                    activeChapterFound = true;
                }
            }
        }
    }
});
</script>

<template>
    <div class="content-wrapper flex">
        <div class="navigation-overlay glass" v-if="navigationDropdownVisible"></div>
        <button type="button" class="navigation-button navbar-pill disable-close" @click="toggleNavigationBar($event)"
            title="Open the navigation bar.">
            <i class="fa-regular fa-arrow-right-from-line disable-close"></i>
        </button>
        <nav class="flex" :class="{ 'navigation-expand': navigationDropdownVisible }">
            <section class="navigation flex-col" :class="{ 'disable-close': navigationDropdownVisible }">
                <div class="flex category-title" :class="{ 'disable-close': navigationDropdownVisible }">
                    <RouterLink to="/documentation" title="Go back to the documentation home page.">
                        <i class="fa-regular fa-arrow-left"></i>
                    </RouterLink>
                    <RouterLink :to="`/documentation/Read/${type}/${category}`" class="category-title"
                        title="Go to the category home page.">{{ category }}
                    </RouterLink>
                </div>
                <RouterLink :to="`/documentation/read/${type}/${category}/${link}`" class="navigation-link"
                    :class="{ 'active-navigation-link': link === page }"
                    v-for="link in documentationStore.getCategoryList(type, category)">
                    {{ link.replace(/_/g, " ") }}
                </RouterLink>
                <section class="flex-col responsive-nav" :class="{ 'disable-close': navigationDropdownVisible }"
                    v-if="typeof fileData === 'object' && (chapterData.length || fileData.products.length)">
                    <span class="splitter"></span>
                    <div class="flex-col responsive-nav-item" :class="{ 'disable-close': navigationDropdownVisible }">
                        <strong :class="{ 'disable-close': navigationDropdownVisible }">On This Page</strong>
                        <a :href="`#${chapter.title}`" v-for="(chapter, index) of chapterData"
                            :id="`${chapter.title}_aside`"
                            :class="{ 'active-chapter': chapterData[index].active, 'anchored-chapter': $route.hash === '#' + chapter.title }">
                            {{ chapter.title.replace(/_/g, " ") }}
                        </a>
                    </div>
                    <span class="splitter"></span>
                    <div class="flex-col responsive-nav-item" v-if="fileData.products.length"
                        :class="{ 'disable-close': navigationDropdownVisible }">
                        <div class="flex featured-product-title-container"
                            :class="{ 'disable-close': navigationDropdownVisible }">
                            <strong :class="{ 'disable-close': navigationDropdownVisible }">Featured Products</strong>
                            <i class="fa-regular fa-circle-info"
                                :class="{ 'disable-close': navigationDropdownVisible }"></i>
                            <span :class="{ 'disable-close': navigationDropdownVisible }">Products that have been used
                                in this {{ type }}.</span>
                        </div>
                        <RouterLink class="flex featured-product-item" v-for="product of fileData.products"
                            :to="product.url">
                            <img :src="`https://files.stefankruik.com/Products/${product.name}.png`" alt="Prod Img">
                            <p>{{ product.name }}</p>
                        </RouterLink>
                    </div>
                </section>
            </section>
            <span class="splitter responsive-nav-splitter"></span>
            <section class="controls flex-col" :class="{ 'disable-close': navigationDropdownVisible }">
                <button title="Share this article." class="flex navbar-pill control-pill" type="button"
                    @click="share()">
                    <p ref="shareButtonContents">Share</p>
                    <i class="fa-regular fa-share"></i>
                </button>
                <button title="View page information." type="button" v-if="typeof fileData === 'object'"
                    class="flex dropdown-container justify-center navbar-pill disable-close"
                    :class="{ 'navbar-pill-expand': informationDropdownVisible }"
                    @click="toggleInformationMenu($event)">
                    <p class="disable-close" :class="{ 'navbar-pill-text-expand': informationDropdownVisible }">
                        Information</p>
                    <i class="fa-regular fa-circle-info disable-close"></i>
                    <menu
                        :class="{ 'dropdown-expand': informationDropdownVisible, 'information-dropdown-expand': informationDropdownVisible }"
                        class="dropdown-menu dropdown-menu-right information-dropdown-menu flex-col disable-close">
                        <div class="menu-item flex">
                            <label class="light-text">Name</label>
                            <label>{{ fileData.name }}</label>
                        </div>
                        <div class="menu-item flex">
                            <label class="light-text">Size</label>
                            <label>{{ Math.round(fileData.size / 1024) }} kB</label>
                        </div>
                        <div class="menu-item flex">
                            <label class="light-text">Last Read</label>
                            <label>{{ fileData.access_time }}</label>
                        </div>
                        <div class="menu-item flex">
                            <label class="light-text">Last Modification</label>
                            <label>{{ fileData.modification_time }}</label>
                        </div>
                        <div class="menu-item flex">
                            <label class="light-text">Created On</label>
                            <label>{{ fileData.creation_time }}</label>
                        </div>
                    </menu>
                </button>
            </section>
        </nav>
        <div class="flex-col documentation-content-parent">
            <div class="flex-col documentation-content">
                <div class="breadcrumbs-container flex">
                    <RouterLink :to="`/documentation${type === 'Doc' ? '#Documentation' : '#Guides'}`"
                        class="breadcrumb-item breadcrumb-link">
                        {{ type === 'Doc' ? 'Documentation' : 'Guides' }}
                    </RouterLink>
                    <p class="breadcrumb-item">/</p>
                    <RouterLink :to="`/documentation/read/${type}/${category}`" class="breadcrumb-item breadcrumb-link">
                        {{ category.replace(/_/g, " ") }}
                    </RouterLink>
                    <p v-if="page" class="breadcrumb-item">/</p>
                </div>
                <section class="flex documentation-content-container">
                    <div class="documentation-content-child" v-if="typeof fileData === 'object'"
                        v-html="fileData.fileContents">
                    </div>
                    <div class="documentation-content-child"
                        v-else-if="typeof fileData === 'boolean' && fileData === true">
                        <p>Looks like this page is not available in this language and/or version. Please change them
                            to their defaults and try again.
                        </p>
                    </div>
                    <div class="documentation-content-child" v-else>
                        <p>Something went wrong while retrieving this page. Please try again later.</p>
                    </div>
                    <aside class="flex-col"
                        v-if="typeof fileData === 'object' && (chapterData.length || fileData.products.length)">
                        <div class="flex-col" v-if="chapterData.length">
                            <strong>On This Page</strong>
                            <a :href="`#${chapter.title}`" v-for="(chapter, index) of chapterData"
                                :id="`${chapter.title}_aside`"
                                :class="{ 'active-chapter': chapterData[index].active, 'anchored-chapter': $route.hash === '#' + chapter.title }">
                                {{ chapter.title.replace(/_/g, " ") }}
                            </a>
                        </div>
                        <div class="flex-col" v-if="fileData.products.length">
                            <div class="flex featured-product-title-container">
                                <strong>Featured Products</strong>
                                <i class="fa-regular fa-circle-info"></i>
                                <span>Products that have been used in this {{ type }}.</span>
                            </div>
                            <RouterLink class="flex featured-product-item" v-for="product of fileData.products"
                                :to="product.url">
                                <img :src="`https://files.stefankruik.com/Products/${product.name}.png`" alt="Prod Img">
                                <p>{{ product.name }}</p>
                            </RouterLink>
                        </div>
                    </aside>
                </section>
            </div>
            <section class="flex-col recommended-container">
                <div class="flex-col">
                    <h3>Also Read</h3>
                    <p class="light-text">Other popular and related pages that you might find useful as well.</p>
                </div>
                <DocumentationRecommendedItem v-for="item of relatedItems" :key="item.id" :data="item">
                </DocumentationRecommendedItem>
            </section>
            <section class="flex-col footer-container">
                <div class="flex-col">
                    <h3>More</h3>
                    <p class="light-text">Leave feedback if you'd like and find links to further assistence.</p>
                </div>
                <DocumentationFooter></DocumentationFooter>
            </section>
        </div>
    </div>
</template>

<style scoped>
.navigation-overlay {
    position: fixed;
    top: 0;
    height: 100vh;
    width: 100vw;
    z-index: 4;
}

.content-wrapper {
    align-items: flex-start;
    gap: 0;
}

/* Nav - Left */
nav {
    top: 56px;
    height: calc(100vh - 56px);
    align-items: flex-start;
    position: sticky;
    z-index: 2;
}

.navigation-button {
    display: none;
}

.navigation {
    height: 100%;
    width: 300px;
    border-right: 1px solid var(--border);
    box-sizing: border-box;
    padding: 20px;
    gap: 20px;
}

.category-title {
    gap: 10px;
}

.category-title:first-child {
    font-weight: bold;
}

.category-title:last-child {
    font-size: x-large;
    font-weight: bold;
}

.navigation-link {
    color: var(--font-light);
}

.active-navigation-link {
    color: var(--font);
}

.active-navigation-link::before {
    content: "•";
    margin-right: 10px;
}

.controls {
    width: 120px;
    margin-top: 5px;
}

.information-dropdown-menu {
    width: 0;
    transition: height 0.4s, opacity 0.3s, width 0.8s;
}

.information-dropdown-expand {
    height: 130px;
    width: 320px;
}

.menu-item {
    width: 100%;
    justify-content: space-between;
    height: 20px;
    text-wrap: nowrap;
}

.responsive-nav {
    display: none;
}

/* Content - Right */
.documentation-content-parent {
    width: 100%;
    align-items: center;
}

.documentation-content-parent > div,
.documentation-content-parent > section {
    width: 100%;
    max-width: 1050px;
    align-items: flex-start;
}

.documentation-content {
    align-items: center;
    padding-top: 40px;
}

.breadcrumbs-container {
    width: 100%;
    gap: 10px;
}

.breadcrumb-item {
    color: var(--font-light);
}

.documentation-content-container {
    align-items: flex-start;
    justify-content: center;
    height: 100%;
    gap: 100px;
}

.documentation-content-child {
    width: 700px;
}

aside {
    position: sticky;
    top: 120px;
    width: 250px;
    min-height: 400px;
    gap: 50px;
    border-left: 1px solid var(--border);
    box-sizing: border-box;
    padding-left: 20px;
}

aside a {
    margin-top: 10px;
}

.active-chapter {
    color: var(--font);
}

.active-chapter::before {
    content: "•";
    margin-right: 10px;
}

aside a,
.featured-product-item p {
    color: var(--font-light);
}

.featured-product-title-container {
    position: relative;
    z-index: 1;
    gap: 10px;
}

.featured-product-title-container i {
    color: var(--font-light);
    cursor: pointer;
}

.featured-product-title-container span {
    position: absolute;
    bottom: 25px;
    border: 1px solid var(--border);
    box-sizing: border-box;
    padding: 10px;
    width: max-content;
    background-color: var(--fill);
    opacity: 0;
    transition: opacity 0.3s;
}

.featured-product-title-container span::before {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    border: solid transparent;
    border-top-color: var(--border);
    border-width: 5px;
    margin-left: -5px;
}

.featured-product-title-container i:hover + span {
    opacity: 1;
    border-radius: var(--border-radius-low);
}

.featured-product-item {
    gap: 10px;
}

.featured-product-item:hover p {
    color: var(--font);
}

.featured-product-item img {
    border-radius: 50%;
    height: 30px;
    aspect-ratio: 1 / 1;
}

.recommended-container,
.footer-container {
    padding-top: 60px;
    gap: 40px;
    margin-top: 60px;
    box-sizing: border-box;
    border-top: 1px solid var(--border);
    max-width: 1200px;
}

.recommended-container {
    height: 200px;
}

footer {
    display: flex;
    justify-content: space-between;
}

.responsive-nav,
.responsive-nav-item {
    width: 100%;
    gap: 40px;
}

.navigation > a:last-of-type {
    margin-bottom: 20px;
}

.responsive-nav-item {
    gap: 10px;
}

.responsive-nav-splitter {
    display: none;
}

@media (width <=1650px) {
    .featured-product-title-container span {
        width: 230px;
    }
}

@media (width <=1500px) {
    aside {
        display: none;
    }

    .responsive-nav {
        display: flex;
    }

    .featured-product-item p {
        color: var(--font);
    }

    .documentation-content-parent > div,
    .documentation-content-parent > section {
        width: 100%;
        max-width: 700px;
    }

    .documentation-content-child {
        width: 100%;
    }

    footer {
        flex-direction: row;
        align-items: center;
        justify-content: center;
        row-gap: 60px;
    }

    .documentation-footer-item {
        gap: 20px;
        width: 300px;
        align-items: center;
    }

    .documentation-footer-item-description {
        max-width: 280px;
        text-align: center;
    }
}

@media (width <=1180px) {
    .documentation-content-parent {
        flex: 1;
    }

    .documentation-content {
        padding-top: 20px;
    }

    nav {
        flex-direction: column;
        border-right: 1px solid var(--border);
        box-sizing: border-box;
        padding: 20px;
        width: 250px;
        gap: 40px;
    }

    .navigation {
        width: 100%;
        height: max-content;
        border: unset;
        box-sizing: unset;
        padding: unset;
    }

    .controls {
        flex-direction: row;
    }

    .responsive-nav-splitter {
        display: block;
    }
}

@media (width <=990px) {
    .navigation-button {
        display: block;
        position: fixed;
        top: 61px;
        left: 5px;
        height: 30px;
        width: 30px;
        z-index: 3;
    }

    .navigation-button i {
        margin-right: unset;
    }

    nav {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        background-color: var(--fill);
        display: none;
        width: 0;
        z-index: 5;
    }

    .navigation-expand {
        display: flex;
        width: 300px;
    }
}

@media (width <=800px) {
    .documentation-content {
        padding-top: 40px;
    }

    .navigation-button {
        top: 101px;
    }

    .documentation-content-child {
        width: 95%;
    }
}
</style>
