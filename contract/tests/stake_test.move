module message_board_addr::stake_game_tests {
    use std::signer;
    use std::string;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use aptos_framework::aptos_coin::AptosCoin;
    use message_board_addr::stake_contract;

    #[test_only]
    fun setup_timestamp(aptos: &signer) {
        timestamp::set_time_has_started_for_testing(aptos);
    }

    fun setup_aptos_coin(aptos: &signer): coin::MintCapability<AptosCoin> {
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<AptosCoin>(
            aptos,
            string::utf8(b"Aptos Coin"),
            string::utf8(b"APT"),
            8,
            false
        );

        coin::destroy_burn_cap(burn_cap);
        coin::destroy_freeze_cap(freeze_cap);
        mint_cap
    }

    fun setup_account(account: &signer, mint_cap: &coin::MintCapability<AptosCoin>): address {
        let account_addr = signer::address_of(account);
        
        // Register the account to use AptosCoin
        coin::register<AptosCoin>(account);

        // Mint coins to account
        let coins = coin::mint(1000000000, mint_cap);
        coin::deposit(account_addr, coins);

        account_addr
    }

    #[test]
    fun test_create_stake() {
        let aptos = account::create_account_for_test(@aptos_framework);
        let admin = account::create_account_for_test(@message_board_addr);
        let account1 = account::create_account_for_test(@0x123);
        
        setup_timestamp(&aptos);
        let mint_cap = setup_aptos_coin(&aptos);
        setup_account(&admin, &mint_cap);
        setup_account(&account1, &mint_cap);
        
        // Initialize the module for testing
        stake_contract::initialize_for_test(&admin);
        
        stake_contract::create_stake(&account1, 100);

        let (staker, opponent, amount, status) = stake_contract::get_stake_info(0);
        assert!(staker == @0x123, 0);
        assert!(opponent == @0x0, 1);
        assert!(amount == 100, 2);
        assert!(status == 0, 3);

        coin::destroy_mint_cap(mint_cap);
    }

    #[test]
    fun test_pair_stake() {
        let aptos = account::create_account_for_test(@aptos_framework);
        let admin = account::create_account_for_test(@message_board_addr);
        let account1 = account::create_account_for_test(@0x123);
        let account2 = account::create_account_for_test(@0x456);
        
        setup_timestamp(&aptos);
        let mint_cap = setup_aptos_coin(&aptos);
        setup_account(&admin, &mint_cap);
        setup_account(&account1, &mint_cap);
        setup_account(&account2, &mint_cap);
        
        // Initialize the module for testing
        stake_contract::initialize_for_test(&admin);
        
        stake_contract::create_stake(&account1, 100);
        stake_contract::pair_stake(&account2, 0);

        let (staker, opponent, amount, status) = stake_contract::get_stake_info(0);
        assert!(staker == @0x123, 0);
        assert!(opponent == @0x456, 1);
        assert!(amount == 100, 2);
        assert!(status == 1, 3);

        coin::destroy_mint_cap(mint_cap);
    }

    #[test]
    fun test_resolve_game() {
        let aptos = account::create_account_for_test(@aptos_framework);
        let admin = account::create_account_for_test(@message_board_addr);
        let account1 = account::create_account_for_test(@0x123);
        let account2 = account::create_account_for_test(@0x456);
        
        setup_timestamp(&aptos);
        let mint_cap = setup_aptos_coin(&aptos);
        setup_account(&admin, &mint_cap);
        setup_account(&account1, &mint_cap);
        setup_account(&account2, &mint_cap);
        
        // Initialize the module for testing
        stake_contract::initialize_for_test(&admin);
        
        // Record initial balance
        let initial_balance = coin::balance<AptosCoin>(@0x123);
        
        // Create and resolve stake
        stake_contract::create_stake(&account1, 100);
        stake_contract::pair_stake(&account2, 0);
        stake_contract::resolve_game(&admin, 0, @0x123);

        let (_, _, _, status) = stake_contract::get_stake_info(0);
        assert!(status == 2, 0);
        
        // Check that winner received their original stake plus opponent's stake
        let final_balance = coin::balance<AptosCoin>(@0x123);
        assert!(final_balance == initial_balance + 100, 1);

        coin::destroy_mint_cap(mint_cap);
    }

    #[test]
    fun test_get_pending_stakes() {
        let aptos = account::create_account_for_test(@aptos_framework);
        let admin = account::create_account_for_test(@message_board_addr);
        let account1 = account::create_account_for_test(@0x123);
        
        setup_timestamp(&aptos);
        let mint_cap = setup_aptos_coin(&aptos);
        setup_account(&admin, &mint_cap);
        setup_account(&account1, &mint_cap);
        
        // Initialize the module for testing
        stake_contract::initialize_for_test(&admin);
        
        stake_contract::create_stake(&account1, 100);

        let pending_stakes = stake_contract::get_pending_stakes();
        let length = vector::length(&pending_stakes);
        assert!(length == 1, 0);
        
        // Use get_stake_info to check the first pending stake
        let (staker, opponent, amount, status) = stake_contract::get_stake_info(0);
        assert!(staker == @0x123, 1);
        assert!(opponent == @0x0, 2);
        assert!(amount == 100, 3);
        assert!(status == 0, 4);

        coin::destroy_mint_cap(mint_cap);
    }
}