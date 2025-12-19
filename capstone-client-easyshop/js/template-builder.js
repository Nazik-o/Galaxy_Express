let templateBuilder = {};

class TemplateBuilder {
  build(templateName, value, target, callback) {
    axios.get(`templates/${templateName}.html`)
      .then(response => {
        try {
          const template = response.data;
          const html = Mustache.render(template, value);

          const targetEl = document.getElementById(target);
          if (!targetEl) throw new Error(`Target element #${target} not found`);

          targetEl.innerHTML = html;

          if (typeof callback === "function") callback();
        } catch (e) {
          console.log(e);
          this.append("error", { error: `Template render failed: ${templateName}` }, "errors");
        }
      })
      .catch(err => {
        console.log(err);
        this.append("error", { error: `Template load failed: ${templateName}` }, "errors");
      });
  }

  clear(target) {
    const targetEl = document.getElementById(target);
    if (targetEl) targetEl.innerHTML = "";
  }

  append(templateName, value, target) {
    axios.get(`templates/${templateName}.html`)
      .then(response => {
        try {
          const template = response.data;
          const html = Mustache.render(template, value);

          const parent = document.getElementById(target);
          if (!parent) throw new Error(`Target element #${target} not found`);

          // Wrap content so templates can safely contain multiple root nodes
          const element = this.createElementFromHTML(html);
          parent.appendChild(element);

          // Auto-remove notifications placed into "errors" container
          if (target === "errors") {
            setTimeout(() => {
              if (element && element.parentNode === parent) {
                parent.removeChild(element);
              }
            }, 3000);
          }
        } catch (e) {
          console.log(e);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  createElementFromHTML(htmlString) {
    const div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div; // wrapper for all nodes
  }
}

document.addEventListener("DOMContentLoaded", () => {
  templateBuilder = new TemplateBuilder();
});





/*let templateBuilder = {};

class TemplateBuilder
{
    build(templateName, value, target, callback)
    {
        axios.get(`templates/${templateName}.html`)
            .then(response => {
                try
                {
                    const template = response.data;
                    const html = Mustache.render(template, value);
                    document.getElementById(target).innerHTML = html;

                    if(callback) callback();
                }
                catch(e)
                {
                    console.log(e);
                }
            })
    }

    clear(target)
    {
        document.getElementById(target).innerHTML = "";
    }

    append(templateName, value, target)
    {
        axios.get(`templates/${templateName}.html`)
             .then(response => {
                 try
                 {
                     const template = response.data;
                     const html = Mustache.render(template, value);

                     const element = this.createElementFromHTML(html);
                     const parent = document.getElementById(target);
                     parent.appendChild(element);

                     if(target == "errors")
                     {
                         setTimeout(() => {
                             parent.removeChild(element);
                         }, 3000);
                     }
                 }
                 catch(e)
                 {
                     console.log(e);
                 }
             })
    }

    createElementFromHTML(htmlString)
    {
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        // Change this to div.childNodes to support multiple top-level nodes.
        return div.firstChild;
    }

}

document.addEventListener('DOMContentLoaded', () => {
    templateBuilder = new TemplateBuilder();
});*/
