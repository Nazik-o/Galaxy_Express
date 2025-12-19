package org.yearup.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;

public class ShoppingCartItem
{
    private Product product = null;
    private int quantity = 1;
    private BigDecimal discountPercent = BigDecimal.ZERO;

    public Product getProduct()
    {
        return product;
    }

    public void setProduct(Product product)
    {
        this.product = product;
    }

    public int getQuantity()
    {
        return quantity;
    }

    public void setQuantity(int quantity)
    {
        this.quantity = quantity;
    }

    public BigDecimal getDiscountPercent()
    {
        return discountPercent;
    }

    public void setDiscountPercent(BigDecimal discountPercent)
    {
        this.discountPercent = discountPercent;
    }

    @JsonIgnore
    public int getProductId()
    {
        if (product == null)
            throw new IllegalStateException("ShoppingCartItem.product is null");
        return product.getProductId();
    }

    public BigDecimal getLineTotal()
    {
        if (product == null || product.getPrice() == null)
            return BigDecimal.ZERO;

        BigDecimal basePrice = product.getPrice();
        BigDecimal qty = BigDecimal.valueOf(this.quantity);

        BigDecimal subTotal = basePrice.multiply(qty);
        BigDecimal discount = (discountPercent == null) ? BigDecimal.ZERO : discountPercent;
        BigDecimal discountAmount = subTotal.multiply(discount);

        return subTotal.subtract(discountAmount);
    }
}
