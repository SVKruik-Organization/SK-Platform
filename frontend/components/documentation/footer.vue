<script setup lang="ts">
import { DropdownStates, type DocumentationTypes } from '@/assets/customTypes';
import { useDocumentationStore } from '@/stores/DocumentationStore';
import { createTicket } from '@/utils/ticket';
import { type PropType } from 'vue';

// Setup
const documentationStore = useDocumentationStore();
const emit = defineEmits(["dropdownState"]);

// Props
const props = defineProps({
    "commentOverlayVisible": { type: Boolean, required: true },
    "type": { type: String as PropType<DocumentationTypes>, required: false },
    "category": { type: String, required: false },
    "page": { type: String, required: false }
});

// Reactive Data
const pressedButton: Ref<string> = ref("");
const commentData: Ref<string> = ref("");
const submissionType: Ref<string> = ref("voting");
const voteTicket: Ref<string> = ref("");

// HTML Elements
const confirmationMessage: Ref<HTMLParagraphElement | null> = ref(null);

onMounted(() => {
    if (documentationStore.voteCast.length) voteTicket.value = documentationStore.voteCast.slice(0, 8);
});

// Methods

/**
 * Cast a vote for the documentation page.
 * @param value The value of the vote.
 */
async function castDocumentationVote(value: boolean) {
    // Prevent Double Vote
    if (value && pressedButton.value === "like") return;
    if (!value && pressedButton.value === "dislike") return;
    if (voteCastCurrentPage.value) return;
    voteTicket.value = createTicket();

    // Set Button
    if (value) {
        pressedButton.value = "like";
    } else pressedButton.value = "dislike";

    // Cast Vote
    (await useFetchDocumentationVote(documentationStore.version, documentationStore.language, value, props.type || null, props.category || null, props.page || null, voteTicket.value)).value;
    documentationStore.voteCast = `${voteTicket.value}-${props.type}/${props.category}/${props.page}`;

    // Confirmation Message
    const element = confirmationMessage.value;
    if (!element) return;
    submissionType.value = "voting";
    element.classList.add("visible");
    setTimeout(() => {
        element.classList.remove("visible");
    }, 2000);
}

/**
 * Submit additional comment for the vote.
 */
async function submitCommentDocumentationVote() {
    (await useFetchDocumentationComment(voteTicket.value, commentData.value.slice(0, 255))).value;

    // Confirmation Message
    const element = confirmationMessage.value;
    if (!element) return;
    submissionType.value = "commenting";
    element.classList.add("visible");
    setTimeout(() => {
        element.classList.remove("visible");
    }, 2000);
}

/**
 * Open the comment overlay.
 */
function commentDocumentationVote() {
    if (voteCastCurrentPage.value && commentData.value.length > 0) return;
    emit("dropdownState", DropdownStates.comment, true);
}

const voteCastCurrentPage = computed<boolean>(() => {
    if (!documentationStore.voteCast.length) return false;
    return documentationStore.voteCast.slice(9) === `${props.type}/${props.category}/${props.page}`;
});
</script>

