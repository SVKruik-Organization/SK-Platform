import { defineStore } from "pinia";
import { IndexPlaceholder, RecommendedPlaceholder, type DocumentationIndexItem, type RecommendedItem } from "@/assets/customTypes";
import { fetchDocumentationIndex, fetchDocumentationRefresh, fetchRecommendedItems } from "@/utils/fetch";

export const useDocumentationStore = defineStore("documentationStore", {
    state: () => ({
        docIndex: [] as Array<DocumentationIndexItem>,
        guideIndex: [] as Array<DocumentationIndexItem>,
        recommendedDocItems: [] as Array<RecommendedItem>,
        recommendedGuideItems: [] as Array<RecommendedItem>,
        version: "v1" as string,
        language: "en-US" as string,
        voteCast: "" as string
    }),
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
                const data = await fetchDocumentationIndex(this.version, this.language, type);
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
                const data = await fetchRecommendedItems(this.language, type);
                if (typeof data === "boolean") return this[convertedType];
                if (data.recommended_items.length === 0) {
                    this[convertedType] = RecommendedPlaceholder;
                    return RecommendedPlaceholder;
                } else {
                    this[convertedType] = data.recommended_items;
                    return data.recommended_items;
                }
            } else return this[convertedType];
        },
        /**
         * Check if a string is a valid folder/category.
         * @param folder The name of the folder to validate.
         * @param type Documentation (Doc) or Guides (Guide)
         * @returns The folder object from local storage or undefined if not found.
         */
        validateFolder(folder: string | undefined, type: string): DocumentationIndexItem | undefined {
            // Convert input type to Store State Key
            let convertedType: "docIndex" | "guideIndex" = "docIndex";
            if (type === "Guide") convertedType = "guideIndex";

            if (!folder) return;
            return this[convertedType].filter(indexItem => indexItem.category === folder)[0];
        },
        /**
         * Check if a string is a valid category item.
         * @param folder The name of the folder to validate.
         * @param name The name of the page to validate.
         * @param type Documentation (Doc) or Guides (Guide)
         * @returns If the page is valid or not.
         */
        validatePage(folder: string | undefined, name: string | undefined, type: string): boolean {
            if (!folder || !name) return false;
            const target = this.validateFolder(folder, type);
            if (!target) return false;
            return 0 < target.children.filter(child => child === name).length;
        },
        /**
         * Reload all store keys.
         * @returns Void, return on error.
         */
        async refresh(): Promise<void> {
            const data = await fetchDocumentationRefresh(this.version, this.language);
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
            return this[convertedType].filter(indexItem => indexItem.category === categoryName)[0]?.children;
        }
    }
});