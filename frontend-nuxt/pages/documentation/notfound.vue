<template>
    <div class="content-parent flex-col">
        <article class="flex-col">
            <h2>Whoops! This page does not exist.</h2>
            <strong>Seems like {{ useRoute().query.type }} '{{ useRoute().query.page }}' does not exist in category '{{
                useRoute().query.category }}'</strong>
            <p>This might happen due to this page not being supported by your version and/or language settings.</p>
            <NuxtLink class="back-link" :to="useRoute().redirectedFrom?.fullPath || '/documentation'">Go back</NuxtLink>
            <div class="flex">
                <p class="light-text">Do think this is a mistake? Contact support</p>
                <NuxtLink to="/documentation/read/Doc/Community/Support" class="link-text">here</NuxtLink>
            </div>
        </article>
    </div>
</template>

<style scoped>
.content-parent {
    height: calc(100vh - 256px);
    width: 100%;
    justify-content: center;
    align-items: center;
}

article {
    align-items: center;
    gap: 10px;
    max-width: 700px;
    text-align: center;
}

.back-link {
    margin: 20px 0;
}

@media (width <=700px) {
    article {
        width: 95%;
    }

    article > p {
        max-width: 400px;
    }
}
</style>
