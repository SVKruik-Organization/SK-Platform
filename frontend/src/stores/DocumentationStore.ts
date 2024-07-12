import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import type { DocumentationIndexItem } from "@/assets/customTypes";
import { fetchDocumentationIndex } from "@/utils/fetch";

export const useDocumentationStore = defineStore("DocumentationStore", {
    state: () => {
        return {
            index: useStorage("index", [] as Array<DocumentationIndexItem>),
            version: useStorage("version", "v1" as string),
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
            const validVersions: Array<string> = ["v1", "v2"];
            if (validVersions.includes(newVersion)) return;
            this.version = newVersion;
        },
        /**
         * Change the documentation language.
         * @param newLanguage The new language to set to.
         * @returns Void, return if invalid.
         */
        setLanguage(newLanguage: string): void {
            const validLanguages: Array<string> = ["nl-NL", "en-US"];
            if (!validLanguages.includes(newLanguage)) return;
            this.language = newLanguage;
        },
        /**
         * Retrieve the index/table of contents.
         * @param force Overwrite exiting local storage.
         * @returns A new or the existing index.
         */
        async getIndex(force: boolean): Promise<Array<DocumentationIndexItem>> {
            if (this.index.length === 0 || force) {
                const data = await fetchDocumentationIndex(this.version, this.language);
                if (typeof data === "boolean") return this.index;
                this.index = data.index;
                return data.index;
            } else return this.index;
        },
        /**
         * Check if a string is a valid folder/category.
         * @param folder The name of the folder to validate.
         * @returns The folder object from local storage or undefined if not found.
         */
        validateFolder(folder: string | undefined): DocumentationIndexItem | undefined {
            if (!folder) return;
            return this.index.filter(indexItem => indexItem.category === folder)[0];
        },
        /**
         * Check if a string is a valid category item.
         * @param folder The name of the page to validate.
         * @returns If the page is valid or not.
         */
        validatePage(folder: string | undefined, name: string | undefined): boolean {
            if (!folder || !name) return false;
            const target = this.validateFolder(folder);
            if (!target) return false;
            return 0 < target.children.filter(child => child === name).length;
        }
    }
});