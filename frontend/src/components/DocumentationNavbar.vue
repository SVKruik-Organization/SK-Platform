<script lang="ts">
import { DropdownStates, type DocumentationSearchResponse } from '@/assets/customTypes';
import { useDocumentationStore } from '@/stores/DocumentationStore';
import { fetchSearchDocumentation } from '@/utils/fetch';
import { defineComponent } from 'vue';
import type { RouteLocation } from 'vue-router';

export default defineComponent({
    name: "DocumentationNavbar",
    setup() {
        return {
            documentationStore: useDocumentationStore()
        }
    },
    emits: [
        "dropdownState"
    ],
    props: {
        "versionDropdownVisible": { type: Boolean, required: true },
        "languageDropdownVisible": { type: Boolean, required: true }
    },
    data() {
        return {
            "refreshDisabled": false,
            "refreshHover": false,
            "searchMode": "global",
            "searchQuery": "",
            "searchInterval": null as null | number,
            "searchResults": null as DocumentationSearchResponse | null,
            "searchInput": null as null | HTMLInputElement,
            "loadingIndicator": null as null | HTMLElement,
            "emptyMessage": "Type in the search bar above, and results will appear here.",
            "resultsPerPage": 5 as number,
            "offset": 0 as number,
            "inputFocus": false as boolean
        }
    },
    watch: {
        $route(from: RouteLocation, to: RouteLocation) {
            if (from.path === to.path) return;
            if (this.searchInput) this.searchInput.blur();
            this.inputFocus = false;
        }
    },
    mounted() {
        // Load Re-Used Elements
        this.searchInput = this.$refs["searchInput"] as HTMLInputElement;
        this.loadingIndicator = this.$refs["loadingIndicator"] as HTMLElement;

        // Nav Search Close
        document.addEventListener("click", (event) => {
            const target: HTMLElement = event.target as HTMLElement;
            if (target.classList.contains("disable-nav-close")) return;
            this.inputFocus = false;
        });
    },
    methods: {
        /**
         * Toggle the version dropdown menu.
         * @param event The click event.
         */
        toggleVersionMenu(event: Event): void {
            const target: HTMLElement = event.target as HTMLElement;
            if (target.tagName === "MENU") return;
            this.$emit("dropdownState", DropdownStates.version, !this.versionDropdownVisible);
        },
        /**
         * Toggle the language dropdown menu.
         * @param event The click event.
         */
        toggleLanguageMenu(event: Event): void {
            const target: HTMLElement = event.target as HTMLElement;
            if (target.tagName === "MENU") return;
            this.$emit("dropdownState", DropdownStates.language, !this.languageDropdownVisible);
        },
        /**
         * Cosmetically disable the refresh button and refetch the documentation index & recommended items.
         * Enforced by backend rate limit.
         */
        async reloadDocumentation(): Promise<void> {
            const refreshButton: HTMLButtonElement = this.$refs["refreshButton"] as HTMLButtonElement;
            if (refreshButton.disabled) return;
            refreshButton.disabled = true;
            this.refreshDisabled = true;
            await this.documentationStore.refresh();
            setTimeout(() => {
                refreshButton.disabled = false;
                this.refreshDisabled = false;
            }, 2 * 60 * 1000);
        },
        /**
         * Handle search input focus, also triggering the search interval.
         */
        searchFocusHandler(): void {
            this.inputFocus = true;
            this.searchInterval = setInterval(async () => {
                if (!this.searchInput) return;
                if (!this.searchInput.value.length) {
                    this.searchQuery = "";
                    return this.searchResults = null;
                };
                await this.search(false, this.offset);
            }, 1500);
        },
        /**
         * Handle search input blur, also clearing the search interval.
         * @param event The blur event.
         */
        searchBlurHandler(): void {
            if (!this.searchInput) return;
            if (this.searchInterval) {
                clearInterval(this.searchInterval);
                this.searchInterval = null;
                if (!this.searchInput.value.length) {
                    this.searchQuery = "";
                    this.searchResults = null;
                }
            }
        },
        /**
         * Toggle the search mode (scope).
         * @param mode The search mode to switch to.
         */
        async switchSearchMode(mode: string): Promise<void> {
            if (!this.searchInput) return;
            if (mode === this.searchMode) return;
            const validScopes: Array<string> = ["global", "titles"];
            if (!validScopes.includes(mode)) return;
            this.searchMode = mode;
            await this.search(true, this.offset);
        },
        /**
         * Get a random subject to suggest when no search results are found.
         */
        getRandomSubject(): string {
            const randomSubjects: Array<string> = ["Operator", "Apricaria", "Stelleri", "Bots", "Support", "FAQ", "Uplink", "API", "Integrating", "Authenticating", "Introduction", "Links", "Overway", "Commander", "Administrator", "Setup", "Roles"];
            return randomSubjects[Math.floor(Math.random() * randomSubjects.length)];
        },
        /**
         * Query the search engine.
         * @param force Overwrite the same search query check.
         * @param newOffset The offset to start the search from.
         */
        async search(force: boolean, newOffset: number): Promise<void | DocumentationSearchResponse> {
            // Setup
            if (!this.searchInput) return;
            if (!this.searchInputChecks(force, newOffset)) return;
            this.offset = newOffset;
            const searchValue = this.searchInput.value.trim();
            this.searchQuery = searchValue;

            // Fetch
            const data = await fetchSearchDocumentation(this.documentationStore.version, this.documentationStore.language, searchValue, this.resultsPerPage, this.offset, this.searchMode);
            if (this.loadingIndicator) this.loadingIndicator.classList.remove("visible");
            if (typeof data === "object") {
                if (data.results.length === 0 && this.offset > 0) return this.search(false, 0);
                this.emptyMessage = "Type in the search bar above, and results will appear here.";
                return this.searchResults = data;
            } else if (!data) this.emptyMessage = "An error occurred while fetching the search results.";
        },
        handleInput(): void {
            if (!this.loadingIndicator) return;
            if (!this.searchInputChecks(false, this.offset)) return;
            this.loadingIndicator.classList.add("visible");
        },
        /**
         * Perform several checks before querying the search engine to prevent unnecessary requests.
         * @param force Overwrite the same search query check.
         * @param newOffset The offset to start the search from.
         */
        searchInputChecks(force: boolean, newOffset: number): boolean {
            if (!this.searchInput) return false;
            // Same Value
            if (this.searchInput.value === this.searchQuery && !force && newOffset === this.offset) return false;
            // Zero results, and typing more
            if (this.searchResults && this.searchResults.count === 0 && this.searchInput.value.length > this.searchQuery.length) return false;
            // One result, and typing more
            if (this.searchResults && this.searchResults.count === 1 && this.searchResults.results[0].page.includes(this.searchInput.value) && this.searchInput.value.length > this.searchQuery.length) return false;
            // Empty search
            if (!this.searchInput.value.replace(/ /g, "").length) return false;
            return true;
        }
    }
});
</script>

