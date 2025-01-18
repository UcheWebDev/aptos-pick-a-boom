module message_board_addr::stake_contract {
    use std::signer;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;
    use aptos_framework::object::{Self, ExtendRef};
    use aptos_framework::account;

    const BOARD_OBJECT_SEED: vector<u8> = b"BOARD_OBJECT";

    const E_STAKE_NOT_FOUND: u64 = 1;
    const E_STAKE_ALREADY_PAIRED: u64 = 2;
    const E_INSUFFICIENT_BALANCE: u64 = 3;
    const E_NOT_AUTHORIZED: u64 = 5;

    const STATUS_PENDING: u8 = 0;
    const STATUS_PAIRED: u8 = 1;
    const STATUS_COMPLETED: u8 = 2;




}