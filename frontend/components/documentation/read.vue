<script setup lang="ts">
import { DropdownStates, type DocChapterItem, type DocumentationTypes, type DocumentationFile, type DocumentationIndexItem, type HeadLink } from '@/assets/customTypes';
import { useDocumentationStore } from '@/stores/DocumentationStore';
import { type PropType } from 'vue';

// Setup
const documentationStore = useDocumentationStore();
const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const handleFallbackImage: Function = inject("handleFallbackImage") as Function;

// Props
const props = defineProps({
    "type": { type: String as PropType<DocumentationTypes>, required: true },
    "category": { type: String, required: true },
    "page": { type: String, required: false },
    "informationDropdownVisible": { type: Boolean, required: false },
    "productDropdownVisible": { type: Boolean, required: false },
    "navigationDropdownVisible": { type: Boolean, required: false },
    "commentOverlayVisible": { type: Boolean, required: true },
});

// Reactive Data
const page = ref<string | undefined>(props.page);
const chapterData: Ref<Array<DocChapterItem>> = ref([]);
const hasPreviousPage: Ref<boolean> = ref(false);
const hasNextPage: Ref<boolean> = ref(false);
const categoryList: Ref<Array<string>> = ref([]);
const seoCategory: Ref<DocumentationIndexItem | undefined> = ref(undefined);
let fileData: Ref<DocumentationFile | null> = ref(null);

// Prevent Default Page
if (page.value === "Default") {
    useRouter().push(`/documentation/read/${props.type}/${props.category}`);
}

// Load Reactive Data
const { data: rawFileData } = await useAsyncData<DocumentationFile>("fileData",
    () => $fetch(`${runtimeConfig.public.docsApiBase}/getFile/${documentationStore.version}/${documentationStore.language}/${props.type}`, {
        params: {
            "folder": props.category,
            "name": props.page || "Default",
        },
        onRequestError() {
            useRouter().push("/documentation/error");
        },
        onResponseError(error) {
            if (error.response.status === 404) {
                useRouter().push(`/documentation/notfound?type=${props.type}&category=${props.category}&page=${page.value}`);
            } else useRouter().push("/documentation/error");
        }
    }), {
    watch: [page]
});
if (rawFileData.value === null) useRouter().push(`/documentation/notfound?type=${props.type}&category=${props.category}&page=${page.value}`);
fileData.value = await parseDocumentationFile(rawFileData.value) as DocumentationFile;

onBeforeMount(async () => {
    hasPreviousPage.value = await documentationStore.hasPreviousPage(props.type, props.category, props.page);
    hasNextPage.value = await documentationStore.hasNextPage(props.type, props.category, props.page);
    categoryList.value = await documentationStore.getCategoryList(props.type, props.category);
    seoCategory.value = await documentationStore.getCategory(props.type, props.category);
});

// HTML Elements
const shareButtonContents: Ref<HTMLParagraphElement | null> = ref(null);

// Lifecycle
onMounted(() => {
    if (fileData.value && fileData.value.chapters.length) {
        window.addEventListener('scroll', setActiveChapter);
        for (const chapter of fileData.value.chapters) {
            const element: HTMLAnchorElement | null = document.getElementById(chapter.slice(1)) as HTMLAnchorElement | null;
            if (!element) continue;
            chapterData.value.push({ "title": element.id, "height": element.getBoundingClientRect().top, "active": false });
        }

        window.scrollBy(0, 0);
        setActiveChapter();
        scrollAnchor(null);
    }
});
onUnmounted(() => {
    window.removeEventListener('scroll', setActiveChapter);
});

// Computed
const isAnchored = (title: string) => {
    return computed<boolean>(() => route.hash === '#' + title).value;
};

// Watchers
watch(() => route.fullPath, () => {
    scrollAnchor(0);
    setActiveChapter();
});

// Methods

/**
 * Handles any click event on the document content.
 * Will be switched to the right method based on the target.
 * @param event The click event.
 */
function handleDocumentContentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target) return;
    switch (target.getAttribute("click-action")) {
        case "tableSort":
            tableSort(target.closest("table") as HTMLTableElement, parseInt(target.getAttribute("table-sort-number") as string) - 1);
            break;
    }
}

/**
 * Sort a table based on the clicked header.
 * @param table The table to sort.
 * @param headerNumber The header number that was clicked, corresponding to the column number to sort.
 */
