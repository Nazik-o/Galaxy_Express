package org.yearup.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.server.ResponseStatusException;
import org.yearup.data.ProductDao;
import org.yearup.data.ShoppingCartDao;
import org.yearup.data.UserDao;
import org.yearup.models.ShoppingCart;
import org.yearup.models.User;

import java.security.Principal;

// convert this class to a REST controller
// only logged in users should have access to these actions
@RestController
@RequestMapping("/cart")
@CrossOrigin
@PreAuthorize("isAuthenticated()")
// only logged in users should have access to these actions
public class ShoppingCartController
{
    // a shopping cart requires
    private final ShoppingCartDao shoppingCartDao;
    private final UserDao userDao;
    private final ProductDao productDao;

    public ShoppingCartController(ShoppingCartDao shoppingCartDao, UserDao userDao, ProductDao productDao)
    {
        this.shoppingCartDao = shoppingCartDao;
        this.userDao = userDao;
        this.productDao = productDao;
    }
    // each method in this controller requires a Principal object as a parameter
    @GetMapping("")
    public ShoppingCart getCart(Principal principal)
    {

            // get the currently logged in username
            // find database user by userId
        // use the shoppingcartDao to get all items in the cart and return the cart

        try
        {
            int userId = getUserId(principal);
            return shoppingCartDao.getByUserId(userId);
        }
        catch (ResponseStatusException ex)
        {
            throw ex;
        }
        catch (Exception e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Oops... our bad.");
        }
    }

    // add a POST method to add a product to the cart - the url should be
    // https://localhost:8080/cart/products/15 (15 is the productId to be added
    @PostMapping("/products/{productId}")
//    @ResponseStatus(HttpStatus.CREATED)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void  addProductToCart(@PathVariable int productId, Principal principal) {
        try {
            int userId = getUserId(principal);

            // optional but helpful: return 404 if product doesn't exist
            if (productDao.getById(productId) == null)
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");

            shoppingCartDao.addProduct(userId, productId);
//            return shoppingCartDao.getByUserId(userId);

        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Oops... our bad.");
        }
    }



    // add a PUT method to update an existing product in the cart - the url should be
    // https://localhost:8080/cart/products/15 (15 is the productId to be updated)
    // the BODY should be a ShoppingCartItem - quantity is the only value that will be updated
    @PutMapping("/products/{productId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateProductQuantity(@PathVariable int productId,
                                      @RequestBody QuantityRequest body,
                                      Principal principal)
    {
        try
        {
            int userId = getUserId(principal);

            if (body == null || body.getQuantity() < 1)
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be at least 1");

            boolean updated = shoppingCartDao.updateQuantity(userId, productId, body.getQuantity());

            // only update if item already exists in cart
            if (!updated)
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found in cart");
        }
        catch (ResponseStatusException ex)
        {
            throw ex;
        }
        catch(Exception e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Oops... our bad.");
        }
    }


    // add a DELETE method to clear all products from the current users cart
    // https://localhost:8080/cart
    @DeleteMapping("")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart(Principal principal)
    {
        try
        {
            int userId = getUserId(principal);
            shoppingCartDao.clearCart(userId);
        }
        catch (ResponseStatusException ex)
        {
            throw ex;
        }
        catch(Exception e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Oops... our bad.");
        }
    }


    private int getUserId(Principal principal)
    {
        if (principal == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not logged in");

        String userName = principal.getName();
        User user = userDao.getByUserName(userName);

        if (user == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");

        return user.getId();
    }

    public static class QuantityRequest
    {
        private int quantity;

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }
}
