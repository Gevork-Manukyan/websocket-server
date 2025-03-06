import { Player } from "../models";
import { ActiveConGame } from "../models/ConGame";
import { InternalServerError } from "../services/CustomError/BaseError";
import { SpaceOption } from "../types/types";

export type AbilityResult = {
    type: AbilityAction;
    player: Player;
    amount?: number;
    fieldTarget?: {
        team: 'self' | 'enemy';
        position: SpaceOption;
    };
    handTarget?: number;
    discardTarget?: number;
}

export enum AbilityAction {
    COLLECT_GOLD = 'collect_gold',
    DEAL_DAMAGE = 'deal_damage',
    REDUCE_DAMAGE = 'reduce_damage',
    MOVE_TO_DISCARD_FROM_FIELD = 'move_to_discard_from_field',
    MOVE_TO_FIELD_FROM_DISCARD = 'move_to_field_from_discard',
    SWAP_FIELD_POSITION = 'swap_field_position',
    DRAW = 'draw',
    MOVE_TO_HAND_FROM_DISCARD = 'move_to_hand_from_discard',
    MOVE_TO_DISCARD_FROM_HAND = 'move_to_discard_from_hand',
    MOVE_TO_HAND_FROM_FIELD = 'move_to_hand_from_field',
    MOVE_TO_FIELD_FROM_HAND = 'move_to_field_from_hand',
    ADD_SHIELD = 'add_shield',
    ADD_BOOST = 'add_boost',
    DONT_REMOVE_SHIELD = 'dont_remove_shield',
    DONT_REMOVE_BOOST = 'dont_remove_boost',
    REMOVE_ALL_DAMAGE = 'remove_all_damage',
}

export function processAbility(game: ActiveConGame, AbilityResult: AbilityResult) {
    const { type, player, amount, fieldTarget, handTarget, discardTarget } = AbilityResult;
    switch (type) {
        case AbilityAction.COLLECT_GOLD:
            collectGold(player, amount);
            break;
        case AbilityAction.DEAL_DAMAGE:
            dealDamage(game, player, fieldTarget, amount);
            break;
        case AbilityAction.REDUCE_DAMAGE:
            break;
        case AbilityAction.MOVE_TO_DISCARD_FROM_FIELD:
            moveToDiscardFromField(player, fieldTarget);
            break;
        case AbilityAction.MOVE_TO_FIELD_FROM_DISCARD:
            moveToFieldFromDiscard(player, fieldTarget, discardTarget);
            break;
        case AbilityAction.SWAP_FIELD_POSITION:
            break;
        case AbilityAction.DRAW:
            break;
        case AbilityAction.MOVE_TO_HAND_FROM_DISCARD:
            break;
        case AbilityAction.MOVE_TO_DISCARD_FROM_HAND:
            break;
        case AbilityAction.MOVE_TO_HAND_FROM_FIELD:
            break;
        case AbilityAction.MOVE_TO_FIELD_FROM_HAND:
            break;
        case AbilityAction.ADD_SHIELD:
            break;
        case AbilityAction.ADD_BOOST:
            break;
        case AbilityAction.DONT_REMOVE_SHIELD:
            break;
        case AbilityAction.DONT_REMOVE_BOOST:
            break;
        case AbilityAction.REMOVE_ALL_DAMAGE:
            break;
    }
}

/**
 * Collects gold for a team
 * @param player The team to collect gold for
 * @param amount The amount of gold to collect 
 */
function collectGold(player: AbilityResult['player'], amount: AbilityResult['amount']) {
    if (amount === undefined) throw new InternalServerError("Amount of gold to collect is not defined");
    player.getTeam()!.addGold(amount);
}

/**
 * Deals damage to a card on the battlefield
 * @param game The current game
 * @param player The team that is dealing damage
 * @param fieldTarget The target on the battlefield to deal damage to
 * @param amount The amount of damage to deal 
 */
function dealDamage(game: ActiveConGame, player: AbilityResult['player'], fieldTarget: AbilityResult['fieldTarget'], amount: AbilityResult['amount']) {
    if (fieldTarget === undefined) throw new InternalServerError("Field target is not defined");
    if (amount === undefined) throw new InternalServerError("Amount of damage to deal is not defined");

    const playerTeam = player.getTeam()!;
    const targetTeam = fieldTarget.team === 'self' ? playerTeam : game.getOpposingTeam(playerTeam);
    targetTeam.damageCardAtPosition(fieldTarget.position, amount);
}

function reduceDamage() {

}

/**
 * Moves a card from the battlefield to the discard pile
 * @param player The player that is moving the card
 * @param fieldTarget The target on the battlefield to move to the discard pile
 */
function moveToDiscardFromField(player: AbilityResult['player'], fieldTarget: AbilityResult['fieldTarget']) {
    if (fieldTarget === undefined) throw new InternalServerError("Field target is not defined");
    if (fieldTarget.team === 'enemy') throw new InternalServerError("Cannot move enemy card to discard");

    const removedCard = player.getTeam()!.battlefield.removeCard(fieldTarget.position);
    player.addCardToDiscardPile(removedCard);
}

function moveToFieldFromDiscard() {

}

function swapFieldPosition() {

}

function draw() {

}

function moveToHandFromDiscard() {

}

function moveToDiscardFromHand() {

}

function moveToHandFromField() {

}

function moveToFieldFromHand() {

}

function addShield() {

}

function addBoost() {

}

function dontRemoveShield() {

}

function dontRemoveBoost() {

}

function removeAllDamage() {

}

enum PlayerActionType {
    CARD_ENTERS_FIELD = 'card_enters_field',
    CARD_LEAVES_FIELD = 'card_leaves_field',
    ATTACK = 'attack',
    MELEE_ATTACK = 'melee_attack',
    RANGE_ATTACK = 'range_attack',
    IS_ATTACKED = 'is_attacked',
    IS_MELEE_ATTACKED = 'is_melee_attacked',
    IS_RANGE_ATTACKED = 'is_range_attacked',
    DEAL_DAMAGE_WITH_ATTACK = 'deal_damage_with_attack',
    TAKE_DAMAGE = 'take_damage',
    ENTER_ROW = 'enter_row',
    DEFEAT_ENEMY = 'defeat_enemy',
    IS_DEFEATED = 'is_defeated',
    ADD_SHIELD = 'add_shield',
    ADD_BOOST = 'add_boost',
    REMOVE_SHIELD = 'remove_shield',
    REMOVE_BOOST = 'remove_boost',
}

/*
// TODO: New idea: this enum will live somewhere else. Card abilities will return an object 
with keys and values that determine what kind of action needs to be done
e.g. { type: ActionType.COLLECT_GOLD, amount: 10 }

Then a processAbility function will take in the action object and perform the action

For instants, there will be a flag on each player that indicates if they have an instant in their hand
If they do, then before processing action, prompt player if they wanna use instant card

For triggers, each action a player does will have a value in an enum
When a card enters the field, get all of it's triggers and add them to a list. Triggers are values from the same actions enum
When an action is done, check if any triggers are activated 
*/