function tableSort(table: HTMLTableElement, headerNumber: number): void {
    if (table.getAttribute("table-sortable") === "false") return;

    // Setup & Dynamic Sorting
    const rows: Array<HTMLTableRowElement> = Array.from(table.rows).slice(1);
    const sortType: string = table.getAttribute("table-sort-type") || "string";
    const sortDirection: string = table.getAttribute("table-sort-direction") || "asc";
    const sortFunction: Function = sortType === "number"
        ? (a: string, b: string) => parseInt(a) - parseInt(b)
        : (a: string, b: string) => a.localeCompare(b);
    rows.sort((a: HTMLTableRowElement, b: HTMLTableRowElement) => {
        const aValue: string = a.cells[headerNumber].innerText;
        const bValue: string = b.cells[headerNumber].innerText;
        return sortDirection === "asc" ? sortFunction(aValue, bValue) : sortFunction(bValue, aValue);
    });

    // Reorder
    rows.forEach((row: HTMLTableRowElement) => table.appendChild(row));
    table.setAttribute("table-sort-direction", sortDirection === "asc" ? "desc" : "asc");
}

/**
 * Toggle the information dropdown menu.
 * @param event The click event.
 */
function toggleInformationMenu(event: Event): void {
    const target: HTMLElement = event.target as HTMLElement;
    if (target.tagName === "MENU") return;
    emit("dropdownState", DropdownStates.information, !props.informationDropdownVisible);
}

/**
 * Toggle the information dropdown menu.
 * @param event The click event.
 */
function toggleNavigationBar(event: Event): void {
    const target: HTMLElement = event.target as HTMLElement;
    if (target.tagName === "NAV") return;
    emit("dropdownState", DropdownStates.navigation, !props.navigationDropdownVisible);
}

/**
 * Copy the URL to the client clipboard.
 * @param event The click event.
 */
function share(): void {
    const targetButton: HTMLParagraphElement = shareButtonContents.value as HTMLParagraphElement;
    if (!targetButton) return;
    targetButton.innerHTML = "Copied!";
    setTimeout(() => targetButton.innerHTML = "Share", 1000);
    navigator.clipboard.writeText(window.location.href);
}

/**
 * Scroll the URL anchor into view.
 * @param timeout The timeout before scrolling.
 */
function scrollAnchor(timeout: number | null): void {
    setTimeout(() => {
        if (typeof fileData.value === "object") {
            const chapters: Array<string> = (fileData.value as DocumentationFile).chapters;
            if (!chapters.includes(route.hash)) return;
            const element: HTMLAnchorElement | null = document.getElementById(route.hash.slice(1)) as HTMLAnchorElement | null;
            const chapterMarker: HTMLAnchorElement | null = document.getElementById(`${route.hash.slice(1)}_aside`) as HTMLAnchorElement | null;
            if (element && chapterMarker) {
                window.scrollBy(0, element.getBoundingClientRect().top - 100);
                document.querySelectorAll(".anchored-chapter").forEach((element) => element.classList.remove("anchored-chapter"));
                element.classList.add("anchored-chapter");
                chapterMarker.classList.add("anchored-chapter");
            }
        }
    }, timeout || 100);
}

/**
 * Set the active chapter based on the scroll position.
 */
function setActiveChapter(): void {
    if (!chapterData.value.length) return;
    let activeChapterFound = false;
    const offset: number = 130;

    // First Chapter
    if (window.scrollY < chapterData.value[0].height - offset) {
        chapterData.value[0].active = true;
        activeChapterFound = true;
        return;
    }

    // Other Chapters
    for (let i = 0; i < chapterData.value.length; i++) {
        // Setup
        const chapter: DocChapterItem = chapterData.value[i];
        chapter.active = false;

        // Not yet found and within bounds.
        if (!activeChapterFound && chapter.height < window.scrollY + offset && (chapterData.value[i + 1]?.height || Infinity) > window.scrollY + offset) {
            chapter.active = true;
            activeChapterFound = true;
        }
    }
}

/**
 * Go to the previous page in the category.
 */
