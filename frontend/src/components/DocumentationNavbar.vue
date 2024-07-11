<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "DocumentationNavbar",
    data() {
        return {
            "languageDropdownVisible": false,
            "homeHover": false,
            "newsHover": false,
            "languageHover": false
        }
    },
    async mounted() {
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
    <header>
        <nav class="flex">
            <section class="left-nav flex">
                <h2>SK Docs</h2>
            </section>
            <section class="right-nav flex">
                <button title="Search through the documentation." class="input-container flex navbar-pill"
                    @click="($refs['searchbar'] as HTMLInputElement).focus()" type="button">
                    <i class="fa-regular fa-magnifying-glass"></i>
                    <input ref="searchbar" type="text" placeholder="Search through everything">
                </button>
                <div class="right-nav-buttons flex">
                    <RouterLink title="Go back to the homepage." class="flex justify-center navbar-pill gradient-button"
                        to="/" @mouseenter="homeHover = true" :class="homeHover ? 'navbar-pill-expand' : ''"
                        @mouseleave="homeHover = false">
                        <p :class="homeHover ? 'navbar-pill-text-expand' : 'navbar-pill-text-closed'">Home</p>
                        <i class="fa-regular fa-house"></i>
                    </RouterLink>
                    <a title="Read the release notes." class="flex justify-center navbar-pill" href="#"
                        @mouseenter="newsHover = true" :class="newsHover ? 'navbar-pill-expand' : ''"
                        @mouseleave="newsHover = false">
                        <p :class="newsHover ? 'navbar-pill-text-expand' : 'navbar-pill-text-closed'">News</p>
                        <i class="fa-regular fa-newspaper"></i>
                    </a>
                    <button title="Change the language of the documentation." type="button"
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
}

.navbar-pill p {
    overflow: hidden;
}

.gradient-button i {
    color: var(--font);
}

.input-container {
    gap: 5px;
    width: 300px;
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
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

.fa-house {
    margin-right: 3px;
}

.fa-newspaper,
.fa-globe {
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

    .input-container {
        top: 50px;
        width: calc(100vw - 20px);
    }
}
</style>