<template>
    <header>
        <nav class="flex glass">
            <section class="left-nav flex">
                <RouterLink to="/documentation">
                    <h2>SK Docs</h2>
                </RouterLink>
            </section>
            <section class="right-nav flex">
                <div class="flex middle-nav">
                    <button title="Search through the documentation."
                        class="input-container flex navbar-pill disable-nav-close" @click.self="searchInput?.focus()"
                        type="button" :class="{ 'input-container-focused': inputFocus }">
                        <i class="fa-regular disable-nav-close fa-magnifying-glass" @click="searchInput?.focus()"></i>
                        <input class=" disable-nav-close" ref="searchInput" @focus="searchFocusHandler" type="text"
                            @blur="searchBlurHandler" maxlength="60" placeholder="Search through everything"
                            @keyup="handleInput">
                        <menu class="flex-col input-results-container disable-nav-close">
                            <div class="flex-col full-width disable-nav-close">
                                <small class="light-text disable-nav-close">Search Mode</small>
                                <div class="flex search-mode-container disable-nav-close">
                                    <button class="flex disable-nav-close"
                                        :class="{ 'active-search-mode': searchMode === 'global' }"
                                        title="Search for page titles and content." type="button"
                                        @click="switchSearchMode('global')">
                                        <i class="fa-regular fa-earth-americas disable-nav-close"></i>
                                        <p class="disable-nav-close">Globally</p>
                                    </button>
                                    <button class="flex disable-nav-close"
                                        :class="{ 'active-search-mode': searchMode === 'titles' }"
                                        title="Search for page titles." type="button"
                                        @click="switchSearchMode('titles')">
                                        <i class="fa-regular fa-font disable-nav-close"></i>
                                        <p class="disable-nav-close">Pages</p>
                                    </button>
                                </div>
                            </div>
                            <div class="flex-col full-width disable-nav-close">
                                <div class="flex disable-nav-close">
                                    <small class="light-text disable-nav-close">Results</small>
                                    <i class="fa-solid fa-circle-notch fa-spin loading-indicator disable-nav-close"
                                        ref="loadingIndicator"></i>
                                </div>
                                <section class="results full-width flex-col disable-nav-close">
                                    <RouterLink v-if="searchResults && searchResults.count > 0"
                                        class="flex-col search-result-item disable-nav-close"
                                        :title="`Visit ${searchResult.type} ${searchResult.page} in ${searchResult.category}`"
                                        :to="`/documentation/read/${searchResult.type}/${searchResult.category.replace(/ /g, '_')}${searchResult.page === 'Default' ? '' : `/${searchResult.page.replace(/ /g, '_')}`}`"
                                        v-for="searchResult of searchResults.results">
                                        <strong>{{ searchResult.page }}</strong>
                                        <div class="flex search-results-meta disable-nav-close">
                                            <p>{{ searchResult.type }}</p>
                                            <i class="fa-regular fa-circle-small"></i>
                                            <p>{{ searchResult.category }}</p>
                                        </div>
                                    </RouterLink>
                                    <p class="disable-nav-close" v-else-if="searchResults && searchResults.count === 0">
                                        No results found. Maybe try searching for {{ getRandomSubject() }}?
                                    </p>
                                    <p class="disable-nav-close" v-else> {{ emptyMessage }} </p>
                                </section>
                                <div class="flex pagination-container disable-nav-close"
                                    v-if="searchResults && searchResults.count > resultsPerPage">
                                    <button v-if="searchResults" title="Visit result pagination tab."
                                        class="disable-nav-close"
                                        @click="search(false, i * resultsPerPage - resultsPerPage)"
                                        :class="{ 'active-pagination': i * resultsPerPage - resultsPerPage === offset }"
                                        v-for="i in Math.ceil(searchResults.count / resultsPerPage)">
                                        <p class="disable-nav-close">{{ i }}</p>
                                    </button>
                                </div>
                                <small class="light-text disable-nav-close"
                                    v-if="searchResults && searchResults.count">Found {{
                                        searchResults.count }} results
                                    in {{ searchResults.duration_ms }} ms</small>
                            </div>
                        </menu>
                    </button>
                    <button title="Change the version of the documentation." type="button"
                        class="flex dropdown-container navbar-pill disable-close"
                        :class="{ 'navbar-pill-expand': versionDropdownVisible }" @click="toggleVersionMenu($event)">
                        <p class="disable-close" :class="{ 'navbar-pill-text-expand': versionDropdownVisible }">
                            Version</p>
                        <i class="fa-regular fa-code-branch"></i>
                        <menu :class="{ 'dropdown-expand': versionDropdownVisible }"
                            class="dropdown-menu dropdown-menu-left flex-col disable-close">
                            <button type="button" class="menu-item flex" @click="documentationStore.setVersion('v1')">
                                <i class="fa-regular fa-check"
                                    :class="{ 'visible': documentationStore.version === 'v1' }"></i>
                                <label>v1 Stable</label>
                            </button>
                            <button type="button" class="menu-item flex" @click="documentationStore.setVersion('v2')">
                                <i class="fa-regular fa-check"
                                    :class="{ 'visible': documentationStore.version === 'v2' }"></i>
                                <label class="disabled-text">v2 Beta</label>
                            </button>
                        </menu>
                    </button>
                </div>
                <div class="right-nav-buttons flex">
                    <RouterLink title="Go back to the homepage." class="flex navbar-pill gradient-button" to="/">
                        <p>Home</p>
                        <i class="fa-regular fa-house"></i>
                    </RouterLink>
                    <RouterLink title="Read the release notes." class="flex navbar-pill" to="/documentation">
                        <p>News</p>
                        <i class="fa-regular fa-newspaper"></i>
                    </RouterLink>
                    <button
                        :title="refreshDisabled ? 'Re-fetch is rate-limited for less than 2 minutes to prevent spam.' : 'Re-fetch the documentation.'"
                        class="flex justify-center navbar-pill" type="button" @click="reloadDocumentation()"
                        @mouseenter="refreshHover = true" ref="refreshButton"
                        :class="{ 'navbar-pill-expand': refreshHover && !refreshDisabled, 'disabled-text': refreshDisabled }"
                        @mouseleave="refreshHover = false">
                        <p :class="{ 'navbar-pill-text-expand': refreshHover && !refreshDisabled }">
                            Refresh</p>
                        <i class="fa-regular fa-rotate"></i>
                    </button>
                    <button title="Change the language of the documentation." type="button"
                        class="flex dropdown-container justify-center navbar-pill disable-close"
                        :class="{ 'navbar-pill-expand': languageDropdownVisible }" @click="toggleLanguageMenu($event)">
                        <p class="disable-close" :class="{ 'navbar-pill-text-expand': languageDropdownVisible }">
                            Language</p>
                        <i class="fa-regular fa-globe disable-close"></i>
                        <menu :class="{ 'dropdown-expand': languageDropdownVisible }"
                            class="dropdown-menu dropdown-menu-left flex-col disable-close">
                            <button type="button" class="menu-item flex"
                                @click="documentationStore.setLanguage('en-US')">
                                <i class="fa-regular fa-check"
                                    :class="{ 'visible': documentationStore.language === 'en-US' }"></i>
                                <label>English</label>
                            </button>
                            <button type="button" class="menu-item flex"
                                @click="documentationStore.setLanguage('nl-NL')">
                                <i class="fa-regular fa-check"
                                    :class="{ 'visible': documentationStore.language === 'nl-NL' }"></i>
                                <label class="disabled-text">Nederlands</label>
                            </button>
                        </menu>
                    </button>
                </div>
            </section>
        </nav>
    </header>
