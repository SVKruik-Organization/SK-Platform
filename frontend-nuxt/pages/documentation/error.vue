<template>
    <div class="content-parent flex-col">
        <article class="flex-col">
            <h2>Whoops! Something went wrong.</h2>
            <strong>Some error occured while retrieving your documentation page.</strong>
            <p>This might happen due to a network error or the documentation server having a hard time.</p>
            <NuxtLink class="back-link link-text" :to="useRoute().redirectedFrom?.fullPath || '/documentation'">Go back
            </NuxtLink>
            <div class="flex">
                <p class="light-text">I am probably fixing this as you read this, so please try again later!</p>
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
