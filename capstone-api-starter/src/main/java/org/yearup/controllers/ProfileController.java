package org.yearup.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.yearup.data.ProfileDao;
import org.yearup.data.UserDao;
import org.yearup.models.Profile;
import org.yearup.models.User;

import java.security.Principal;

@RestController
@RequestMapping("/profile")
@CrossOrigin
@PreAuthorize("isAuthenticated()") //only and only logged-in users
public class ProfileController
{
    private final ProfileDao profileDao;
    private final UserDao userDao;

    public ProfileController(ProfileDao profileDao, UserDao userDao)
    {
        this.profileDao = profileDao;
        this.userDao = userDao;
    }

    @GetMapping("")
    public Profile getMyProfile(Principal principal)
    {
        try
        {
            int userId = getUserId(principal);

            Profile profile = profileDao.getByUserId(userId);
            if (profile == null)
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found");

            return profile;
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

    @PutMapping("")
    public Profile updateMyProfile(@RequestBody Profile profile, Principal principal)
    {
        try
        {
            int userId = getUserId(principal);

            // this is for security check
            profile.setUserId(userId);

            profileDao.update(userId, profile);

            Profile updated = profileDao.getByUserId(userId);
            if (updated == null)
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found");

            return updated;
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
}

