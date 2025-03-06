import { isElementalCard } from "../lib/card-validators";
import { Player } from "../models";
import { ActiveConGame } from "../models/ConGame";
import { InternalServerError } from "../services/CustomError/BaseError";
import { InvalidCardTypeError } from "../services/CustomError/GameError";
import { SpaceOption } from "../types/types";

export type AbilityResult = {
    type: AbilityAction;
    player: Player;
    amount?: number;
    fieldTarget?: {
        team: 'self' | 'enemy';
        position: SpaceOption[];
    };
    handTarget?: number[];
    discardTarget?: number[];
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
            swapFieldPosition(player, fieldTarget);
            break;
        case AbilityAction.DRAW:
            draw(player, amount);
            break;
        case AbilityAction.MOVE_TO_HAND_FROM_DISCARD:
            moveToHandFromDiscard(player, discardTarget);
            break;
        case AbilityAction.MOVE_TO_DISCARD_FROM_HAND:
            moveToDiscardFromHand(player, handTarget);
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
    fieldTarget.position.forEach(position => {
        targetTeam.damageCardAtPosition(position, amount);
    });
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
    if (fieldTarget.position.length !== 1) throw new InternalServerError("Field target position is not a single position");
    if (fieldTarget.team === 'enemy') throw new InternalServerError("Cannot move enemy card to discard");

    const removedCard = player.getTeam()!.getBattlefield().removeCard(fieldTarget.position[0]);
    player.addCardToDiscardPile(removedCard);
}

/**
 * Moves a card from the discard pile to the battlefield
 * @param player The player that is moving the card
 * @param fieldTarget The target on the battlefield to move to
 * @param discardTarget The target in the discard pile to move from
 */
function moveToFieldFromDiscard(player: AbilityResult['player'], fieldTarget: AbilityResult['fieldTarget'], discardTarget: AbilityResult['discardTarget']) {
    if (fieldTarget === undefined) throw new InternalServerError("Field target is not defined");
    if (fieldTarget.position.length !== 1) throw new InternalServerError("Field target position is not a single position");
    if (discardTarget === undefined) throw new InternalServerError("Discard target is not defined");
    if (discardTarget.length !== 1) throw new InternalServerError("Discard target position is not a single position");
    if (fieldTarget.team === 'enemy') throw new InternalServerError("Cannot move enemy card to field");

    const removedCard = player.removeCardFromDiscardPile(discardTarget[0]);
    if (!isElementalCard(removedCard)) throw new InvalidCardTypeError("Card is not an ElementalCard");

    player.getTeam()!.getBattlefield().addCard(removedCard, fieldTarget.position[0]);
}

/**
 * Swaps the positions of two cards on the battlefield
 * @param player The player that is swapping the cards
 * @param fieldTarget The two positions on the battlefield to swap
 */
function swapFieldPosition(player: AbilityResult['player'], fieldTarget: AbilityResult['fieldTarget']) {
    if (fieldTarget === undefined) throw new InternalServerError("Field target is not defined");
    if (fieldTarget.position.length !== 2) throw new InternalServerError("Field target position is not two positions");

    player.getTeam()!.getBattlefield().swapCards(fieldTarget.position[0], fieldTarget.position[1]);
}

/**
 * Draws a card from the deck
 * @param player The player that is drawing the card
 * @param amount The amount of cards to draw
 */
function draw(player: AbilityResult['player'], amount: AbilityResult['amount']) {
    if (amount === undefined) throw new InternalServerError("Amount of cards to draw is not defined");
    for (let i = 0; i < amount; i++) {
        player.drawCard();
    }
}

/**
 * Moves a card from the discard pile to the hand
 * @param player The player that is moving the card
 * @param discardTarget The target in the discard pile to move from
 */
function moveToHandFromDiscard(player: AbilityResult['player'], discardTarget: AbilityResult['discardTarget']) {
    if (discardTarget === undefined) throw new InternalServerError("Discard target is not defined");

    discardTarget.forEach(targetIndex => {
        const removedCard = player.removeCardFromDiscardPile(targetIndex);
        player.addCardToHand(removedCard);
    });
}

/**
 * Moves a card from the hand to the discard pile
 * @param player The player that is moving the card
 * @param handTarget The target in the hand to move from
 */
function moveToDiscardFromHand(player: AbilityResult['player'], handTarget: AbilityResult['handTarget']) {
    if (handTarget === undefined) throw new InternalServerError("Hand target is not defined");

    handTarget.forEach(targetIndex => {
        const removedCard = player.removeCardFromHand(targetIndex);
        player.addCardToDiscardPile(removedCard);
    });
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