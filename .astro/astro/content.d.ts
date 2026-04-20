declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"projects": {
"bureaumeubel-turnhout-BK.md": {
	id: "bureaumeubel-turnhout-BK.md";
  slug: "bureaumeubel-turnhout-bk";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"keuken-borgerhout-AJ.md": {
	id: "keuken-borgerhout-AJ.md";
  slug: "keuken-borgerhout-aj";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"keuken-gent-FM.md": {
	id: "keuken-gent-FM.md";
  slug: "keuken-gent-fm";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"keuken-gent-TK.md": {
	id: "keuken-gent-TK.md";
  slug: "keuken-gent-tk";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"keuken-hove-CA.md": {
	id: "keuken-hove-CA.md";
  slug: "keuken-hove-ca";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"keuken-koersel-YB.md": {
	id: "keuken-koersel-YB.md";
  slug: "keuken-koersel-yb";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"keuken-mechelen-PM.md": {
	id: "keuken-mechelen-PM.md";
  slug: "keuken-mechelen-pm";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"keuken-mechelen-TK.md": {
	id: "keuken-mechelen-TK.md";
  slug: "keuken-mechelen-tk";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"keuken-nieuwpoort-TS.md": {
	id: "keuken-nieuwpoort-TS.md";
  slug: "keuken-nieuwpoort-ts";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"keuken-oostende-WA.md": {
	id: "keuken-oostende-WA.md";
  slug: "keuken-oostende-wa";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"keuken-sint-amandsberg-GD.md": {
	id: "keuken-sint-amandsberg-GD.md";
  slug: "keuken-sint-amandsberg-gd";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"keuken-zaventem-WA.md": {
	id: "keuken-zaventem-WA.md";
  slug: "keuken-zaventem-wa";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"room-divider-dendermonde-BJ.md": {
	id: "room-divider-dendermonde-BJ.md";
  slug: "room-divider-dendermonde-bj";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"zitmeubel-lichtaart-MD.md": {
	id: "zitmeubel-lichtaart-MD.md";
  slug: "zitmeubel-lichtaart-md";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
