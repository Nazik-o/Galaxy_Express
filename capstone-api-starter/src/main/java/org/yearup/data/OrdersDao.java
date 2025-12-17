package org.yearup.data;

import org.yearup.models.Order;
import org.yearup.models.ShoppingCart;

public interface OrdersDao
{
    Order checkout(int userId, ShoppingCart cart);
}
