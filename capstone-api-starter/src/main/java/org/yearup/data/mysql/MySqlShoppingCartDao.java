package org.yearup.data.mysql;

import org.springframework.stereotype.Component;
import org.yearup.data.ShoppingCartDao;
import org.yearup.models.Product;
import org.yearup.models.ShoppingCart;
import org.yearup.models.ShoppingCartItem;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class MySqlShoppingCartDao extends MySqlDaoBase implements ShoppingCartDao
{
    public MySqlShoppingCartDao(DataSource dataSource)
    {
        super(dataSource);
    }

    @Override
    public ShoppingCart getByUserId(int userId)
    {
        ShoppingCart cart = new ShoppingCart();

        String sql =
                "SELECT sc.product_id, sc.quantity, " +
                        "       p.name, p.price, p.category_id, p.description, p.subcategory, p.image_url, p.stock, p.featured " +
                        "FROM shopping_cart sc " +
                        "JOIN products p ON p.product_id = sc.product_id " +
                        "WHERE sc.user_id = ?;";

        try (Connection connection = getConnection();
             PreparedStatement statement = connection.prepareStatement(sql))
        {
            statement.setInt(1, userId);

            try (ResultSet row = statement.executeQuery())
            {
                while (row.next())
                {
                    int productId = row.getInt("product_id");
                    int quantity = row.getInt("quantity");

                    Product product = new Product(
                            productId,
                            row.getString("name"),
                            row.getBigDecimal("price"),
                            row.getInt("category_id"),
                            row.getString("description"),
                            row.getString("subcategory"),
                            row.getInt("stock"),
                            row.getBoolean("featured"),
                            row.getString("image_url")
                    );

                    ShoppingCartItem item = new ShoppingCartItem();
                    item.setProduct(product);
                    item.setQuantity(quantity);
                    item.setDiscountPercent(BigDecimal.ZERO);

                    cart.add(item);
                }
            }

            return cart;
        }
        catch (SQLException e)
        {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void addProduct(int userId, int productId)
    {
        String updateSql =
                "UPDATE shopping_cart " +
                        "SET quantity = quantity + 1 " +
                        "WHERE user_id = ? AND product_id = ?;";

        String insertSql =
                "INSERT INTO shopping_cart (user_id, product_id, quantity) " +
                        "VALUES (?, ?, 1);";

        try (Connection connection = getConnection())
        {
            // First try to increment quantity (if row exists)
            try (PreparedStatement updateStmt = connection.prepareStatement(updateSql))
            {
                updateStmt.setInt(1, userId);
                updateStmt.setInt(2, productId);

                int rows = updateStmt.executeUpdate();
                if (rows > 0) return; // item existed; we incremented it
            }

            // Otherwise insert new row
            try (PreparedStatement insertStmt = connection.prepareStatement(insertSql))
            {
                insertStmt.setInt(1, userId);
                insertStmt.setInt(2, productId);
                insertStmt.executeUpdate();
            }
        }
        catch (SQLException e)
        {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean updateQuantity(int userId, int productId, int quantity)
    {
        // Better behavior: if quantity <= 0, remove the item from the cart
        if (quantity <= 0)
        {
            String deleteSql =
                    "DELETE FROM shopping_cart " +
                            "WHERE user_id = ? AND product_id = ?;";

            try (Connection connection = getConnection();
                 PreparedStatement statement = connection.prepareStatement(deleteSql))
            {
                statement.setInt(1, userId);
                statement.setInt(2, productId);

                int rows = statement.executeUpdate();
                return rows > 0;
            }
            catch (SQLException e)
            {
                throw new RuntimeException(e);
            }
        }

        String sql =
                "UPDATE shopping_cart " +
                        "SET quantity = ? " +
                        "WHERE user_id = ? AND product_id = ?;";

        try (Connection connection = getConnection();
             PreparedStatement statement = connection.prepareStatement(sql))
        {
            statement.setInt(1, quantity);
            statement.setInt(2, userId);
            statement.setInt(3, productId);

            int rows = statement.executeUpdate();
            return rows > 0;
        }
        catch (SQLException e)
        {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void clearCart(int userId)
    {
        String sql = "DELETE FROM shopping_cart WHERE user_id = ?;";

        try (Connection connection = getConnection();
             PreparedStatement statement = connection.prepareStatement(sql))
        {
            statement.setInt(1, userId);
            statement.executeUpdate();
        }
        catch (SQLException e)
        {
            throw new RuntimeException(e);
        }
    }
}
