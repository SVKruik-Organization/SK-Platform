import { defineStore } from "pinia";
import { useStorage, useSessionStorage } from "@vueuse/core";
import type { DocumentationIndexItem, RecommendedItem } from "@/assets/customTypes";
import { fetchDocumentationIndex, fetchRecommendedItems } from "@/utils/fetch";

export const useDocumentationStore = defineStore("DocumentationStore", {
    state: () => {
        return {
            docIndex: useSessionStorage("docIndex", [] as Array<DocumentationIndexItem>),
            guideIndex: useSessionStorage("guideIndex", [] as Array<DocumentationIndexItem>),
            recommendedDocItems: useSessionStorage("recommendedDocItems", [] as Array<RecommendedItem>),
            recommendedGuideItems: useSessionStorage("recommendedGuideItems", [] as Array<RecommendedItem>),
            version: useStorage("documentationVersion", "v1" as string),
            language: useStorage("language", "en-US" as string)
        }
    },
    actions: {
        /**
         * Change the documentation version.
         * @param newLanguage The new version to set to.
         * @returns Void, return if invalid.
         */
        setVersion(newVersion: string): void {
            const validVersions: Array<string> = ["v1"];
            if (!validVersions.includes(newVersion)) return;
            this.version = newVersion;
        },
        /**
         * Change the documentation language.
         * @param newLanguage The new language to set to.
         * @returns Void, return if invalid.
         */
        setLanguage(newLanguage: string): void {
            const validLanguages: Array<string> = ["en-US"];
            if (!validLanguages.includes(newLanguage)) return;
            this.language = newLanguage;
        },
        /**
         * Retrieve the index/table of contents.
         * @param force Overwrite exiting local storage.
         * @returns A new or the existing index.
         */
        async getIndex(force: boolean, type: string): Promise<Array<DocumentationIndexItem>> {
            // Convert input type to Store State Key
            let convertedType: "docIndex" | "guideIndex" = "docIndex";
            if (type === "Guide") convertedType = "guideIndex";

            if (this[convertedType].length === 0 || force) {
                const data = await fetchDocumentationIndex(this.version, this.language, type);
                if (typeof data === "boolean") return this[convertedType];
                this[convertedType] = data.index;
                return data.index;
            } else return this[convertedType];
        },
        /**
         * Retrieve the current recommended items.
         * @param force Overwrite exiting local storage.
         * @returns The new or the existing recommended items.
         */
        async getRecommendedItems(force: boolean, type: string): Promise<Array<RecommendedItem>> {
            // Convert input type to Store State Key
            let convertedType: "recommendedDocItems" | "recommendedGuideItems" = "recommendedDocItems";
            if (type === "Guide") convertedType = "recommendedGuideItems";

            if (this[convertedType].length === 0 || force) {
                const data = await fetchRecommendedItems(this.language, type);
                if (typeof data === "boolean") return this[convertedType];
                this[convertedType] = data.recommended_items;
                return data.recommended_items;
            } else return this[convertedType];
        },
        /**
         * Check if a string is a valid folder/category.
         * @param folder The name of the folder to validate.
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
         * @param folder The name of the page to validate.
         * @returns If the page is valid or not.
         */
        validatePage(folder: string | undefined, name: string | undefined, type: string): boolean {
            if (!folder || !name) return false;
            const target = this.validateFolder(folder, type);
            if (!target) return false;
            return 0 < target.children.filter(child => child === name).length;
        }
    }
});