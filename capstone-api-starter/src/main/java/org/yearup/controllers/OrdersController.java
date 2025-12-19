package org.yearup.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.yearup.data.OrdersDao;
import org.yearup.data.ShoppingCartDao;
import org.yearup.data.UserDao;
import org.yearup.models.Order;
import org.yearup.models.ShoppingCart;
import org.yearup.models.User;

import java.security.Principal;

@RestController
@RequestMapping("/orders")
@CrossOrigin
@PreAuthorize("isAuthenticated()")
public class OrdersController
{
    private final OrdersDao ordersDao;
    private final ShoppingCartDao shoppingCartDao;
    private final UserDao userDao;


    public OrdersController(OrdersDao ordersDao, ShoppingCartDao shoppingCartDao, UserDao userDao)
    {
        this.ordersDao = ordersDao;
        this.shoppingCartDao = shoppingCartDao;
        this.userDao = userDao;
    }

    // POST http://localhost:8080/orders (NO BODY)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Order checkout(Principal principal)
    {
        try
        {
            int userId = getUserId(principal);


            ShoppingCart cart = shoppingCartDao.getByUserId(userId);
            if (cart == null || cart.getItems() == null || cart.getItems().isEmpty())
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Shopping cart is empty.");

            return ordersDao.checkout(userId, cart);
        }
        catch (ResponseStatusException ex)
        {
            throw ex;
        }
        catch (Exception ex)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Oops... our bad.", ex);
        }
    }
    private int getUserId(Principal principal)
    {
        if (principal == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not logged in");

        User user = userDao.getByUserName(principal.getName());
        if (user == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");

        return user.getId();
    }
}
