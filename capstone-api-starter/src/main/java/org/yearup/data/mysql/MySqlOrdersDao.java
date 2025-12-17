package org.yearup.data.mysql;

import org.springframework.stereotype.Component;
import org.yearup.data.OrdersDao;
import org.yearup.models.Order;
import org.yearup.models.ShoppingCart;
import org.yearup.models.ShoppingCartItem;

import javax.sql.DataSource;
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

        String insertLineSql = "INSERT INTO orders (user_id, `date`, address, city, state, zip, shipping_amount) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?);";


        String clearCartSql =
                "DELETE FROM shopping_cart WHERE user_id = ?;";

        try (Connection connection = getConnection())
        {
            connection.setAutoCommit(false);

            int orderId;

            try (PreparedStatement ps = connection.prepareStatement(insertOrderSql, Statement.RETURN_GENERATED_KEYS))
            {
                ps.setInt(1, userId);
                ps.executeUpdate();

                try (ResultSet keys = ps.getGeneratedKeys())
                {
                    if (!keys.next()) throw new SQLException("Creating order failed, no ID returned.");
                    orderId = keys.getInt(1);
                }
            }

            try (PreparedStatement psLine = connection.prepareStatement(insertLineSql))
            {
                for (ShoppingCartItem item : cart.getItems().values())
                {
                    psLine.setInt(1, orderId);
                    psLine.setInt(2, item.getProduct().getProductId());
                    psLine.setInt(3, item.getQuantity());
                    psLine.setBigDecimal(4, item.getProduct().getPrice());
                    psLine.addBatch();
                }
                psLine.executeBatch();
            }


            try (PreparedStatement psClear = connection.prepareStatement(clearCartSql))
            {
                psClear.setInt(1, userId);
                psClear.executeUpdate();
            }

            connection.commit();


            Order order = new Order();
            order.setOrderId(orderId);
            order.setUserId(userId);
            order.setOrderDate(LocalDateTime.now());
            return order;
        }
        catch (Exception ex)
        {
            throw new RuntimeException(ex);
        }
    }
}

