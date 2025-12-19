let categoryService;

class CategoryService {
  getAllCategories(callback) {
    const url = `${config.baseUrl}/categories`;
    const headers = userService?.getHeaders ? userService.getHeaders() : {};

    return axios.get(url, { headers })
      .then(response => {
        if (typeof callback === "function") {
          callback(response.data);
        }
      })
      .catch(() => {
        templateBuilder.append("error", { error: "Loading categories failed." }, "errors");
      });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  categoryService = new CategoryService();
});



/*let categoryService;

class CategoryService {


    getAllCategories(callback)
    {
        const url = `${config.baseUrl}/categories`;

        return axios.get(url)
            .then(response => {
                callback(response.data);
            })
            .catch(error => {

                const data = {
                    error: "Loading categories failed."
                };

                templateBuilder.append("error", data, "errors")
            });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    categoryService = new CategoryService();
});*/
