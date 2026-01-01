<script setup lang="ts">
import { ToastTypes, type DocumentationTypes, type ToastItem } from "@/assets/customTypes";
import { useDocumentationStore } from "@/stores/DocumentationStore";
import { createTicket } from "@svkruik/sk-platform-formatters";
import { useFetchDocumentationComment } from "@/utils/fetch/documentation/useFetchDocumentationComment";
import { useFetchDocumentationVote } from "@/utils/fetch/documentation/useFetchDocumentationVote";

// Setup
const documentationStore = useDocumentationStore();
const { $event } = useNuxtApp();

// Props
const props = defineProps<{
    type?: DocumentationTypes;
    category?: string;
    page?: string;
    styles?: string;
}>();

// Reactive Data
const pressedButton: Ref<string> = ref("");
const commentData: Ref<string> = ref("");
const submissionType: Ref<string> = ref("voting");
const voteTicket: Ref<string> = ref("");
const commentOverlayVisible: Ref<boolean> = ref(false);

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
async function submitDocumentationVote(value: boolean): Promise<void> {
    try {
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
        await useFetchDocumentationVote(documentationStore.version, documentationStore.language, value, voteTicket.value, props.type, props.category, props.page);
        documentationStore.voteCast = `${voteTicket.value}-${props.type}/${props.category}/${props.page}`;

        // Confirmation Message
        const element = confirmationMessage.value;
        if (!element) return;
        submissionType.value = "voting";
        element.classList.add("visible");
        setTimeout(() => {
            element.classList.remove("visible");
        }, 2000);
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message,
            duration: 3,
        } as ToastItem);
    }
}

/**
 * Submit additional comment for the vote.
 */
async function submitDocumentationComment(): Promise<void> {
    try {
        await useFetchDocumentationComment(voteTicket.value, commentData.value.slice(0, 255));
        documentationStore.commentCast = `${voteTicket.value}-${props.type}/${props.category}/${props.page}`;

        // Confirmation Message
        const element = confirmationMessage.value;
        if (!element) return;
        submissionType.value = "commenting";
        element.classList.add("visible");
        setTimeout(() => {
            element.classList.remove("visible");
        }, 2000);
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message,
            duration: 3,
        } as ToastItem);
    }
}

/**
 * Open the comment overlay.
 */
function commentDocumentationVote(): void {
    if (voteCastCurrentPage.value && commentData.value.length > 0) return;
    commentOverlayVisible.value = true;
}

// Computed Variables
const voteCastCurrentPage = computed<boolean>(() => {
    if (!documentationStore.voteCast.length) return false;
    return documentationStore.voteCast.slice(9) === `${props.type}/${props.category}/${props.page}`;
});
const commentCastCurrentPage = computed<boolean>(() => {
    return voteCastCurrentPage.value && documentationStore.commentCast.slice(9) === `${props.type}/${props.category}/${props.page}`;
});
</script>

<template>
    <div class="flex comment-overlay glass" v-if="commentOverlayVisible" @click="commentOverlayVisible = false">
        <form class="flex-col" @click.stop>
            <h3>Leave a vote comment</h3>
            <p class="light-text">Leave additional information for your vote so I can process your
                feedback. Want to leave more information? Don't hesitate to <NuxtLink
                    to="/documentation/read/Doc/Community/Support"> reach out</NuxtLink>.</p>
            <textarea v-model="commentData" class="comment-textarea" maxlength="255"></textarea>
            <p class="light-text small-text">{{ 255 - commentData.length }} characters left</p>
            <div class="flex">
                <button class="footer-button footer-button-like" @click.prevent="submitDocumentationComment"
                    type="submit">Submit</button>
            </div>
        </form>
    </div>
    <footer :class="styles">
        <form class="flex-col documentation-footer-item">
            <h4>Happy with SK Docs?</h4>
            <p class="light-text small-text documentation-footer-item-description">Leave a vote and optional comment.
                Feedback is always greatly appreciated.</p>
            <div class="flex">
                <button @click="submitDocumentationVote(true)" class="flex footer-button footer-button-like"
                    :class="{ 'active-button-like': pressedButton === 'like', 'disabled-button': voteCastCurrentPage }"
                    type="button" title="Click this if you like the design and information available.">
                    <NuxtImg class="icon icon-light" width="18" height="18" src="/svg/heart-regular.svg" loading="lazy"
                        alt="Icon" />
                    <p>Yes</p>
                </button>
                <button @click="submitDocumentationVote(false)" class="flex footer-button footer-button-dislike"
                    :class="{ 'active-button-dislike': pressedButton === 'dislike', 'disabled-button': voteCastCurrentPage }"
                    type="button" title="Click this if you think some things could be better.">
                    <NuxtImg class="icon icon-light" width="18" height="18" src="/svg/heart-crack-regular.svg"
                        loading="lazy" alt="Icon" />
                    <p>No</p>
                </button>
                <button v-if="pressedButton.length || voteCastCurrentPage"
                    class="flex footer-button footer-button-comment" type="button"
                    :class="{ 'disabled-button': commentCastCurrentPage }" @click="commentDocumentationVote"
                    title="Leave a comment so I can take a look at your feedback.">
                    <NuxtImg class="icon icon-light" width="18" height="18" src="/svg/comment-regular.svg"
                        loading="lazy" alt="Icon" />
                    <p>Comment</p>
                </button>
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
                    <NuxtImg class="icon icon-light" width="18" height="18" src="/svg/handshake-angle-regular.svg"
                        loading="lazy" alt="Icon" />
                    <p>Help writing SK Docs</p>
                </NuxtLink>
            </div>
        </div>
        <div class="flex-col documentation-footer-item">
            <h4>SK Docs didn't cut it?</h4>
            <p class="light-text small-text documentation-footer-item-description">Seek community help or contact me
                personally if you need anything. I am always happy to have a chat.</p>
            <div class="flex-col">
                <NuxtLink to="/documentation/read/Doc/Community/Support" class="flex footer-link">
                    <NuxtImg class="icon" width="18" height="18" src="/svg/mailbox-flag-up-regular.svg" loading="lazy"
                        alt="Icon" />
                    <p class="link-text">Contact support</p>
                </NuxtLink>
                <NuxtLink to="/documentation/read/Doc/Community/Links#Discord" class="flex footer-link">
                    <NuxtImg class="icon" width="18" height="18" src="/svg/discord-brands-solid.svg" loading="lazy"
                        alt="Icon" />
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

.read-footer {
    margin-bottom: 40px;
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

.footer-button:hover p {
    color: var(--white);
}

.footer-button:hover .icon {
    filter: invert(1);
}

.active-button-like,
.footer-button-like:hover {
    border: 1px solid #345a32;
    background-color: #5c7f5d;
}

.active-button-dislike,
.footer-button-dislike:hover {
    border: 1px solid #9f4c4c;
    background-color: #8e4444;
}

.footer-button-contribute:hover,
.footer-button-comment:hover {
    border: 1px solid #355667;
    background-color: #5b6b78;
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
    cursor: pointer;
}

.comment-overlay form {
    background-color: var(--border);
    border-radius: var(--border-radius-low);
    border: 1px solid var(--fill);
    padding: 20px;
    gap: 10px;
    max-width: 400px;
    margin: 0 10px;
    width: 100%;
    cursor: default;
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

@media (width <=1500px) {
    footer {
        display: flex;
        justify-content: space-between;
        margin-bottom: 70px;
        flex-wrap: wrap;
    }

    .read-footer {
        justify-content: center;
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

    .confirmation-message {
        margin-bottom: -30px;
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