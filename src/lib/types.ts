export type EntryType = "restaurant" | "place" | "activity";

export interface Review {
  id: string;
  rating: number;
  note: string;
  date: string;
}

export interface Entry {
  id: string;
  type: EntryType;
  name: string;
  location: string;
  speciality: string;
  tags: string[];
  reviews: Review[];
  createdAt: string;
}

export type RelationKind =
  | "near"
  | "pairs-well-with"
  | "similar-to"
  | "reminds-me-of"
  | "better-than";

export interface Relation {
  id: string;
  from: string;
  to: string;
  kind: RelationKind;
  note: string;
}

export interface Graph {
  entries: Entry[];
  relations: Relation[];
}

export const ENTRY_TYPES: EntryType[] = ["restaurant", "place", "activity"];

export const RELATION_KINDS: RelationKind[] = [
  "near",
  "pairs-well-with",
  "similar-to",
  "reminds-me-of",
  "better-than",
];

export const RELATION_LABELS: Record<RelationKind, string> = {
  near: "near",
  "pairs-well-with": "pairs well with",
  "similar-to": "similar to",
  "reminds-me-of": "reminds me of",
  "better-than": "better than",
};

export const RELATION_LABELS_REVERSED: Record<RelationKind, string> = {
  near: "near",
  "pairs-well-with": "pairs well with",
  "similar-to": "similar to",
  "reminds-me-of": "reminds me of",
  "better-than": "worse than",
};
