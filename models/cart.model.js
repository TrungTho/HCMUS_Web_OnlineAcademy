const courseModel = require("./course.model");

module.exports = {
  //add an item to existing cart
  add(cart, ID_COURSE) {
    for (cID of cart) {
      if (cID === ID_COURSE) {
        return;
      }
    }

    cart.push(ID_COURSE);
  },

  //get total number of item in cart to view in navigation or do st else
  getTotalItems(cart) {
    let count = 0;
    for (item of cart) {
      count += 1;
    }

    return count;
  },

  del(cart, id) {
    for (let i = cart.length - 1; i >= 0; i--) {
      if (id === cart[i]) {
        cart.splice(i, 1);
        return;
      }
    }
  },

  async getTotalMoney(cart) {
    let total = 0;
    for (item of cart) {
      let course = await courseModel.getSingle(item);

      let discount = parseInt(course.DISCOUNT);
      let price = parseInt(course.PRICE);

      if (isNaN(discount)) {
        if (isNaN(price)) {
          total += 0;
        } else {
          total += price;
        }
      } else {
        total += price - (price * discount) / 100;
      }
    }

    return total;
  },
};
