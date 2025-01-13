import { defineStore } from "pinia";
import { useSessionStorage, useLocalStorage } from "@vueuse/core";
import { IndexPlaceholder, RecommendedPlaceholder, type DocumentationIndexItem, type DocumentationIndexResponse, type DocumentationRecommendedItemsResponse, type DocumentationRefreshResponse, type RecommendedItem, type ToastItem } from "@/assets/customTypes";
import { themeData, themeMeta } from "~/assets/config/theme";

const defaultVersion: string = "v1";
const defaultLanguage: string = "en-US";
const defaultTheme: string = "Cobalt";

export const useDocumentationStore = defineStore("documentationStore", {
    state: () => ({
        docIndex: useSessionStorage("docIndex", [] as Array<DocumentationIndexItem>),
        guideIndex: useSessionStorage("guideIndex", [] as Array<DocumentationIndexItem>),
        recommendedDocItems: useLocalStorage("recommendedDocItems", [] as Array<RecommendedItem>),
        recommendedGuideItems: useLocalStorage("recommendedGuideItems", [] as Array<RecommendedItem>),
        version: useLocalStorage("documentationVersion", defaultVersion),
        language: useLocalStorage("language", defaultLanguage),
        theme: useLocalStorage("theme", defaultTheme),
        voteCast: useSessionStorage("voteCast", ""),
        commentCast: useSessionStorage("commentCast", "")
    }),
    hydrate(state) {
        state.docIndex = useSessionStorage("docIndex", []);
        state.guideIndex = useSessionStorage("guideIndex", []);
        state.recommendedDocItems = useLocalStorage("recommendedDocItems", []);
        state.recommendedGuideItems = useLocalStorage("recommendedGuideItems", []);
        state.version = useLocalStorage("documentationVersion", defaultVersion);
        state.language = useLocalStorage("language", defaultLanguage);
        state.theme = useLocalStorage("theme", defaultTheme);
        state.voteCast = useSessionStorage("voteCast", "");
        state.commentCast = useSessionStorage("commentCast", "");
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
         * Change the documentation theme.
         * @param newTheme The new theme to set to. If null, set to current.
         * @returns Void, return if invalid.
         */
        setTheme(newTheme: string | null): void {
            if (newTheme) {
                if (newTheme === this.theme) return;
                if (!themeData.themes.includes(newTheme)) return;
                document.documentElement.className = newTheme.toLowerCase();
                this.theme = newTheme;
            } else document.documentElement.className = this.theme.toLowerCase();

            // Theme Meta Tag
            const themeMetaTag = document.querySelector("meta[name='theme-color']");
            if (themeMetaTag) {
                themeMetaTag.setAttribute("content", themeMeta[this.theme.toUpperCase() as keyof typeof themeMeta] || themeMeta.DEFAULT);
            } else {
                const newThemeColor = document.createElement("meta");
                newThemeColor.setAttribute("name", "theme-color");
                newThemeColor.setAttribute("content", themeMeta[this.theme.toUpperCase() as keyof typeof themeMeta] || themeMeta.DEFAULT);
                document.head.appendChild(newThemeColor);
            }

            // Color Schema Meta Tag
            const colorSchemaMetaTag = document.querySelector("meta[name='color-scheme']");
            if (colorSchemaMetaTag) {
                colorSchemaMetaTag.setAttribute("content", themeData.lightThemes.includes(this.theme) ? "light" : "dark");
            } else {
                const newColorSchema = document.createElement("meta");
                newColorSchema.setAttribute("name", "color-scheme");
                newColorSchema.setAttribute("content", themeData.lightThemes.includes(this.theme) ? "light" : "dark");
                document.head.appendChild(newColorSchema);
            }
        },
        /**
         * Retrieve the index/table of contents.
         * @param force Overwrite exiting local storage.
         * @param type Documentation (Doc) or Guides (Guide)
         * @returns A new or the existing index.
         */
        async getIndex(force: boolean, type: string): Promise<string | Array<DocumentationIndexItem>> {
            // Convert input type to Store State Key
            let convertedType: "docIndex" | "guideIndex" = "docIndex";
            if (type === "Guide") convertedType = "guideIndex";

            if (this[convertedType].length === 0 || force) {
                const data: string | DocumentationIndexResponse = await useFetchDocumentationIndex(this.version, this.language, type);
                if (typeof data === "string") return data;

                if (data.index.length === 0) {
                    return this[convertedType] = IndexPlaceholder;
                } else return this[convertedType] = data.index;
            } else return this[convertedType];
        },
        /**
         * Retrieve the current recommended items.
         * @param force Overwrite exiting local storage.
         * @param type Documentation (Doc) or Guides (Guide)
         * @returns The new or the existing recommended items.
         */
        async getRecommendedItems(force: boolean, type: string): Promise<string | Array<RecommendedItem>> {
            // Convert input type to Store State Key
            let convertedType: "recommendedDocItems" | "recommendedGuideItems" = "recommendedDocItems";
            if (type === "Guide") convertedType = "recommendedGuideItems";

            if (this[convertedType].length === 0 || force) {
                const data: string | DocumentationRecommendedItemsResponse = await useFetchDocumentationRecommendedItems(this.language, type);
                if (typeof data === "string") return data;

                if (data.recommendedItems.length === 0) {
                    return this[convertedType] = RecommendedPlaceholder;
                } else return this[convertedType] = data.recommendedItems;
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
            const data: string | DocumentationRefreshResponse = await useFetchDocumentationRefresh(this.version, this.language);
            const { $event } = useNuxtApp();

            if (typeof data === "string") return $event("emit-toast", {
                "id": createTicket(),
                "type": "error",
                "message": data,
                "duration": 3
            } as ToastItem);

            $event("emit-toast", {
                "id": createTicket(),
                "type": "success",
                "message": "Refreshed indices and recommended pages.",
                "duration": 3
            } as ToastItem);

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
        /**
         * Retrieve a category item by name.
         * @param type Documentation (Doc) or Guides (Guide)
         * @param name The name of the category to get.
         * @returns The category item.
         */
        getCategory(type: string, name: string): DocumentationIndexItem | undefined {
            let convertedType: "docIndex" | "guideIndex" = "docIndex";
            if (type === "Guide") convertedType = "guideIndex";
            return this[convertedType].filter((indexItem: DocumentationIndexItem) => indexItem.category === name)[0];
        },
        /**
         * Check if a page has a previous page.
         * @param type Documentation (Doc) or Guides (Guide)
         * @param category The name of the folder to validate.
         * @param page The name of the page to validate.
         * @returns If this page has a previous page.
         */
        hasPreviousPage(type: string, category: string, page: string | undefined): boolean {
            let convertedType: "docIndex" | "guideIndex" = "docIndex";
            if (type === "Guide") convertedType = "guideIndex";
            const categoryItem: DocumentationIndexItem | null = this[convertedType].filter((indexItem: DocumentationIndexItem) => indexItem.category === category)[0];
            if (!categoryItem) return false;

            if (!page) {
                return false;
            } else {
                const pageIndex = categoryItem.children.indexOf(page);
                return pageIndex > 0 || !!page;
            }
        },
        /**
         * Check if a page has a next page.
         * @param type Documentation (Doc) or Guides (Guide)
         * @param category The name of the folder to validate.
         * @param page The name of the page to validate.
         * @returns If this page has a next page.
         */
        hasNextPage(type: string, category: string, page: string | undefined): boolean {
            let convertedType: "docIndex" | "guideIndex" = "docIndex";
            if (type === "Guide") convertedType = "guideIndex";
            const categoryItem: DocumentationIndexItem | null = this[convertedType].filter((indexItem: DocumentationIndexItem) => indexItem.category === category)[0];
            if (!categoryItem) return false;

            if (!page) {
                return !!categoryItem.children.length;
            } else {
                const pageIndex = categoryItem.children.indexOf(page);
                return pageIndex < categoryItem.children.length - 1;
            }
        }
    }
});