async function previousPage(): Promise<void> {
    const currentCategory: DocumentationIndexItem | undefined = await documentationStore.getCategory(props.type, props.category);
    if (!currentCategory || !currentCategory.children.length) return;
    const router = useRouter();
    if (props.page) {
        const previousPageName = currentCategory.children[currentCategory.children.indexOf(props.page) - 1];
        if (!previousPageName) {
            router.push(`/documentation/read/${props.type}/${props.category}`);
        } else router.push(`/documentation/read/${props.type}/${props.category}/${previousPageName}`);
    }
}

/**
 * Go to the next page in the category.
 */
async function nextPage(): Promise<void> {
    const currentCategory: DocumentationIndexItem | undefined = await documentationStore.getCategory(props.type, props.category);
    if (!currentCategory || !currentCategory.children.length) return;
    const router = useRouter();
    if (props.page) {
        const nextPageName = currentCategory.children[currentCategory.children.indexOf(props.page) + 1];
        if (!nextPageName) return;
        router.push(`/documentation/read/${props.type}/${props.category}/${nextPageName}`);

        // Default page
    } else {
        const nextPageName = currentCategory.children[0];
        if (!nextPageName) return;
        router.push(`/documentation/read/${props.type}/${props.category}/${nextPageName}`);
    }
}

/**
 * Convert DDMMYYYY to YYYYMMDD for Open Graph article dates.
 * @param input The date string to convert.
 */
function seoDateConverter(input: string): string | null {
    if (!input.length) return null;
    const split: Array<string> = input.slice(6).split("-");
    const day: string = split[0];
    const month: string = split[1];
    const year: string = split[2];
    return `${year}-${month}-${day}`;
}

// Emitters
const emit = defineEmits(["dropdownState"]);
function handleDropdownState(name: DropdownStates, newValue: boolean): void {
    emit("dropdownState", name, newValue);
};

// SEO
const links: Array<HeadLink> = [
    { rel: "index", href: "https://platform.stefankruik.com/documentation" },
    { rel: "self", href: `https://platform.stefankruik.com/documentation/read/${props.type}/${props.category}${props.page ? `/${props.page}` : ""}` }
];
const metaItems = [
    { property: "article:section", content: props.type === "Doc" ? "Documentation" : "Guide" },
    { property: "article:published_time", content: seoDateConverter(fileData.value ? fileData.value.creationTime : "") },
    { property: "article:modified_time", content: seoDateConverter(fileData.value ? fileData.value.modificationTime : "") },
    { property: "article:tag", content: props.category.replace(/_/g, " ") },
];
if (props.page) {
    metaItems.push({ property: "article:tag", content: props.page.replace(/_/g, " ") });
    const currentCategory: DocumentationIndexItem | undefined = seoCategory.value;
    if (currentCategory) {
        const nextPageName = currentCategory.children[currentCategory.children.indexOf(props.page) + 1];
        if (nextPageName) links.push({
            rel: "next",
            href: `https://platform.stefankruik.com/documentation/read/${props.type}/${props.category}/${nextPageName}`
        });
        const previousPageName = currentCategory.children[currentCategory.children.indexOf(props.page) - 1];
        if (previousPageName) links.push({
            rel: "prev",
            href: `https://platform.stefankruik.com/documentation/read/${props.type}/${props.category}/${previousPageName}`
        });
    }
}

const jsonld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "name": "SK Platform | Documentation",
    "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "Documentation",
        "item": "https://platform.stefankruik.com/documentation"
    }, {
        "@type": "ListItem",
        "position": 2,
        "name": props.category.replace(/_/g, " "),
        "item": `https://platform.stefankruik.com/documentation/read/${props.type}/${props.category}`
    }]
}
if (props.page) {
    jsonld.itemListElement.push({
        "@type": "ListItem",
        "position": 3,
        "name": props.page.replace(/_/g, " "),
        "item": `https://platform.stefankruik.com/documentation/read/${props.type}/${props.category}/${props.page}`
    });
}
useHead({
    link: links,
    meta: metaItems,
    script: [{
        hid: "breadcrumbs-json-ld",
        type: "application/ld+json",
        textContent: JSON.stringify(jsonld)
    }]
});
</script>

