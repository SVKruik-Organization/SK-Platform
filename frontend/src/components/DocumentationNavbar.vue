<script lang="ts">
import { useDocumentationStore } from '@/stores/DocumentationStore';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "DocumentationNavbar",
    setup() {
        return {
            documentationStore: useDocumentationStore()
        }
    },
    data() {
        return {
            "versionDropdownVisible": false,
            "languageDropdownVisible": false,
            "versionHover": false,
            "homeHover": false,
            "newsHover": false,
            "refreshHover": false,
            "languageHover": false,
            "refreshDisabled": false
        }
    },
    async mounted() {
        // Toggle Dropdown
        document.addEventListener("click", event => {
            const target: HTMLElement = event.target as HTMLElement;
            if (target.classList.contains("disable-close")) return;
            if (target.tagName === "MENU") return;
            this.languageDropdownVisible = false;
            this.versionDropdownVisible = false;
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
            this.versionDropdownVisible = !this.versionDropdownVisible;
        },
        /**
         * Toggle the language dropdown menu.
         * @param event The click event.
         */
        toggleLanguageMenu(event: Event): void {
            const target: HTMLElement = event.target as HTMLElement;
            if (target.tagName === "MENU") return;
            this.languageDropdownVisible = !this.languageDropdownVisible;
        },
        /**
         * Cosmetically disable the refresh button.
         * Enforced by backend rate limit.
         */
        reloadDocumentation(): void {
            const refreshButton: HTMLButtonElement = this.$refs["refreshButton"] as HTMLButtonElement;
            if (refreshButton.disabled) return;
            refreshButton.disabled = true;
            this.refreshDisabled = true;
            this.documentationStore.getIndex(true);
            setTimeout(() => {
                refreshButton.disabled = false;
                this.refreshDisabled = false;
            }, 2 * 60 * 1000);
        }
    }
});
</script>

<template>
    <header>
        <nav class="flex">
            <section class="left-nav flex">
                <RouterLink to="/documentation">
                    <h2>SK Docs</h2>
                </RouterLink>
            </section>
            <section class="right-nav flex">
                <div class="flex middle-nav">
                    <button title="Search through the documentation." class="input-container flex navbar-pill"
                        @click="($refs['searchbar'] as HTMLInputElement).focus()" type="button">
                        <i class="fa-regular fa-magnifying-glass"></i>
                        <input ref="searchbar" type="text" placeholder="Search through everything">
                    </button>
                    <button title="Change the language of the documentation." type="button"
                        class="flex language-container justify-center navbar-pill disable-close version-disable-close"
                        :class="{ 'navbar-pill-expand': versionHover || versionDropdownVisible }"
                        @mouseenter="versionHover = true" @mouseleave="versionHover = false"
                        @click="toggleVersionMenu($event)">
                        <p class="disable-close version-disable-close"
                            :class="versionHover || versionDropdownVisible ? 'navbar-pill-text-expand' : 'navbar-pill-text-closed'">
                            Version</p>
                        <i class="fa-regular fa-code-branch"></i>
                        <menu :class="{ 'language-dropdown-expand': versionDropdownVisible }"
                            class="dropdown-menu flex-col disable-close version-disable-close">
                            <button type="button" class="menu-item flex" @click="documentationStore.setVersion('v1')">
                                <i class="fa-regular fa-check"
                                    :class="{ 'visible': documentationStore.version === 'v1' }"></i>
                                <p>v1 Stable</p>
                            </button>
                            <button type="button" class="menu-item flex" @click="documentationStore.setVersion('v2')">
                                <i class="fa-regular fa-check"
                                    :class="{ 'visible': documentationStore.version === 'v2' }"></i>
                                <p class="light-text">v2 Beta</p>
                            </button>
                        </menu>
                    </button>
                </div>
                <div class="right-nav-buttons flex">
                    <RouterLink title="Go back to the homepage." class="flex justify-center navbar-pill gradient-button"
                        to="/" @mouseenter="homeHover = true" :class="{ 'navbar-pill-expand': homeHover }"
                        @mouseleave="homeHover = false">
                        <p :class="homeHover ? 'navbar-pill-text-expand' : 'navbar-pill-text-closed'">Home</p>
                        <i class="fa-regular fa-house"></i>
                    </RouterLink>
                    <a title="Read the release notes." class="flex justify-center navbar-pill" href="#"
                        @mouseenter="newsHover = true" :class="{ 'navbar-pill-expand': newsHover }"
                        @mouseleave="newsHover = false">
                        <p :class="newsHover ? 'navbar-pill-text-expand' : 'navbar-pill-text-closed'">News</p>
                        <i class="fa-regular fa-newspaper"></i>
                    </a>
                    <button
                        :title="refreshDisabled ? 'Re-fetch is rate-limited for less than 2 minutes to prevent spam.' : 'Re-fetch the documentation.'"
                        class="flex justify-center navbar-pill" type="button" @click="reloadDocumentation()"
                        @mouseenter="refreshHover = true" ref="refreshButton"
                        :class="{ 'navbar-pill-expand': refreshHover && !refreshDisabled, 'light-text': refreshDisabled }"
                        @mouseleave="refreshHover = false">
                        <p
                            :class="refreshHover && !refreshDisabled ? 'navbar-pill-text-expand' : 'navbar-pill-text-closed'">
                            Refresh</p>
                        <i class="fa-regular fa-rotate"></i>
                    </button>
                    <button title="Change the language of the documentation." type="button"
                        class="flex language-container justify-center navbar-pill disable-close language-disable-close"
                        :class="{ 'navbar-pill-expand': languageHover || languageDropdownVisible }"
                        @mouseenter="languageHover = true" @mouseleave="languageHover = false"
                        @click="toggleLanguageMenu($event)">
                        <p class="disable-close language-disable-close"
                            :class="languageHover || languageDropdownVisible ? 'navbar-pill-text-expand' : 'navbar-pill-text-closed'">
                            Language</p>
                        <i class="fa-regular fa-globe disable-close language-disable-close"></i>
                        <menu :class="{ 'language-dropdown-expand': languageDropdownVisible }"
                            class="dropdown-menu flex-col disable-close language-disable-close">
                            <button type="button" class="menu-item flex"
                                @click="documentationStore.setLanguage('en-US')">
                                <i class="fa-regular fa-check"
                                    :class="{ 'visible': documentationStore.language === 'en-US' }"></i>
                                <p>English</p>
                            </button>
                            <button type="button" class="menu-item flex"
                                @click="documentationStore.setLanguage('nl-NL')">
                                <i class="fa-regular fa-check"
                                    :class="{ 'visible': documentationStore.language === 'nl-NL' }"></i>
                                <p>Nederlands</p>
                            </button>
                        </menu>
                    </button>
                </div>
            </section>
        </nav>
    </header>
