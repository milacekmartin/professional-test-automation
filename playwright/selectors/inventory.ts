export const InventorySelectors = {
    item: 'inventory-item',
    itemName: 'inventory-item-name',
    itemDesc: 'inventory-item-desc',
    itemPrice: 'inventory-item-price',

    addToCart: (id: string) => `add-to-cart-${id}`,
    removeFromCart: (id: string) => `remove-${id}`,

    cartLink: 'shopping-cart-link',
    cartBadge: 'shopping-cart-badge'
} as const
