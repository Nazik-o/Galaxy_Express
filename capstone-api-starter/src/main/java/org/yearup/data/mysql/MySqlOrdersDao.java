package org.yearup.data.mysql;

import org.springframework.stereotype.Component;
import org.yearup.data.OrdersDao;
import org.yearup.models.Order;
import org.yearup.models.ShoppingCart;
import org.yearup.models.ShoppingCartItem;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDateTime;

@Component
public class MySqlOrdersDao extends MySqlDaoBase implements OrdersDao
{
    public MySqlOrdersDao(DataSource dataSource)
    {
        super(dataSource);
    }

    @Override
    public Order checkout(int userId, ShoppingCart cart)
    {

        String insertOrderSql =
                "INSERT INTO orders (user_id, order_date) VALUES (?, NOW());";

        String insertLineSql =
                "INSERT INTO order_line_items (order_id, product_id, sales_price, quantity, discount) " +
                        "VALUES (?, ?, ?, ?, ?);";

        String clearCartSql =
                "DELETE FROM shopping_cart WHERE user_id = ?;";

        Connection connection = null;

        try
        {
            connection = getConnection();
            connection.setAutoCommit(false); // start transaction

            int orderId;

            // 1️⃣ Insert order row and get generated order_id
            try (PreparedStatement ps =
                         connection.prepareStatement(insertOrderSql, Statement.RETURN_GENERATED_KEYS))
            {
                ps.setInt(1, userId);
                ps.executeUpdate();

                try (ResultSet keys = ps.getGeneratedKeys())
                {
                    if (!keys.next())
                        throw new SQLException("Creating order failed, no ID returned.");

                    orderId = keys.getInt(1);
                }
            }

            // 2️⃣ Insert line items for each cart item
            try (PreparedStatement psLine = connection.prepareStatement(insertLineSql))
            {
                for (ShoppingCartItem item : cart.getItems().values())
                {
                    psLine.setInt(1, orderId);
                    psLine.setInt(2, item.getProduct().getProductId());
                    psLine.setBigDecimal(3, item.getProduct().getPrice());
                    psLine.setInt(4, item.getQuantity());
                    psLine.setBigDecimal(5, BigDecimal.ZERO);                 // discount = 0 for Phase 5

                    psLine.addBatch();
                }

                psLine.executeBatch();
            }

            // 3️⃣ Clear the cart
            try (PreparedStatement psClear = connection.prepareStatement(clearCartSql))
            {
                psClear.setInt(1, userId);
                psClear.executeUpdate();
            }

            connection.commit();

            // 4️⃣ Return minimal Order confirmation
            Order order = new Order();
            order.setOrderId(orderId);
            order.setUserId(userId);
            order.setOrderDate(LocalDateTime.now());
            return order;
        }
        catch (Exception ex)
        {

            if (connection != null)
            {
                try { connection.rollback(); } catch (Exception ignored) {}
            }
            throw new RuntimeException("Checkout failed", ex);
        }
        finally
        {
            if (connection != null)
            {
                try { connection.setAutoCommit(true); } catch (Exception ignored) {}
                try { connection.close(); } catch (Exception ignored) {}
            }
        }
    }
}