<template>
    <div class="content-wrapper flex" v-if="fileData != null">
        <nav class="flex scrollbar" :class="{ 'navigation-expand': navigationDropdownVisible }">
            <section class="navigation scrollbar flex-col" :class="{ 'disable-close': navigationDropdownVisible }">
                <div class="flex category-title" :class="{ 'disable-close': navigationDropdownVisible }">
                    <div class="flex">
                        <NuxtLink to="/documentation" title="Go back to the documentation home page.">
                            <NuxtImg class="icon" width="20" height="20" src="/svg/arrow-left-regular.svg"
                                loading="lazy" alt="Icon" />
                        </NuxtLink>
                        <ClientOnly>
                            <NuxtLink :to="`/documentation/Read/${type}/${category}`"
                                title="Go to the category home page.">
                                {{ category.replace(/_/g, " ") }}
                            </NuxtLink>
                        </ClientOnly>
                    </div>
                    <button type="button" class="navigation-button navigation-close navbar-pill"
                        title="Close the navigation bar.">
                        <NuxtImg class="icon" width="20" height="20" src="/svg/xmark-regular.svg" loading="lazy"
                            alt="Icon" />
                    </button>
                </div>
                <ClientOnly>
                    <NuxtLink :to="`/documentation/read/${type}/${category}/${link}`" class="navigation-link"
                        :class="{ 'active-navigation-link': link === page }" v-for="link in categoryList" :key="link">
                        {{ link.replace(/_/g, " ") }}
                    </NuxtLink>
                </ClientOnly>
                <section class="flex-col responsive-nav" :class="{ 'disable-close': navigationDropdownVisible }"
                    v-if="typeof fileData === 'object' && (chapterData.length || fileData.products.length)">
                    <span class="splitter"></span>
                    <div v-if="chapterData.length" class="flex-col responsive-nav-item"
                        :class="{ 'disable-close': navigationDropdownVisible }">
                        <strong :class="{ 'disable-close': navigationDropdownVisible }">On This Page</strong>
                        <ClientOnly>
                            <a :href="`#${chapter.title}`" v-for="(chapter, index) of chapterData"
                                :id="`${chapter.title}_aside`" class="responsive-nav-item-link"
                                :class="{ 'active-chapter': chapterData[index].active, 'anchored-chapter': isAnchored(chapter.title) }">
                                {{ chapter.title.replace(/_/g, " ") }}
                            </a>
                        </ClientOnly>
                    </div>
                    <span v-if="chapterData.length" class="splitter"></span>
                    <div class="flex-col responsive-nav-item" v-if="fileData.products.length"
                        :class="{ 'disable-close': navigationDropdownVisible }">
                        <div class="flex featured-product-title-container"
                            :class="{ 'disable-close': navigationDropdownVisible }">
                            <strong :class="{ 'disable-close': navigationDropdownVisible }">Featured Products</strong>
                            <NuxtImg class="icon" width="15" height="15" src="/svg/circle-info-regular.svg"
                                :class="{ 'disable-close': navigationDropdownVisible }" loading="lazy" alt="Icon" />
                            <span :class="{ 'disable-close': navigationDropdownVisible }">Products that have been used
                                in this {{ type }}.</span>
                        </div>
                        <ClientOnly>
                            <NuxtLink class="flex featured-product-item" v-for="product of fileData.products"
                                :to="product.url">
                                <NuxtImg height="30" width="30" loading="lazy"
                                    :src="`https://files.stefankruik.com/Products/100/${product.name}.png`"
                                    @error="handleFallbackImage($event, 'icon')" alt="Product Icon" />
                                <p>{{ product.name.replace(/_/g, " ") }}</p>
                            </NuxtLink>
                        </ClientOnly>
                    </div>
                </section>
            </section>
            <div class="splitter-container">
                <span class="splitter responsive-nav-splitter"></span>
            </div>
            <section class="controls flex" :class="{ 'disable-close': navigationDropdownVisible }">
                <strong class="responsive-nav-title"
                    :class="{ 'disable-close': navigationDropdownVisible }">Options</strong>
                <div class="flex-col">
                    <ClientOnly>
                        <button title="Go to the previous page." class="flex navbar-pill control-pill" type="button"
                            :class="{ 'disabled-button': !hasPreviousPage }" @click="previousPage()">
                            <p>Previous</p>
                            <NuxtImg class="icon icon-light" width="15" height="15"
                                src="/svg/diagram-previous-regular.svg" loading="lazy" alt="Icon" />
                        </button>
                    </ClientOnly>
                    <button title="Share this article." class="flex navbar-pill control-pill" type="button"
                        :class="{ 'disable-close': navigationDropdownVisible }" @click="share()">
                        <p :class="{ 'disable-close': navigationDropdownVisible }" ref="shareButtonContents">Share</p>
                        <NuxtImg class="icon icon-light" width="15" height="15" src="/svg/share-regular.svg"
                            :class="{ 'disable-close': navigationDropdownVisible }" loading="lazy" alt="Icon" />
                    </button>
                    <button hide title="View page information." type="button" v-if="typeof fileData === 'object'"
                        class="flex dropdown-container justify-center navbar-pill disable-close"
                        @click="toggleInformationMenu($event)"
                        :class="{ 'navbar-pill-expand': informationDropdownVisible, 'disable-close': navigationDropdownVisible }">
                        <p class="disable-close" :class="{ 'navbar-pill-text-expand': informationDropdownVisible }">
                            Information</p>
                        <NuxtImg class="icon icon-light disable-close" width="15" height="15"
                            src="/svg/circle-info-regular.svg" loading="lazy" alt="Icon" />
                        <menu
                            :class="{ 'dropdown-expand': informationDropdownVisible, 'information-dropdown-expand': informationDropdownVisible }"
                            class="dropdown-menu dropdown-menu-right information-dropdown-menu flex-col disable-close">
                            <div class="menu-item flex disable-close">
                                <label class=" light-text disable-close">Name</label>
                                <label>{{ fileData.name }}</label>
                            </div>
                            <div class="menu-item flex disable-close">
                                <label class="light-text disable-close">Size</label>
                                <label>{{ fileData.size < 1024 ? `${fileData.size} bytes` : `${Math.round(fileData.size
                                    / 1024)} kB` }}</label>
                            </div>
                            <div class="menu-item flex disable-close">
                                <label class="light-text disable-close">Last Read</label>
                                <label>{{ fileData.accessTime }}</label>
                            </div>
                            <div class="menu-item flex disable-close">
                                <label class="light-text disable-close">Last Modification</label>
                                <label>{{ fileData.modificationTime }}</label>
                            </div>
                            <div class="menu-item flex disable-close">
                                <label class="light-text disable-close">Created On</label>
                                <label>{{ fileData.creationTime }}</label>
                            </div>
                            <div class="menu-item flex disable-close">
                                <label class="light-text disable-close">View Count</label>
                                <label>{{ fileData.viewCount }}</label>
                            </div>
                        </menu>
                    </button>
                    <ClientOnly>
                        <button title="Go to the next page." class="flex navbar-pill control-pill" type="button"
                            :class="{ 'disabled-button': !hasNextPage }" @click="nextPage()">
                            <p>Next</p>
                            <NuxtImg class="icon icon-light" width="15" height="15" src="/svg/diagram-next-regular.svg"
                                loading="lazy" alt="Icon" />
                        </button>
                    </ClientOnly>
                </div>
            </section>
        </nav>
        <div class="flex-col documentation-content-parent">
            <div class="flex-col documentation-content">
                <div class="breadcrumbs-container flex">
                    <button type="button" class="navigation-button navbar-pill disable-close"
                        @click="toggleNavigationBar($event)" title="Open the navigation bar.">
                        <NuxtImg class="icon icon-light disable-close" width="15" height="15"
                            src="/svg/arrow-right-from-line-regular.svg" loading="lazy" alt="Icon" />
                    </button>
                    <ClientOnly>
                        <NuxtLink :to="`/documentation${type === 'Doc' ? '#Information' : '/#Guides'}`"
                            class="breadcrumb-item breadcrumb-link">
                            {{ type === 'Doc' ? 'Documentation' : 'Guides' }}
                        </NuxtLink>
                        <p class="breadcrumb-item">/</p>
                        <NuxtLink :to="`/documentation/read/${type}/${category}`"
                            class="breadcrumb-item breadcrumb-link">
                            {{ category.replace(/_/g, " ") }}
                        </NuxtLink>
                    </ClientOnly>
                    <p v-if="page" class="breadcrumb-item">/</p>
                </div>
                <section class="flex documentation-content-container">
                    <div class="documentation-content-child" v-if="typeof fileData === 'object'"
                        v-html="fileData.fileContents" @click="handleDocumentContentClick">
                    </div>
                    <div class="documentation-content-child"
                        v-else-if="typeof fileData === 'boolean' && fileData === true">
                        <p class="error-message">Looks like this page is not available in this language and/or version.
                            Please change them to their defaults and try again.
                        </p>
                    </div>
                    <div class="documentation-content-child" v-else>
                        <p class="error-message">Something went wrong while retrieving this page. Please try again
                            later.</p>
                    </div>
                    <aside class="flex-col"
                        v-if="typeof fileData === 'object' && (chapterData.length || fileData.products.length)">
                        <div class="flex-col" v-if="chapterData.length">
                            <strong>On This Page</strong>
                            <a :href="`#${chapter.title}`" v-for="(chapter, index) of chapterData"
                                :id="`${chapter.title}_aside`"
                                :class="{ 'active-chapter': chapterData[index].active, 'anchored-chapter': isAnchored(chapter.title) }">
                                {{ chapter.title.replace(/_/g, " ") }}
                            </a>
                        </div>
                        <div class="flex-col" v-if="fileData.products.length">
                            <div class="flex featured-product-title-container">
                                <strong>Featured Products</strong>
                                <NuxtImg class="icon" width="15" height="15" src="/svg/circle-info-regular.svg"
                                    loading="lazy" alt="Icon" />
                                <span>
                                    <p>Products that have been used</p>
                                    <p>and/or mentioned in this {{ type }}.</p>
                                </span>
                            </div>
                            <ClientOnly>
                                <NuxtLink class="flex featured-product-item" v-for="product of fileData.products"
                                    :to="product.url">
                                    <NuxtImg height="30" width="30" loading="lazy"
                                        :src="`https://files.stefankruik.com/Products/100/${product.name}.png`"
                                        @error="handleFallbackImage($event, 'icon')" alt="Product Icon" />
                                    <p>{{ product.name.replace(/_/g, " ") }}</p>
                                </NuxtLink>
                            </ClientOnly>
                        </div>
                    </aside>
                </section>
            </div>
            <section v-if="fileData.related.length" class="flex-col related-container">
                <div class="flex-col section-title-container">
                    <h3>Also Read</h3>
                    <p class="light-text">Other popular and related pages that you might find useful as well.</p>
                </div>
                <div class="flex related-item-container">
                    <ClientOnly>
                        <DocumentationRelatedItem v-for="item of fileData.related" :key="item.id" :data="item">
                        </DocumentationRelatedItem>
                    </ClientOnly>
                </div>
            </section>
            <section class="flex-col footer-container">
                <div class="flex-col section-title-container">
                    <h3>More</h3>
                    <p class="light-text">Leave feedback if you'd like and find links to further assistence.</p>
                </div>
                <DocumentationFooter @dropdownState="handleDropdownState"
                    :comment-overlay-visible="commentOverlayVisible" :type="props.type" :category="props.category"
                    :page="props.page" styles="read-footer">
                </DocumentationFooter>
            </section>
        </div>
    </div>
