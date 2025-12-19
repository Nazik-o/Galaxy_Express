let orderService;

class OrderService {
  checkout() {
    const url = `${config.baseUrl}/orders`;
    const headers = userService.getHeaders();
    return axios.post(url, {}, { headers });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  orderService = new OrderService();
});


