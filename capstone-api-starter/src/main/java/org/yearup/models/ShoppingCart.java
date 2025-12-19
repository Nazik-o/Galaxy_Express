package org.yearup.models;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

public class ShoppingCart
{
    private Map<Integer, ShoppingCartItem> items = new HashMap<>();

    public Map<Integer, ShoppingCartItem> getItems()
    {
        return items;
    }

    // this allows replacing the entire cart map.
    public void setItems(Map<Integer, ShoppingCartItem> items)
    {
        this.items = items;
    }

    public boolean contains(int productId)
    {
        return items.containsKey(productId);
    }

    public boolean isEmpty()
    {
        return items == null || items.isEmpty();
    }


   //If the product already exists, increment quantity instead of overwriting

    public void add(ShoppingCartItem item)
    {
        if (item == null || item.getProduct() == null)
            return;

        int productId = item.getProductId();

        if (items.containsKey(productId))
        {
            ShoppingCartItem existing = items.get(productId);
            existing.setQuantity(existing.getQuantity() + item.getQuantity());
        }
        else
        {
            items.put(productId, item);
        }
    }

    public ShoppingCartItem get(int productId)
    {
        return items.get(productId);
    }

    //Returns the total cost by summing each item's line total.
    public BigDecimal getTotal()
    {
        return items.values()
                .stream()
                .map(ShoppingCartItem::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }


     //If product exists, increment quantity.

    public void addItem(Product product, int quantity)
    {
        if (product == null || quantity <= 0)
            return;

        int productId = product.getProductId();

        if (items.containsKey(productId))
        {
            ShoppingCartItem existing = items.get(productId);
            existing.setQuantity(existing.getQuantity() + quantity);
            return;
        }

        ShoppingCartItem item = new ShoppingCartItem();
        item.setProduct(product);
        item.setQuantity(quantity);
        item.setDiscountPercent(BigDecimal.ZERO);

        items.put(productId, item);
    }
}