</template>

<style scoped>
.error-message {
    width: 95%;
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
    z-index: 1;
}

.splitter-container {
    display: none;
    width: 100%;
}

.responsive-nav-title {
    display: none;
}

.navigation-button {
    display: none;
    align-items: center;
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
    justify-content: space-between;
    gap: 0;
    width: 100%;
}

.category-title > div {
    gap: 10px;
}

.category-title > div a:first-of-type {
    font-weight: bold;
}

.category-title > div a:last-of-type {
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
    top: 39px;
}

.information-dropdown-expand {
    height: 160px;
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
    margin-left: -250px;
}

.documentation-content {
    align-items: center;
    padding-top: 40px;
    min-height: 350px;
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

.error-image {
    background-color: transparent;
    display: block;
    filter: invert(50%);
    opacity: 0.5;
}

.featured-product-title-container {
    position: relative;
    z-index: 1;
    gap: 10px;
}

.featured-product-title-container .icon {
    cursor: pointer;
}

.featured-product-title-container span {
    position: absolute;
    bottom: 25px;
    border: 1px solid var(--border);
    box-sizing: border-box;
    padding: 10px;
    background-color: var(--fill);
    opacity: 0;
    transition: opacity 0.3s, height 0.4s;
    width: 250px;
    overflow: hidden;
    height: 0;
    border-radius: var(--border-radius-low);
    margin-left: -2px;
    pointer-events: none;
}

.featured-product-title-container span p {
    text-wrap: nowrap;
}

.featured-product-title-container .icon:hover + span {
    opacity: 1;
    height: 60px;
    width: 250px;
}

.featured-product-item {
    gap: 10px;
}

.featured-product-item:hover p {
    color: var(--font);
}

.featured-product-item img {
    border-radius: 50%;
}

.related-container,
.footer-container {
    padding-top: 60px;
    gap: 40px;
    margin-top: 60px;
    box-sizing: border-box;
    border-top: 1px solid var(--border);
    max-width: 1200px;
}

.related-container {
    min-height: 200px;
}

.related-item-container {
    width: 100%;
    height: 100%;
    flex-wrap: wrap;
}

footer {
    display: flex;
    justify-content: space-between;
    margin-bottom: 70px;
}

.responsive-nav,
.responsive-nav-item {
    width: 100%;
    gap: 20px;
}

.navigation > a:last-of-type {
    margin-bottom: 20px;
}

.responsive-nav-splitter {
    display: none;
}

@media (width <=1650px) {
    .featured-product-title-container span {
        right: 180px;
        bottom: -20px;
        transition: opacity 0.3s, width 0.4s;
        width: 0;
        height: 42px;
        margin-left: unset;
    }
}

@media (width <=1600px) {

    .documentation-content-parent > div,
    .documentation-content-parent > section {
        margin-left: unset;
    }
}

@media (width <=1500px) {
    aside {
        display: none;
    }

    .featured-product-title-container span,
    .featured-product-title-container .icon {
        display: none;
    }

    .navigation {
        overflow-y: scroll;
        overflow-x: hidden;
    }

    .responsive-nav {
        display: flex;
    }

    .navigation > a:last-of-type {
        margin-bottom: 0;
    }

    .responsive-nav-item-link {
        color: var(--font-light);
    }

    .active-chapter {
        color: var(--font);
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
        gap: 10px;
        row-gap: 50px;
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

    .related-item {
        max-width: unset
    }
}

@media (width <=1180px) {
    .documentation-content-parent {
        flex: 1;
    }

    .documentation-content {
        padding-top: 20px;
    }

    .responsive-nav-title {
        display: block;
    }

    nav {
        flex-direction: column;
        border-right: 1px solid var(--border);
        box-sizing: border-box;
        padding: 20px;
        width: 250px;
        gap: 20px;
        overflow-y: auto;
        overflow-x: hidden;
        left: 0;
        bottom: 0;
    }

    .splitter-container {
        display: block;
    }

    .navigation {
        width: 100%;
        height: max-content;
        border: unset;
        box-sizing: unset;
        padding: unset;
        overflow-y: unset;
        overflow-x: unset;
    }

    .controls {
        flex-direction: column;
        align-items: flex-start;
        margin-top: unset;
        width: 100%;
        gap: 20px;
        height: 200px;
    }

    .controls div {
        flex-direction: column;
        width: 100%;
    }

    .controls div button[hide] {
        display: none;
    }

    .responsive-nav-splitter {
        display: block;
    }
}

@media (width <=990px) {
    .navigation-button {
        display: flex;
        position: fixed;
        top: 61px;
        left: 5px;
        height: 30px;
        width: 30px;
        z-index: 3;
    }

    .navigation-close {
        position: unset;
    }

    .navigation-button .icon {
        margin-right: -4px;
    }

    nav {
        position: fixed;
        top: 0;
        bottom: 0;
        height: 100vh;
        background-color: var(--fill);
        display: none;
        width: 0;
        z-index: 4;
    }

    .splitter {
        background-color: var(--border);
    }

    .navigation-expand {
        display: flex;
        width: 300px;
    }

    .section-title-container {
        width: 100%;
        align-items: center;
        text-align: center;
    }

    .related-container,
    .footer-container {
        padding-top: 30px;
    }

    .related-item-container {
        flex-direction: column;
        gap: 10px;
    }

    .information-dropdown-expand {
        top: -96px;
        left: 124px;
    }
}

@media (width <=980px) {
    .documentation-content {
        gap: 20px;
    }

    .navigation-button {
        top: 101px;
        position: unset;
        z-index: 2;
    }

    .content-wrapper {
        align-items: center;
        justify-content: center;
    }

    .documentation-content-parent {
        width: 95%;
        flex: unset;
    }
}
</style>
