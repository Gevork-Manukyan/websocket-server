// TODO: each function will return an object with keys and values
// that determine what kind of action needs to be done
// e.g. { type: 'gain gold', amount: 10 }
// define a enum/type for the 'type' key
// e.g. type ActionType = 'gain gold' | 'gain health' | 'lose health' | 'lose gold'

enum ActionType {
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