</template>

<style scoped>
nav {
    justify-content: space-between;
    box-sizing: border-box;
    padding: 10px;
    position: relative;
    border-bottom: 1px solid var(--border);
}

.justify-center {
    justify-content: center;
}

.navbar-pill {
    border-radius: var(--border-radius-low);
    border: 1px solid var(--border);
    background-color: var(--fill);
    height: 35px;
    box-sizing: border-box;
    padding: 5px;
    width: 35px;
    transition: width 0.5s;
}

.navbar-pill-expand {
    width: 120px;
}

.navbar-pill-text-expand {
    opacity: 1;
    width: 75px;
    transition: width 0.6s, opacity 1s;
}

.navbar-pill-text-closed {
    opacity: 0;
    width: 0;
    transition: width 0.6s, opacity 1s;
}

.navbar-pill i {
    font-size: 14px;
    color: var(--font-light);
}

.navbar-pill p {
    overflow: hidden;
    text-align: left;
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
    gap: 5px;
    width: 300px;
}

.version-select {
    width: min-content;
    box-sizing: border-box;
    padding: 0 10px;
    color: var(--font-light);
}

.input-container input {
    font-size: 15px;
    width: 100%;
}

input::placeholder {
    color: var(--font-light);
}

.language-container {
    position: relative;
}

.dropdown-menu {
    position: absolute;
    box-sizing: border-box;
    padding: 5px 5px 5px 10px;
    top: 40px;
    width: 170px;
    opacity: 0;
    height: 0;
    right: -2px;
    border-radius: var(--border-radius-low);
    background-color: var(--fill);
    border: 1px solid var(--border);
    transition: height 0.8s, opacity 0.7s;
    overflow: hidden;
}

.language-dropdown-expand {
    height: 55px;
    opacity: 1;
    transition: height 0.4s, opacity 0.3s;
}

.version-dropdown-expand {
    height: 55px;
    opacity: 1;
    transition: height 0.4s, opacity 0.3s;
}

.menu-item {
    gap: 10px;
    width: 100%;
}

.menu-item i {
    opacity: 0;
}

.fa-house {
    margin-right: 3px;
}

.fa-newspaper,
.fa-globe,
.fa-rotate,
.fa-code-branch {
    margin-right: 4px;
}

@media (width <=800px) {
    nav {
        align-items: flex-start;
        height: 92px;
    }

    .right-nav {
        align-items: flex-end;
        flex-direction: column-reverse;
    }

    .middle-nav {
        top: 50px;
        width: calc(100vw - 27px);
    }

    .input-container {
        flex: 1;
    }
}
</style>