<template>
    <div class="flex comment-overlay glass" v-if="commentOverlayVisible">
        <form class="flex-col disable-close">
            <h3 class="disable-close">Leave a vote comment</h3>
            <p class="light-text disable-close">Leave additional information for your vote so I can process your
                feedback. Want to leave more information? Don't hesitate to <NuxtLink
                    to="/documentation/read/Doc/Community/Support"> reach out</NuxtLink>.</p>
            <textarea v-model="commentData" class="comment-textarea disable-close" maxlength="255"></textarea>
            <p class="light-text small-text disable-close">{{ 255 - commentData.length }} characters left</p>
            <div class="flex">
                <button class="footer-button footer-button-like" @click.prevent="submitCommentDocumentationVote"
                    type="submit">Submit</button>
            </div>
        </form>
    </div>
    <footer>
        <form class="flex-col documentation-footer-item">
            <h4>Happy with SK Docs?</h4>
            <p class="light-text small-text documentation-footer-item-description">Leave a vote and/or leave a comment.
                Feedback is always greatly appreciated.</p>
            <div class="flex">
                <ClientOnly>
                    <button @click="castDocumentationVote(true)" class="flex footer-button footer-button-like"
                        :class="{ 'active-button-like': pressedButton === 'like', 'disabled-button': voteCastCurrentPage }"
                        type="button" title="Click this if you like the design and information available.">
                        <i class="fa-regular fa-heart light-text"></i>
                        <p>Yes</p>
                    </button>
                    <button @click="castDocumentationVote(false)" class="flex footer-button footer-button-dislike"
                        :class="{ 'active-button-dislike': pressedButton === 'dislike', 'disabled-button': voteCastCurrentPage }"
                        type="button" title="Click this if you think some things could be better.">
                        <i class="fa-regular fa-heart-crack light-text"></i>
                        <p>No</p>
                    </button>
                    <button v-if="pressedButton.length || voteCastCurrentPage"
                        class="flex footer-button footer-button-comment disable-close" type="button"
                        :class="{ 'disabled-button': voteCastCurrentPage && commentData.length }"
                        @click="commentDocumentationVote"
                        title="Leave a comment so I can take a look at your feedback.">
                        <i class="fa-regular fa-comment light-text disable-close"></i>
                        <p class="disable-close">Comment</p>
                    </button>
                </ClientOnly>
            </div>
            <p ref="confirmationMessage" class="confirmation-message">Thank you so much for {{ submissionType }}!</p>
        </form>
        <div class="flex-col documentation-footer-item">
            <h4>Contributing</h4>
            <p class="light-text small-text documentation-footer-item-description">Do you have simple HTML skills and
                want to make a difference? Expand SK Docs.</p>
            <div class="flex-col">
                <NuxtLink to="/documentation/read/Doc/Contributing/SK_Docs"
                    class="flex footer-button footer-button-contribute">
                    <i class="fa-regular fa-handshake-angle light-text"></i>
                    <p>Help writing SK Docs</p>
                </NuxtLink>
            </div>
        </div>
        <div class="flex-col documentation-footer-item">
            <h4>Docs didn't cut it?</h4>
            <p class="light-text small-text documentation-footer-item-description">Seek community help or contact me
                personally if you need anything. I am always happy to have a chat.</p>
            <div class="flex-col">
                <NuxtLink to="/documentation/read/Doc/Community/Support" class="flex footer-link">
                    <i class="fa-regular fa-mailbox-flag-up"></i>
                    <p class="link-text">Contact support</p>
                </NuxtLink>
                <NuxtLink to="/documentation/read/Doc/Community/Links#Discord" class="flex footer-link">
                    <i class="fa-brands fa-discord"></i>
                    <p class="link-text">Join the Discord</p>
                </NuxtLink>
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

.confirmation-message {
    opacity: 0;
    transition: 0.3s;
    margin-bottom: 20px;
}

.comment-overlay {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    z-index: 5;
    align-items: center;
    justify-content: center;
}

.comment-overlay form {
    background-color: var(--fill-light);
    border-radius: var(--border-radius-low);
    border: 1px solid var(--fill);
    padding: 20px;
    gap: 10px;
    max-width: 400px;
    margin: 0 10px;
    width: 100%;
}

.comment-overlay textarea {
    resize: vertical;
    width: 100%;
    height: 200px;
    background-color: var(--fill);
    border-radius: var(--border-radius-low);
    border: 1px solid var(--border);
    box-sizing: border-box;
    max-height: 400px;
    padding: 5px;
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

@media (width <=310px) {
    footer {
        justify-content: center;
    }

    .documentation-footer-item {
        width: 95%;
    }

    .documentation-footer-item > div {
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
    }
}
</style>