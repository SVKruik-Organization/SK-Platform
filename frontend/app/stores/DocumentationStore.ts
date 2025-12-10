import { defineStore } from "pinia";
import { IndexPlaceholder, FeaturedPlaceholder, ToastTypes, type DocumentationIndexItem, type DocumentationRefreshResponse, type FeaturedItem, type ToastItem } from "@/assets/customTypes";
import { themeData, themeMeta } from "@/assets/config/theme";
import { createTicket } from "@svkruik/sk-platform-formatters";
import { useFetchDocumentationRefresh } from "@/utils/fetch/documentation/useFetchDocumentationRefresh";
import { useFetchDocumentationFeaturedItems } from "~/utils/fetch/documentation/useFetchDocumentationFeaturedItems";
import { useFetchDocumentationIndex } from "@/utils/fetch/documentation/useFetchDocumentationIndex";

const defaultVersion: string = "v1";
const defaultLanguage: string = "en-US";
const defaultTheme: string = "Cobalt";

export const useDocumentationStore = defineStore("documentationStore", {
    state: () => {
        return {
            docIndex: [] as Array<DocumentationIndexItem>,
            guideIndex: [] as Array<DocumentationIndexItem>,
            featuredDocItems: [] as Array<FeaturedItem>,
            featuredGuideItems: [] as Array<FeaturedItem>,
            version: defaultVersion,
            language: defaultLanguage,
            theme: defaultTheme,
            voteCast: "",
            commentCast: ""
        };
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
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
        async getIndex(force: boolean, type: string): Promise<Array<DocumentationIndexItem>> {
            try {
                // Convert input type to Store State Key
                let convertedType: "docIndex" | "guideIndex" = "docIndex";
                if (type === "Guide") convertedType = "guideIndex";

                if (this[convertedType].length === 0 || force) {
                    const data: Array<DocumentationIndexItem> = await useFetchDocumentationIndex(this.version, this.language, type);

                    if (data.length === 0) {
                        return this[convertedType] = IndexPlaceholder;
                    } else return this[convertedType] = data;
                } else return this[convertedType];
            } catch (error: any) {
                const { $event } = useNuxtApp();
                $event("emit-toast", {
                    "id": createTicket(),
                    "type": ToastTypes.danger,
                    "message": error.message,
                    "duration": 3
                } as ToastItem);
                return [];
            }
        },
        /**
         * Retrieve the current featured items.
         * @param force Overwrite exiting local storage.
         * @param type Documentation (Doc) or Guides (Guide)
         * @returns The new or the existing featured items.
         */
        async getFeaturedItems(force: boolean, type: string): Promise<Array<FeaturedItem>> {
            try {
                // Convert input type to Store State Key
                let convertedType: "featuredDocItems" | "featuredGuideItems" = "featuredDocItems";
                if (type === "Guide") convertedType = "featuredGuideItems";

                if (this[convertedType].length === 0 || force) {
                    const data: Array<FeaturedItem> = await useFetchDocumentationFeaturedItems(this.language, type);

                    if (data.length === 0) {
                        return this[convertedType] = FeaturedPlaceholder;
                    } else return this[convertedType] = data;
                } else return this[convertedType];
            } catch (error: any) {
                const { $event } = useNuxtApp();
                $event("emit-toast", {
                    "id": createTicket(),
                    "type": ToastTypes.danger,
                    "message": error.message,
                    "duration": 3
                } as ToastItem);
                return [];
            }
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
            const categoryItem: DocumentationIndexItem | null = this[convertedType].filter((indexItem: DocumentationIndexItem) => indexItem.category === category)[0] || null;
            if (!categoryItem) return false;
            if (page) {
                return categoryItem.children.filter(child => child === page).length > 0;
            } else return true;
        },
        /**
         * Reload all store keys.
         * @param background If this is a background refresh. If so, don't show a toast.
         * @returns Void, return on error.
         */
        async refresh(background: boolean = false): Promise<void> {
            const { $event } = useNuxtApp();

            try {
                const data: DocumentationRefreshResponse = await useFetchDocumentationRefresh(this.version, this.language);

                if (!background) {
                    $event("emit-toast", {
                        "id": createTicket(),
                        "type": ToastTypes.success,
                        "message": "Refreshed indices and featured pages.",
                        "duration": 3
                    } as ToastItem);
                }

                if (data.docIndex.length === 0) {
                    this.docIndex = IndexPlaceholder;
                } else this.docIndex = data.docIndex;
                if (data.guideIndex.length === 0) {
                    this.guideIndex = IndexPlaceholder;
                } else this.guideIndex = data.guideIndex;

                if (data.featuredDocItems.length === 0) {
                    this.featuredDocItems = FeaturedPlaceholder;
                } else this.featuredDocItems = data.featuredDocItems;
                if (data.featuredGuideItems.length === 0) {
                    this.featuredGuideItems = FeaturedPlaceholder;
                } else this.featuredGuideItems = data.featuredGuideItems;
            } catch (error: any) {
                $event("emit-toast", {
                    "id": createTicket(),
                    "type": ToastTypes.danger,
                    "message": error.message,
                    "duration": 3
                } as ToastItem);
            }
        },
        /**
         * Retrieve all child items of a category.
         * @param type Documentation (Doc) or Guides (Guide)
         * @param categoryName The name of the folder.
         * @returns The list of pages as primitive strings.
         */
        async getCategoryList(type: string, categoryName: string): Promise<Array<string>> {
            if (!this.docIndex.length || !this.guideIndex.length) await this.refresh(true);

            let convertedType: "docIndex" | "guideIndex" = "docIndex";
            if (type === "Guide") convertedType = "guideIndex";
            return this[convertedType].filter((indexItem: DocumentationIndexItem) => indexItem.category === categoryName)[0]?.children || [];
        },
        /**
         * Retrieve a category item by name.
         * @param type Documentation (Doc) or Guides (Guide)
         * @param name The name of the category to get.
         * @returns The category item.
         */
        async getCategory(type: string, name: string): Promise<DocumentationIndexItem | undefined> {
            if (!this.docIndex.length || !this.guideIndex.length) await this.refresh(true);

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
        async hasPreviousPage(type: string, category: string, page: string | undefined): Promise<boolean> {
            if (!this.docIndex.length || !this.guideIndex.length) await this.refresh(true);

            let convertedType: "docIndex" | "guideIndex" = "docIndex";
            if (type === "Guide") convertedType = "guideIndex";
            const categoryItem: DocumentationIndexItem | null = this[convertedType].filter((indexItem: DocumentationIndexItem) => indexItem.category === category)[0] || null;
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
        async hasNextPage(type: string, category: string, page: string | undefined): Promise<boolean> {
            if (!this.docIndex.length || !this.guideIndex.length) await this.refresh(true);

            let convertedType: "docIndex" | "guideIndex" = "docIndex";
            if (type === "Guide") convertedType = "guideIndex";
            const categoryItem: DocumentationIndexItem | null = this[convertedType].filter((indexItem: DocumentationIndexItem) => indexItem.category === category)[0] || null;
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