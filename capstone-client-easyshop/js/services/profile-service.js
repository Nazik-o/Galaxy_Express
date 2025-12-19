let profileService;

class ProfileService {
  loadProfile() {
    const url = `${config.baseUrl}/profile`;
    const headers = userService.getHeaders(); //include token

    axios.get(url, { headers })
      .then(response => {
        templateBuilder.build("profile", response.data, "main");
      })
      .catch(() => {
        templateBuilder.append("error", { error: "Load profile failed." }, "errors");
      });
  }

  updateProfile(profile) {
    const url = `${config.baseUrl}/profile`;
    const headers = userService.getHeaders();

    axios.put(url, profile, { headers })
      .then(() => {
        templateBuilder.append("message", { message: "The profile has been updated." }, "errors");
      })
      .catch(() => {
        templateBuilder.append("error", { error: "Save profile failed." }, "errors");
      });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  profileService = new ProfileService();
});





/*let profileService;

class ProfileService
{
    loadProfile()
    {
        const url = `${config.baseUrl}/profile`;

        axios.get(url)
             .then(response => {
                 templateBuilder.build("profile", response.data, "main")
             })
             .catch(error => {
                 const data = {
                     error: "Load profile failed."
                 };

                 templateBuilder.append("error", data, "errors")
             })
    }

    updateProfile(profile)
    {

        const url = `${config.baseUrl}/profile`;

        axios.put(url, profile)
             .then(() => {
                 const data = {
                     message: "The profile has been updated."
                 };

                 templateBuilder.append("message", data, "errors")
             })
             .catch(error => {
                 const data = {
                     error: "Save profile failed."
                 };

                 templateBuilder.append("error", data, "errors")
             })
    }
}

document.addEventListener("DOMContentLoaded", () => {
   profileService = new ProfileService();
});*/
