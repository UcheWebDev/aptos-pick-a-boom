import { create } from 'zustand'

// Separate type for just the filter values
type FilterValues = {
    amountFilter: string
    statusFilter: string
    creator: string
    pair_id: string
}

type FilterState = FilterValues & {
    setAmountFilter: (filter: string) => void
    setStatusFilter: (filter: string) => void
    setWalletAddress: (address: string) => void
    setPairId: (id: string) => void
    resetFilters: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
    amountFilter: 'all',
    statusFilter: 'all',
    creator: '',
    pair_id: '',
    setAmountFilter: (filter) => set({ amountFilter: filter }),
    setStatusFilter: (filter) => set({ statusFilter: filter }),
    setWalletAddress: (address) => set({ creator: address }),
    setPairId: (id) => set({ pair_id: id }),
    resetFilters: () => set({
        amountFilter: 'all',
        statusFilter: 'all',
        creator: '',
        pair_id: ''
    })
}))

// Helper function to filter stakes by amount
export const filterStakesByAmount = (stakes: any[], amountFilter: string) => {
    if (amountFilter === 'all') return stakes

    return stakes.filter(stake => {
        const amount = parseFloat(stake.amount)
        switch (amountFilter) {
            case 'low':
                return amount < 100
            case 'medium':
                return amount >= 100 && amount < 500
            case 'high':
                return amount >= 500
            default:
                return true
        }
    })
}

// Helper function to filter stakes by wallet address
export const filterStakesByWallet = (stakes: any[], creator: string) => {
    if (!creator) return stakes
    return stakes.filter(stake =>
        stake.creator.toLowerCase() === creator.toLowerCase()
    )
}

// Helper function to filter stakes by pair ID
export const filterStakesByPairId = (stakes: any[], pair_id: string) => {
    if (!pair_id) return stakes
    return stakes.filter(stake =>
        stake.pair_id.toLowerCase() === pair_id.toLowerCase()
    )
}

// Updated to accept FilterValues instead of FilterState
export const applyAllFilters = (stakes: any[], filters: FilterValues) => {
    let filteredStakes = stakes

    filteredStakes = filterStakesByAmount(filteredStakes, filters.amountFilter)
    filteredStakes = filterStakesByWallet(filteredStakes, filters.creator)
    filteredStakes = filterStakesByPairId(filteredStakes, filters.pair_id)

    return filteredStakes
}