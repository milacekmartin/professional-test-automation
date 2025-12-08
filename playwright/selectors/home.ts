export const HomeSelectors = {
    item: 'inventory-item',
    itemName: 'inventory-item-name',
    itemDesc: 'inventory-item-desc',
    itemPrice: 'inventory-item-price',

    addToCartButton: (id: string) => `add-to-cart-${id}`,
    removeButton: (id: string) => `remove-${id}`,

    cartLink: 'shopping-cart-link',
    cartBadge: 'shopping-cart-badge'
} as const
