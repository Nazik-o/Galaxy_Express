package org.yearup.data;

import org.yearup.models.Category;

import java.util.List;

public interface CategoryDao
{
    List<Category> getAllCategories();
    Category getById(int categoryId);
    Category create(Category category);
    //Should I change my void into boolean or int for better Rest accuracy for not found ?
    void update(int categoryId, Category category);
    void delete(int categoryId);
}
