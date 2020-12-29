module.exports = {
  //add an item to existing cart
  add(cart, item) {
    for (cItem of cart) {
      if (cItem.id === item.id) {
        ci.quantity += item.quantity;
        return;
      }
    }

    cart.push(item);
  },

  //get total number of item in cart to view in navigation or do st else
  getTotalItems(cart) {
    let count = 0;
    for (item of cart) {
      count += item.quantity;
    }

    return count;
  },
};
