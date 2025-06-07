declare module "obsidian" {
    export class Plugin {
        app: App;
        manifest: any;
        loadData(): Promise<any>;
        saveData(data: any): Promise<void>;
        addCommand(command: Command): void;
        registerMarkdownPostProcessor(processor: (el: HTMLElement, ctx: MarkdownPostProcessorContext) => void | Promise<void>): void;
        addSettingTab(tab: PluginSettingTab): void;
        registerEvent(event: EventRef): void;
    }

    export interface App {
        workspace: Workspace;
        vault: Vault;
        plugins: {
            plugins: {
                [key: string]: any;
            };
            enablePlugin(id: string): Promise<void>;
            disablePlugin(id: string): Promise<void>;
            getPlugin(id: string): any;
        };
    }

    export interface Vault {
        adapter: {
            exists(path: string): Promise<boolean>;
            write(path: string, data: string): Promise<void>;
            mkdir(path: string): Promise<void>;
        };
        createFolder(path: string): Promise<void>;
        create(path: string, data: string): Promise<TFile>;
        getAbstractFileByPath(path: string): TAbstractFile | null;
        modify(file: TFile, data: string): Promise<void>;
    }

    export interface Command {
        id: string;
        name: string;
        checkCallback?(checking: boolean): boolean | void;
        callback?(): void;
        editorCallback?(editor: Editor, view?: MarkdownView): void;
    }

    export class Workspace {
        getActiveViewOfType<T extends View>(type: any): T | null;
        on(name: string, callback: (...args: any[]) => any): EventRef;
        openLinkText(linkText: string, sourcePath: string, newLeaf?: boolean): void;
    }

    export interface Editor {
        getSelection(): string;
        getValue(): string;
        setValue(value: string): void;
        replaceSelection(replacement: string): void;
    }

    export class MarkdownView extends View {
        editor: Editor;
        file?: TFile;
    }

    export abstract class View {
        editor?: Editor;
        file?: TFile;
    }

    export class PluginSettingTab {
        app: App;
        containerEl: HTMLElement;
        constructor(app: App, plugin: Plugin);
        display(): void;
    }

    export interface MenuItem {
        setTitle(title: string): this;
        setIcon(icon: string): this;
        onClick(callback: () => any): this;
    }

    export interface Menu {
        addItem(cb: (item: MenuItem) => any): this;
    }

    export interface DropdownComponent {
        setValue(value: string): this;
        getValue(): string;
        onChange(callback: (value: string) => any): this;
        addOption(value: string, display: string): this;
    }

    export interface ToggleComponent {
        setValue(value: boolean): this;
        getValue(): boolean;
        onChange(callback: (value: boolean) => any): this;
    }

    export interface TextComponent {
        setValue(value: string): this;
        getValue(): string;
        onChange(callback: (value: string) => any): this;
        setPlaceholder(placeholder: string): this;
    }

    export class Setting {
        constructor(containerEl: HTMLElement);
        setName(name: string): this;
        setDesc(desc: string): this;
        addToggle(cb: (component: ToggleComponent) => any): this;
        addDropdown(cb: (component: DropdownComponent) => any): this;
        addText(cb: (component: TextComponent) => any): this;
    }

    export interface EventRef {}

    export interface MarkdownPostProcessorContext {
        sourcePath: string;
    }

    export class Notice {
        constructor(message: string, timeout?: number);
    }

    export interface MermaidToExcalidrawSettings {
        autoConvert: boolean;
        defaultTheme?: 'light' | 'dark';
        preserveAspectRatio?: boolean;
        convertOnSave?: boolean;
    }

    export interface TAbstractFile {
        path: string;
        name: string;
        vault: Vault;
    }

    export class TFile implements TAbstractFile {
        path: string;
        name: string;
        basename: string;
        extension: string;
        vault: Vault;
        stat: {
            mtime: number;
            ctime: number;
            size: number;
        };
    }

    export class Modal {
        app: App;
        contentEl: HTMLElement;

        constructor(app: App);
        open(): void;
        close(): void;
        onOpen(): void;
        onClose(): void;
    }

    export interface HTMLElement {
        createEl<K extends keyof HTMLElementTagNameMap>(tag: K, attrs?: { text?: string, cls?: string }): HTMLElementTagNameMap[K];
        createDiv(attrs?: { text?: string, cls?: string }): HTMLDivElement;
        empty(): void;
        addClass(cls: string): void;
        removeClass(cls: string): void;
        setText(text: string): void;
    }
}
