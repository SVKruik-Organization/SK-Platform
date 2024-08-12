<script lang="ts">
import { DropdownStates, type DocumentationFile, type DocumentationTypes } from '@/assets/customTypes';
import { useDocumentationStore } from '@/stores/DocumentationStore';
import { fetchDocumentationDefault, fetchDocumentationPage } from '@/utils/fetch';
import { defineComponent, type PropType } from 'vue';
import DocumentationFooter from '@/components/DocumentationFooter.vue';

export default defineComponent({
    name: "ReadPage",
    components: {
        DocumentationFooter
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
            "fileData": true as DocumentationFile | boolean
        }
    },
    props: {
        "type": { type: String as PropType<DocumentationTypes>, required: true },
        "category": { type: String, required: true },
        "page": { type: String, required: false },
        "informationDropdownVisible": { type: Boolean, required: false },
    },
    watch: {
        async $route() {
            if (!this.page) {
                this.fileData = await fetchDocumentationDefault(this.category, this.documentationStore.version, this.documentationStore.language, this.type);
            } else this.fileData = await fetchDocumentationPage(this.category, this.page, this.documentationStore.version, this.documentationStore.language, this.type);
            this.scrollAnchor();
        }
    },
    async mounted() {
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
            if (this.$route.hash) setTimeout(() => {
                this.scrollAnchor();
            }, 100);
        }
    },
    methods: {
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
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                    document.querySelector(".anchored-chapter")?.classList.remove("anchored-chapter");
                    element.classList.add("anchored-chapter");
                }
            }
        }
    }
});
</script>

<template>
    <div class="content-wrapper flex">
        <nav class="flex">
            <section class="navigation flex-col">
                <p style="margin-bottom: 20px;">Other pages in {{ category }}</p>
                <RouterLink :to="`/documentation/read/${type}/${category}/${link}`"
                    v-for="link in documentationStore.getCategoryList(type, category)">
                    {{ link.replace(/_/g, " ") }}
                </RouterLink>
            </section>
            <section class="controls flex-col">
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
                            <label>{{ fileData.size }} bytes</label>
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
        <div style="flex: 1">
            <div class="flex-col documentation-content-wrapper">
                <section class="flex-col documentation-content-parent">
                    <div class="breadcrumbs-container flex">
                        <RouterLink :to="`/documentation${type === 'Doc' ? '#Documentation' : '#Guides'}`"
                            class="breadcrumb-item breadcrumb-link">
                            {{ type === 'Doc' ? 'Documentation' : 'Guides' }}
                        </RouterLink>
                        <p class="breadcrumb-item">/</p>
                        <RouterLink :to="`/documentation/read/${type}/${category}`"
                            class="breadcrumb-item breadcrumb-link">
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
                        <aside class="flex-col" v-if="typeof fileData === 'object'">
                            <div class="flex-col aside-item">
                                <strong>On This Page</strong>
                                <a :href="chapter" v-for="chapter of fileData.chapters">
                                    {{ chapter.slice(1).replace(/_/g, " ") }}
                                </a>
                            </div>
                            <div class="flex-col aside-item">
                                <strong>Featured Products</strong>
                                <a class="flex featured-product-item">
                                    <img src="/Apricaria.png" alt="Apricaria">
                                    <p>Apricaria</p>
                                </a>
                                <a class="flex featured-product-item">
                                    <img>
                                    <p>Uplink</p>
                                </a>
                            </div>
                        </aside>
                    </section>
                </section>
            </div>
            <DocumentationFooter></DocumentationFooter>
        </div>
    </div>
</template>

<style scoped>
.content-wrapper {
    align-items: flex-start;
    gap: 0;
}

nav {
    height: calc(100vh - 56px);
    align-items: flex-start;
}

.navigation {
    height: 100%;
    width: 300px;
    border-right: 1px solid var(--border);
}

.controls {
    width: 120px;
    margin-top: 5px;
}

.information-dropdown-menu {
    width: 0;
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

.documentation-content-wrapper {
    align-items: center;
    max-width: 1400px;
    width: 100%;
}

.documentation-content-parent {
    flex: 1;
    align-items: center;
    justify-content: center;
    height: 100%;
    box-sizing: border-box;
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
    width: 180px;
    min-height: 400px;
    gap: 50px;
    border-left: 1px solid var(--border);
    box-sizing: border-box;
    padding-left: 20px;
}

aside a {
    margin-top: 10px;
}

aside a,
.featured-product-item p {
    color: var(--font-light);
}

.featured-product-item {
    gap: 10px;
}

.featured-product-item img {
    border-radius: 50%;
    height: 30px;
    aspect-ratio: 1 / 1;
}

footer {
    display: flex;
    justify-content: space-between;
    padding: 80px 40px 0 0;
    box-sizing: border-box;
    margin-top: 80px;
    border-top: 1px solid var(--border);
}

@media (width <=1480px) {
    footer {
        flex-direction: column;
        align-items: center;
        row-gap: 60px;
    }

    .documentation-footer-item {
        width: 100%;
    }
}
</style>
