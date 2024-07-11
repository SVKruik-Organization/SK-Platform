<script lang="ts">
import { fetchDocs } from '@/utils/fetch';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "DocumentationView",
    data() {
        return {
            "html": "",
            "languageDropdownVisible": false,
            "newsHover": false,
            "languageHover": false
        }
    },
    async mounted() {
        // Load HTML Sample
        const data = await fetchDocs("Community", "Template", "v1", "en-US");
        if (typeof data === "string") return;
        this.html = data.file;

        // Toggle Dropdown
        document.addEventListener("click", event => {
            const target: HTMLElement = event.target as HTMLElement;
            if (target.classList.contains("disable-close")) return;
            this.languageDropdownVisible = false;
        });
    }
});
</script>

<template>
    <nav class="flex">
        <section class="left-nav flex">
            <h2>SK Docs</h2>
        </section>
        <section class="middle-nav flex">
            <button title="Search through the documentation." class="input-container flex navbar-pill"
                @click="($refs['searchbar'] as HTMLInputElement).focus()">
                <i class="fa-regular fa-magnifying-glass"></i>
                <input ref="searchbar" type="text" placeholder="Search through everything">
            </button>
        </section>
        <section class="right-nav flex">
            <a title="Read the release notes." class="flex justify-center navbar-pill" href="#"
                @mouseenter="newsHover = true" :class="newsHover ? 'navbar-pill-expand' : ''"
                @mouseleave="newsHover = false">
                <p :class="newsHover ? 'navbar-pill-text-expand' : 'navbar-pill-text-closed'">News</p>
                <i class="fa-regular fa-newspaper"></i>
            </a>
            <button title="Change the language of the documentation."
                class="flex language-container justify-center navbar-pill disable-close"
                :class="languageHover || languageDropdownVisible ? 'navbar-pill-expand' : ''"
                @mouseenter="languageHover = true" @mouseleave="languageHover = false"
                @click="languageDropdownVisible = !languageDropdownVisible">
                <p class="disable-close"
                    :class="languageHover || languageDropdownVisible ? 'navbar-pill-text-expand' : 'navbar-pill-text-closed'">
                    Language</p>
                <i class="fa-regular fa-globe disable-close"></i>
                <menu v-if="languageDropdownVisible" class="dropdown-menu flex-col disable-close"
                    ref="language-dropdown">
                    <p class="disable-close">English</p>
                    <p class="disable-close">Nederlands</p>
                </menu>
            </button>
        </section>
    </nav>
    <main>
        <div v-html="html"></div>
    </main>
</template>

<style scoped>
nav {
    justify-content: space-between;
    box-sizing: border-box;
    padding: 10px;
    position: relative;
}

.middle-nav {
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
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
    justify-content: flex-end;
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
}

.navbar-pill i {
    font-size: 14px;
    color: var(--font-light);
    margin: 0 5px;
}

.navbar-pill p {
    overflow: hidden;
}

.input-container {
    gap: 5px;
    width: 300px;
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
    padding: 5px;
    top: 40px;
    width: 140px;
    height: fit-content;
    right: 0;
    border-radius: var(--border-radius-low);
    background-color: var(--fill);
    border: 1px solid var(--border);
}
</style>
