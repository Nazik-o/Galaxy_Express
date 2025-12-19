let productService;

class ProductService {
  photos = [];

  filter = {
    cat: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    subCategory: undefined,

    queryString: () => {
      let qs = "";

      if (this.filter.cat) qs = `cat=${this.filter.cat}`;

      if (this.filter.minPrice) {
        const minP = `minPrice=${this.filter.minPrice}`;
        qs = qs.length > 0 ? `${qs}&${minP}` : minP;
      }

      if (this.filter.maxPrice) {
        const maxP = `maxPrice=${this.filter.maxPrice}`;
        qs = qs.length > 0 ? `${qs}&${maxP}` : maxP;
      }

      if (this.filter.subCategory) {
        const sub = `subCategory=${this.filter.subCategory}`;
        qs = qs.length > 0 ? `${qs}&${sub}` : sub;
      }

      return qs.length > 0 ? `?${qs}` : "";
    }
  };

  constructor() {
    // Load list of photos into memory
    //relative path (no leading slash)
    axios.get("images/products/photos.json")
      .then(response => {
        this.photos = response.data;
      })
      .catch(() => {
        // Not fatal; products will still load but image checking may not work
        this.photos = [];
      });
  }

  hasPhoto(photo) {
    return this.photos.includes(photo);
  }

  addCategoryFilter(cat) {
    if (cat == 0) this.clearCategoryFilter();
    else this.filter.cat = cat;
  }

  addMinPriceFilter(price) {
    if (price == 0 || price === "") this.clearMinPriceFilter();
    else this.filter.minPrice = price;
  }

  addMaxPriceFilter(price) {
    if (price == 0 || price === "") this.clearMaxPriceFilter();
    else this.filter.maxPrice = price;
  }

  addSubcategoryFilter(subCategory) {
    if (subCategory === "") this.clearSubcategoryFilter();
    else this.filter.subCategory = subCategory;
  }

  clearCategoryFilter() { this.filter.cat = undefined; }
  clearMinPriceFilter() { this.filter.minPrice = undefined; }
  clearMaxPriceFilter() { this.filter.maxPrice = undefined; }
  clearSubcategoryFilter() { this.filter.subCategory = undefined; }

  search() {
    const url = `${config.baseUrl}/products${this.filter.queryString()}`;

    axios.get(url)
      .then(response => {
        const data = { products: response.data };

        data.products.forEach(product => {
          // If photos list hasn't loaded yet, don't force "no-image"
          if (this.photos.length > 0 && !this.hasPhoto(product.imageUrl)) {
            product.imageUrl = "no-image.jpg";
          }
        });

        //keep 'this' safe for callback
        templateBuilder.build("product", data, "content", () => this.enableButtons());
      })
      .catch(() => {
        templateBuilder.append("error", { error: "Searching products failed." }, "errors");
      });
  }

  enableButtons() {
    const buttons = [...document.querySelectorAll(".add-button")];

    if (userService.isLoggedIn()) {
      buttons.forEach(btn => btn.classList.remove("invisible"));
    } else {
      buttons.forEach(btn => btn.classList.add("invisible"));
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  productService = new ProductService();
});





/*let productService;

class ProductService {

    photos = [];


    filter = {
        cat: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        subCategory: undefined,
        queryString: () => {
            let qs = "";
            if(this.filter.cat){ qs = `cat=${this.filter.cat}`; }
            if(this.filter.minPrice)
            {
                const minP = `minPrice=${this.filter.minPrice}`;
                if(qs.length>0) {   qs += `&${minP}`; }
                else { qs = minP; }
            }
            if(this.filter.maxPrice)
            {
                const maxP = `maxPrice=${this.filter.maxPrice}`;
                if(qs.length>0) {   qs += `&${maxP}`; }
                else { qs = maxP; }
            }
            if(this.filter.subCategory)
            {
                const sub = `subCategory=${this.filter.subCategory}`;
                if(qs.length>0) {   qs += `&${sub}`; }
                else { qs = sub; }
            }

            return qs.length > 0 ? `?${qs}` : "";
        }
    }

    constructor() {

        //load list of photos into memory
        axios.get("/images/products/photos.json")
            .then(response => {
                this.photos = response.data;
            });
    }

    hasPhoto(photo){
        return this.photos.filter(p => p == photo).length > 0;
    }

    addCategoryFilter(cat)
    {
        if(cat == 0) this.clearCategoryFilter();
        else this.filter.cat = cat;
    }
    addMinPriceFilter(price)
    {
        if(price == 0 || price == "") this.clearMinPriceFilter();
        else this.filter.minPrice = price;
    }
    addMaxPriceFilter(price)
    {
        if(price == 0 || price == "") this.clearMaxPriceFilter();
        else this.filter.maxPrice = price;
    }
    addSubcategoryFilter(subCategory)
    {
        if(subCategory == "") this.clearSubcategoryFilter();
        else this.filter.subCategory = subCategory;
    }

    clearCategoryFilter()
    {
        this.filter.cat = undefined;
    }
    clearMinPriceFilter()
    {
        this.filter.minPrice = undefined;
    }
    clearMaxPriceFilter()
    {
        this.filter.maxPrice = undefined;
    }
    clearSubcategoryFilter()
    {
        this.filter.subCategory = undefined;
    }

    search()
    {
        const url = `${config.baseUrl}/products${this.filter.queryString()}`;

        axios.get(url)
             .then(response => {
                 let data = {};
                 data.products = response.data;

                 data.products.forEach(product => {
                     if(!this.hasPhoto(product.imageUrl))
                     {
                         product.imageUrl = "no-image.jpg";
                     }
                 })

                 templateBuilder.build('product', data, 'content', this.enableButtons);

             })
            .catch(error => {

                const data = {
                    error: "Searching products failed."
                };

                templateBuilder.append("error", data, "errors")
            });
    }

    enableButtons()
    {
        const buttons = [...document.querySelectorAll(".add-button")];

        if(userService.isLoggedIn())
        {
            buttons.forEach(button => {
                button.classList.remove("invisible")
            });
        }
        else
        {
            buttons.forEach(button => {
                button.classList.add("invisible")
            });
        }
    }

}





document.addEventListener('DOMContentLoaded', () => {
    productService = new ProductService();

});
*/
