<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "DocumentationFooter",
    data() {
        return {
            "pressedButton": "" as string
        }
    },
});
</script>

<template>
    <footer>
        <form class="flex-col documentation-footer-item">
            <h4>Happy with SK Docs?</h4>
            <p class="light-text small-text documentation-footer-item-description">Leave a vote and/or leave a comment.
                Feedback is always greatly appreciated.</p>
            <div class="flex">
                <button @click="pressedButton = 'like'" class="flex footer-button footer-button-like"
                    :class="{ 'active-button-like': pressedButton === 'like' }" type="button"
                    title="Click this if you like the design and information available.">
                    <i class="fa-regular fa-heart light-text"></i>
                    <p>Yes</p>
                </button>
                <button @click="pressedButton = 'dislike'" class="flex footer-button footer-button-dislike"
                    :class="{ 'active-button-dislike': pressedButton === 'dislike' }" type="button"
                    title="Click this if you think some things could be better.">
                    <i class="fa-regular fa-heart-crack light-text"></i>
                    <p>No</p>
                </button>
                <button v-if="pressedButton != ''" class="flex footer-button footer-button-comment" type="button"
                    title="Leave a comment so I can take a look at your feedback.">
                    <i class="fa-regular fa-comment light-text"></i>
                    <p>Comment</p>
                </button>
            </div>
        </form>
        <div class="flex-col documentation-footer-item">
            <h4>Contributing</h4>
            <p class="light-text small-text documentation-footer-item-description">See room for improvement or is
                something unclear? You (yes, you!) can help making SK Docs.</p>
            <div class="flex-col">
                <RouterLink to="/documentation/read/Doc/Contributing/SK_Docs"
                    class="flex footer-button footer-button-contribute">
                    <i class="fa-regular fa-handshake-angle light-text"></i>
                    <p>Help writing SK Docs</p>
                </RouterLink>
            </div>
        </div>
        <div class="flex-col documentation-footer-item">
            <h4>Docs didn't cut it?</h4>
            <p class="light-text small-text documentation-footer-item-description">Seek community help or contact me
                personally if you need anything. I am always happy to have a chat.</p>
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
    </footer>
</template>

<style scoped>
footer {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    max-width: 1200px;
    width: 100%;
}

.documentation-footer-item {
    gap: 20px;
}

.documentation-footer-item-description {
    max-width: 320px;
}

.footer-button {
    border-radius: var(--border-radius-low);
    border: 1px solid var(--border);
    background-color: var(--fill);
    height: 35px;
    box-sizing: border-box;
    padding: 5px 10px;
    width: max-content;
    gap: 10px;
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

.footer-button-contribute:hover,
.footer-button-comment:hover {
    border: 1px solid #355667;
    background-color: #5b6b78;
}

.footer-button-like:hover p,
.footer-button-like:hover i,
.footer-button-dislike:hover p,
.footer-button-dislike:hover i,
.footer-button-contribute:hover p,
.footer-button-contribute:hover i,
.footer-button-comment:hover p,
.footer-button-comment:hover i {
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

.footer-link {
    gap: 10px;
    padding: 5px;
}

.footer-link p {
    text-decoration: underline;
}

@media (width <=1280px) {
    footer {
        display: flex;
        justify-content: space-between;
        margin-bottom: 70px;
        flex-wrap: wrap;
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

@media (width <=920px) {
    footer {
        align-items: center;
        row-gap: 60px;
    }

    .documentation-footer-item {
        width: 100%;
    }
}
</style>