<script lang="ts">
import { DropdownStates } from '@/assets/customTypes';
import { useDocumentationStore } from '@/stores/DocumentationStore';
import { defineComponent } from 'vue';

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
            "refreshHover": false
        }
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
                    <a title="Read the release notes." class="flex navbar-pill" href="#">
                        <p>News</p>
                        <i class="fa-regular fa-newspaper"></i>
                    </a>
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
nav {
    justify-content: space-between;
    box-sizing: border-box;
    padding: 10px;
    position: relative;
    border-bottom: 1px solid var(--border);
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

.input-container:hover {
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

.menu-item {
    gap: 10px;
    width: 100%;
}

.menu-item i {
    opacity: 0;
}

@media (width <=800px) {
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
}
</style>