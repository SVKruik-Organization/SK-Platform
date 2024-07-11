import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import type { DocumentationIndexItem } from "@/assets/customTypes";
import { fetchDocumentationIndex } from "@/utils/fetch";

export const useDocumentationStore = defineStore("DocumentationStore", {
    state: () => {
        return {
            index: useStorage("index", [] as Array<DocumentationIndexItem>)
        }
    },
    actions: {
        async getIndex(version: string, language: string): Promise<Array<DocumentationIndexItem>> {
            if (this.index.length === 0) {
                const data = await fetchDocumentationIndex(version, language);
                if (typeof data === "boolean") return this.index;
                this.index = data.index;
                return data.index;
            } else return this.index;
        },
        setIndex(data: Array<DocumentationIndexItem>): void {
            this.index = data;
        },
        validateFolder(folder: string | undefined): DocumentationIndexItem | undefined {
            if (!folder) return;
            return this.index.filter(indexItem => indexItem.category === folder)[0];
        },
        validatePage(folder: string | undefined, name: string | undefined): boolean {
            if (!folder || !name) return false;
            const target = this.validateFolder(folder);
            if (!target) return false;
            return 0 < target.children.filter(child => child === name).length;
        }
    }
});