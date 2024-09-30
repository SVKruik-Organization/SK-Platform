import { defineStore } from "pinia";
import { useSessionStorage, useLocalStorage } from "@vueuse/core";
import { IndexPlaceholder, RecommendedPlaceholder, type DocumentationIndexItem, type RecommendedItem } from "@/assets/customTypes";

export const useDocumentationStore = defineStore("documentationStore", {
    state: () => ({
        docIndex: useSessionStorage("docIndex", [] as Array<DocumentationIndexItem>),
        guideIndex: useSessionStorage("guideIndex", [] as Array<DocumentationIndexItem>),
        recommendedDocItems: useLocalStorage("recommendedDocItems", [] as Array<RecommendedItem>),
        recommendedGuideItems: useLocalStorage("recommendedGuideItems", [] as Array<RecommendedItem>),
        version: useLocalStorage("documentationVersion", "v1" as string),
        language: useLocalStorage("language", "en-US" as string),
        voteCast: useSessionStorage("voteCast", "" as string)
    }),
    hydrate(state) {
        state.docIndex = useSessionStorage("docIndex", []);
        state.guideIndex = useSessionStorage("guideIndex", []);
        state.recommendedDocItems = useLocalStorage("recommendedDocItems", []);
        state.recommendedGuideItems = useLocalStorage("recommendedGuideItems", []);
        state.version = useLocalStorage("documentationVersion", "v1");
        state.language = useLocalStorage("language", "en-US");
        state.voteCast = useSessionStorage("voteCast", "");
    },
    actions: {
        /**
         * Change the documentation version.
         * @param newLanguage The new version to set to.
         * @returns Void, return if invalid.
         */
        async setVersion(newVersion: string): Promise<void> {
            if (newVersion === this.version) return;
            const validVersions: Array<string> = ["v1"];
            if (!validVersions.includes(newVersion)) return;
            this.version = newVersion;
            await this.refresh();
        },
        /**
         * Change the documentation language.
         * @param newLanguage The new language to set to.
         * @returns Void, return if invalid.
         */
        async setLanguage(newLanguage: string): Promise<void> {
            if (newLanguage === this.language) return;
            const validLanguages: Array<string> = ["en-US"];
            if (!validLanguages.includes(newLanguage)) return;
            this.language = newLanguage;
            await this.refresh();
        },
        /**
         * Retrieve the index/table of contents.
         * @param force Overwrite exiting local storage.
         * @param type Documentation (Doc) or Guides (Guide)
         * @returns A new or the existing index.
         */
        async getIndex(force: boolean, type: string): Promise<Array<DocumentationIndexItem>> {
            // Convert input type to Store State Key
            let convertedType: "docIndex" | "guideIndex" = "docIndex";
            if (type === "Guide") convertedType = "guideIndex";

            if (this[convertedType].length === 0 || force) {
                const data = (await useFetchDocumentationIndex(this.version, this.language, type)).value;
                if (typeof data === "boolean") return this[convertedType];
                if (data.index.length === 0) {
                    this[convertedType] = IndexPlaceholder;
                    return IndexPlaceholder;
                } else {
                    this[convertedType] = data.index;
                    return data.index;
                }
            } else return this[convertedType];
        },
        /**
         * Retrieve the current recommended items.
         * @param force Overwrite exiting local storage.
         * @param type Documentation (Doc) or Guides (Guide)
         * @returns The new or the existing recommended items.
         */
        async getRecommendedItems(force: boolean, type: string): Promise<Array<RecommendedItem>> {
            // Convert input type to Store State Key
            let convertedType: "recommendedDocItems" | "recommendedGuideItems" = "recommendedDocItems";
            if (type === "Guide") convertedType = "recommendedGuideItems";

            if (this[convertedType].length === 0 || force) {
                const data = (await useFetchDocumentationRecommendedItems(this.language, type)).value;
                if (typeof data === "boolean") return this[convertedType];
                if (data.recommendedItems.length === 0) {
                    this[convertedType] = RecommendedPlaceholder;
                    return RecommendedPlaceholder;
                } else {
                    this[convertedType] = data.recommendedItems;
                    return data.recommendedItems;
                }
            } else return this[convertedType];
        },
        /**
         * Check if a string is a valid category item.
         * @param type Documentation (Doc) or Guides (Guide)
         * @param category The name of the folder to validate.
         * @param page The name of the page to validate.
         * @returns If the page is valid or not.
         */
        validatePage(type: string, category: string, page: string | undefined): boolean {
            let convertedType: "docIndex" | "guideIndex" = "docIndex";
            if (type === "Guide") convertedType = "guideIndex";
            const categoryItem: DocumentationIndexItem | null = this[convertedType].filter((indexItem: DocumentationIndexItem) => indexItem.category === category)[0];
            if (!categoryItem) return false;
            if (page) {
                return categoryItem.children.filter(child => child === page).length > 0;
            } else return true;
        },
        /**
         * Reload all store keys.
         * @returns Void, return on error.
         */
        async refresh(): Promise<void> {
            const data = (await useFetchDocumentationRefresh(this.version, this.language)).value
            if (typeof data === "boolean") return;

            if (data.docIndex.length === 0) {
                this.docIndex = IndexPlaceholder;
            } else this.docIndex = data.docIndex;
            if (data.guideIndex.length === 0) {
                this.guideIndex = IndexPlaceholder;
            } else this.guideIndex = data.guideIndex;

            if (data.recommendedDocItems.length === 0) {
                this.recommendedDocItems = RecommendedPlaceholder;
            } else this.recommendedDocItems = data.recommendedDocItems;
            if (data.recommendedGuideItems.length === 0) {
                this.recommendedGuideItems = RecommendedPlaceholder;
            } else this.recommendedGuideItems = data.recommendedGuideItems;
        },
        /**
         * Retrieve all child items of a category.
         * @param type Documentation (Doc) or Guides (Guide)
         * @param categoryName The name of the folder.
         * @returns The list of pages as primitive strings.
         */
        getCategoryList(type: string, categoryName: string): Array<string> {
            let convertedType: "docIndex" | "guideIndex" = "docIndex";
            if (type === "Guide") convertedType = "guideIndex";
            return this[convertedType].filter((indexItem: DocumentationIndexItem) => indexItem.category === categoryName)[0]?.children;
        },
        getCategory(type: string, name: string): DocumentationIndexItem | undefined {
            let convertedType: "docIndex" | "guideIndex" = "docIndex";
            if (type === "Guide") convertedType = "guideIndex";
            return this[convertedType].filter((indexItem: DocumentationIndexItem) => indexItem.category === name)[0];
        }
    }
});