</template>

<style scoped>
header {
    top: 0;
    position: sticky;
    z-index: 3;
}

nav {
    justify-content: space-between;
    box-sizing: border-box;
    padding: 10px;
    position: relative;
}

.gradient-button i {
    color: var(--font);
}

.middle-nav {
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    width: min-content;
}

.input-container {
    gap: 6px;
    width: 300px;
    padding-left: 10px;
}

.input-results-container {
    top: 40px;
    position: absolute;
    margin-left: -4px;
    max-height: 0;
    width: 300px;
    transition: max-height 0.5s ease, width 0.5s, opacity 0.4s, padding 0.5s;
    border: 1px solid var(--border);
    box-sizing: border-box;
    border-radius: var(--border-radius-low);
    z-index: 4;
    background-color: var(--fill);
    opacity: 0;
    overflow: hidden;
    align-items: flex-start;
    gap: 15px;
}

.input-container:hover,
.input-container:hover .input-results-container {
    width: 400px;
}

.input-container.input-container-focused,
.input-container.input-container-focused .input-results-container {
    width: 500px;
}

.input-container.input-container-focused {
    background-color: var(--border);
}

input::placeholder {
    color: var(--font-light);
    transition: color 0.4s;
    font-weight: normal;
}

.input-container.input-container-focused input::placeholder {
    color: var(--font);
}

