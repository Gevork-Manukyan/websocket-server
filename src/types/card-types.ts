/*import { Element, Sage } from "./types";

export type Card = {
  name: string;
  price: number;
  img: string;
};

export type StarterCard = {
    price: 1;
}

export type AbilityCard = {
  ability: undefined;
  rowRequirement: (1 | 2 | 3)[];
}

export type ElementalCard = Card & {
  element: Element;
  attack: number;
  health: number;
};

export type ElementalStarterCard = ElementalCard & StarterCard;

export type ElementalWarriorCard = ElementalCard & AbilityCard;

export type ElementalWarriorStarterCard = ElementalWarriorCard & StarterCard;

export type ElementalChampion = ElementalWarriorCard & StarterCard & {
  levelRequirement: 4 | 6 | 8;
};

export type ElementalSage = ElementalCard &
  ElementalWarriorCard & StarterCard & {
    sage: Sage;
  };

export type ItemCard = Card & Omit<AbilityCard, "rowRequirement">;

export type AttackCard = Card & AbilityCard;

export type AttackStarterCard = AttackCard & StarterCard;

export type UtilityCard = ItemCard;

export type InstantCard = ItemCard;

export type InstantStarterCard = InstantCard & StarterCard;
*/

import { z } from "zod";
import { ElementSchema, SageSchema } from "./types";

export const CardSchema = z.object({
  name: z.string(),
  price: z.number(),
  img: z.string(),
});

export const StarterCardSchema = z.object({
  price: z.literal(1),
});

export const AbilityCardSchema = z.object({
  ability: z.undefined(),
  rowRequirement: z.array(z.union([z.literal(1), z.literal(2), z.literal(3)])),
});

export const ElementalCardSchema = CardSchema.extend({
  element: ElementSchema,
  attack: z.number(),
  health: z.number(),
});

export const ElementalStarterCardSchema = ElementalCardSchema.extend({
  price: z.literal(1),
});

export const ElementalWarriorCardSchema = ElementalCardSchema.merge(AbilityCardSchema)
  .extend({
    isDayBreak: z.boolean(),
  });

export const ElementalWarriorStarterCardSchema = ElementalWarriorCardSchema.extend({
  price: z.literal(1),
});

export const ElementalChampionSchema = ElementalWarriorCardSchema.extend({
  price: z.literal(1),
  levelRequirement: z.union([z.literal(4), z.literal(6), z.literal(8)]),
});

export const ElementalSageSchema = ElementalCardSchema.merge(ElementalWarriorCardSchema)
  .extend({
    price: z.literal(1),
    sage: SageSchema,
  });

export const ItemCardSchema = CardSchema.merge(AbilityCardSchema.omit({ rowRequirement: true }));
  
export const AttackCardSchema = CardSchema.merge(AbilityCardSchema);

export const AttackStarterCardSchema = AttackCardSchema.extend({
  price: z.literal(1),
});

export const UtilityCardSchema = ItemCardSchema;

export const InstantCardSchema = ItemCardSchema;

export const InstantStarterCardSchema = InstantCardSchema.extend({
  price: z.literal(1),
});


export type Card = z.infer<typeof CardSchema>;
export type StarterCard = z.infer<typeof StarterCardSchema>;
export type AbilityCard = z.infer<typeof AbilityCardSchema>;
export type ElementalCard = z.infer<typeof ElementalCardSchema>;
export type ElementalStarterCard = z.infer<typeof ElementalStarterCardSchema>;
export type ElementalWarriorCard = z.infer<typeof ElementalWarriorCardSchema>;
export type ElementalWarriorStarterCard = z.infer<typeof ElementalWarriorStarterCardSchema>;
export type ElementalChampion = z.infer<typeof ElementalChampionSchema>;
export type ElementalSage = z.infer<typeof ElementalSageSchema>;
export type ItemCard = z.infer<typeof ItemCardSchema>;
export type AttackCard = z.infer<typeof AttackCardSchema>;
export type AttackStarterCard = z.infer<typeof AttackStarterCardSchema>;
export type UtilityCard = z.infer<typeof UtilityCardSchema>;
export type InstantCard = z.infer<typeof InstantCardSchema>;
export type InstantStarterCard = z.infer<typeof InstantStarterCardSchema>;