.input-container.input-container-focused > .input-results-container {
    max-height: 525px;
    opacity: 1;
    width: 500px;
    padding: 10px;
}

.search-mode-container {
    width: 100%;
    gap: 10px;
}

.search-mode-container button {
    width: 100%;
    height: 40px;
    border-radius: var(--border-radius-low);
    border: 1px solid var(--border);
    box-sizing: border-box;
    padding: 10px;
    gap: 10px;
    transition: background-color 0.4s;
    min-width: 100px;
}

.search-mode-container button:hover,
.active-search-mode {
    background-color: var(--border);
}

.search-mode-container button i {
    color: var(--font-light);
}

.loading-indicator {
    opacity: 0;
    color: var(--font-light);
    font-size: 13px;
    transition: opacity 0.2s;
}

.input-container input {
    font-size: 15px;
    width: 100%;
}

.results > p {
    margin-top: 10px;
    text-wrap: nowrap;
    width: 100%;
    color: var(--font-light);
    cursor: default;
}

.input-container-focused .results > p {
    text-wrap: wrap;
    text-align: center;
}

.input-results-container,
.input-results-container div,
.input-results-container small,
.input-results-container > p {
    cursor: default;
}

.search-result-item {
    gap: 10px;
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: var(--border-radius-low);
    transition: background-color 0.4s;
}

.search-result-item:hover {
    background-color: var(--border);
}

.search-results-meta p,
.search-results-meta i {
    color: var(--font-light);
    font-size: small;
}

.search-results-meta i {
    font-size: 10px;
}

.pagination-container button {
    box-sizing: border-box;
    padding: 5px;
    border-radius: var(--border-radius-low);
    height: 30px;
    width: 30px;
    border: 1px solid var(--border);
}

.pagination-container button:hover,
.active-pagination {
    background-color: var(--border);
}

.menu-item {
    gap: 10px;
    width: 100%;
}

.menu-item i {
    opacity: 0;
}

@media (width <=980px) {
    nav {
        align-items: flex-start;
        height: 96px;
    }

    .left-nav {
        position: absolute;
        left: 10px;
        top: 10px;
    }

    .right-nav {
        align-items: flex-end;
        flex-direction: column-reverse;
        width: 100%;
    }

    .middle-nav {
        position: unset;
        width: 100%;
    }

    .input-container {
        flex: 1;
    }


    .input-results-container {
        top: 90px;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
    }
}

@media (width <=535px) {
    .input-results-container {
        top: 90px;
    }

    .input-container.input-container-focused,
    .input-container.input-container-focused .input-results-container {
        width: calc(100% - 20px);
    }
}

@media (width <=270px) {
    .search-mode-container {
        flex-wrap: wrap;
    }

    .input-container.input-container-focused,
    .input-container.input-container-focused .input-results-container {
        max-height: 700px;
    }
}
</style>