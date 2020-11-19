const express = require('express');
const router = express.Router();
const admin_model = require.main.require('./models/admin_model');

// Admin Index Page Render
router.get('/', (req, res) => {
  if (req.cookies['uname'] != null) {
    var admininfo = {
      email: req.cookies['uname'],
    };

    admin_model.getByEmail(admininfo, function (results) {
      res.render('admin/index', { admininfo: results });
    });
  } else {
    res.redirect('/');
  }
});

// Change Password Page Render
router.get('/change_password', (req, res) => {
  if (req.cookies['uname'] != null) {
    res.render('admin/admin-chnage-password');
  } else {
    res.redirect('/');
  }
});

// View All Customers Page Render
router.get('/all_customers', (req, res) => {
  if (req.cookies['uname'] != null) {
    var admininfo = {
      email: req.cookies['uname'],
    };
    admin_model.getByEmail(admininfo, function (results) {
      admin_model.getAllCustomers(admininfo, function (results2) {
        res.render('admin/all-customers', {
          admininfo: results,
          customersInfo: results2,
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

// Add New Customer Page Render
router.get('/add_new_customer', (req, res) => {
  if (req.cookies['uname'] != null) {
    var admininfo = {
      email: req.cookies['uname'],
    };
    admin_model.getByEmail(admininfo, function (results) {
      res.render('admin/add-new-customer', { admininfo: results });
    });
  } else {
    res.redirect('/');
  }
});

// Add New Customer-->POST
router.post('/add_new_customer', (req, res) => {
  var user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    address: req.body.address,
    registration_date: new Date().toLocaleDateString(),
    store: req.cookies['uname'],
    cpassword: req.body.cpassword,
  };
  if (user.password === user.cpassword) {
    admin_model.insert(user, function (status) {
      if (status) {
        res.redirect('/admin/all_customers');
      } else {
        res.send(user);
      }
    });
  } else {
    res.send(
      ' <script>alerCustomert("Password Not Match"); window.location.href ="/admin/add_new_customer";</script>'
    );
  }
});

// Manage Customer Page Render
router.get('/manage_customer', (req, res) => {
  if (req.cookies['uname'] != null) {
    var admininfo = {
      email: req.cookies['uname'],
    };
    admin_model.getByEmail(admininfo, function (results) {
      admin_model.getAllCustomers(admininfo, function (results2) {
        res.render('admin/manage-customer', {
          admininfo: results,
          customersInfo: results2,
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

// Edit Customer Page Render
router.get('/edit_customer/:id', (req, res) => {
  if (req.cookies['uname'] != null) {
    var admininfo = {
      email: req.cookies['uname'],
    };
    var customersInfo = {
      id: req.params.id,
    };
    admin_model.getById(customersInfo, function (results) {
      admin_model.getByEmail(admininfo, function (results2) {
        res.render('admin/edit-customer', {
          customersInfo: results,
          admininfo: results2,
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

// Edit Customer-->POST
router.post('/edit_customer/:id', (req, res) => {
  var customersInfo = {
    id: req.params.id,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    registration_date: new Date().toLocaleDateString(),
  };
  admin_model.update(customersInfo, function (status) {
    if (status) {
      res.redirect('/admin/manage_customer');
    } else {
      res.send('Not Update');
    }
  });
});

// Delete Customer--GET
router.get('/delete_customer/:id', (req, res) => {
  if (req.cookies['uname'] != null) {
    var customersInfo = {
      id: req.params.id,
    };
    var admininfo = {
      email: req.cookies['uname'],
    };
    admin_model.getById(customersInfo, function (results) {
      admin_model.getByEmail(admininfo, function (results2) {
        res.render('admin/delete-customer', {
          customersInfo: results,
          admininfo: results2,
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

// Delete Customer--POST
router.post('/delete_customer/:id', (req, res) => {
  var customersInfo = {
    id: req.params.id,
  };
  admin_model.delete(customersInfo, function (status) {
    if (status) {
      res.redirect('/admin/manage_customer');
    } else {
      res.send('Delete failed');
    }
  });
});

// All Orders--GET
router.get('/all_orders', (req, res) => {
  if (req.cookies['uname'] != null) {
    var admininfo = {
      email: req.cookies['uname'],
    };
    admin_model.getAllOrder(admininfo, function (results) {
      admin_model.getByEmail(admininfo, function (results2) {
        res.render('admin/all-orders', {
          orders: results,
          admininfo: results2,
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

// Pending Orders--GET
router.get('/pending_orders', (req, res) => {
  if (req.cookies['uname'] != null) {
    var admininfo = {
      email: req.cookies['uname'],
      status: 'Pending',
    };
    admin_model.getPendingOrder(admininfo, function (results) {
      admin_model.getByEmail(admininfo, function (results2) {
        res.render('admin/pending-orders', {
          orders: results,
          admininfo: results2,
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

// Edit Orders Page Render
router.get('/edit_orders/:id', (req, res) => {
  if (req.cookies['uname'] != null) {
    var admininfo = {
      email: req.cookies['uname'],
      status: 'Pending',
      id: req.params.id,
    };
    admin_model.getPendingOrderById(admininfo, function (results) {
      admin_model.getByEmail(admininfo, function (results2) {
        res.render('admin/edit-orders', {
          orders: results,
          admininfo: results2,
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

// Edit Orders--POST
router.post('/edit_orders/:id', (req, res) => {
  var orderInfo = {
    id: req.params.id,
    email: req.cookies['uname'],
    last_update: new Date().toLocaleDateString(),
    status: req.body.status,
  };
  admin_model.updateOrder(orderInfo, function (status) {
    if (status) {
      res.redirect('/admin/pending_orders');
    } else {
      res.send('Not Update');
    }
  });
});

// Delivered Orders--GET
router.get('/delivered_orders', (req, res) => {
  if (req.cookies['uname'] != null) {
    var admininfo = {
      email: req.cookies['uname'],
      status: 'Delivered',
    };
    admin_model.getPendingOrder(admininfo, function (results) {
      admin_model.getByEmail(admininfo, function (results2) {
        res.render('admin/delivered-orders', {
          orders: results,
          admininfo: results2,
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

// Delete Delivered Orders--GET
router.get('/delete_delivered_order/:id', (req, res) => {
  if (req.cookies['uname'] != null) {
    var orderInfo = {
      id: req.params.id,
    };
    var admininfo = {
      email: req.cookies['uname'],
    };
    admin_model.getOrderById(orderInfo, function (results) {
      admin_model.getByEmail(admininfo, function (results2) {
        res.render('admin/delete-delivered-order', {
          orderInfo: results,
          admininfo: results2,
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

// Delete Delivered Orders--POST
router.post('/delete_delivered_order/:id', (req, res) => {
  var customersInfo = {
    id: req.params.id,
  };
  admin_model.deleteOrder(customersInfo, function (status) {
    if (status) {
      res.redirect('/admin/delivered_orders');
    } else {
      res.send('Delete failed');
    }
  });
});

// In Process Orders-->GET
router.get('/in_process_orders', (req, res) => {
  if (req.cookies['uname'] != null) {
    var admininfo = {
      email: req.cookies['uname'],
      status: 'In Process',
    };
    admin_model.getPendingOrder(admininfo, function (results) {
      admin_model.getByEmail(admininfo, function (results2) {
        res.render('admin/in-process-orders', {
          orders: results,
          admininfo: results2,
        });
      });
    });
  } else {
    res.redirect('/');
  }
});
// In Process Orders Edit-->GET
router.get('/edit_orders_in_process/:id', (req, res) => {
  if (req.cookies['uname'] != null) {
    var admininfo = {
      email: req.cookies['uname'],
      status: 'In Process',
      id: req.params.id,
    };
    admin_model.getPendingOrderById(admininfo, function (results) {
      admin_model.getByEmail(admininfo, function (results2) {
        res.render('admin/edit-orders', {
          orders: results,
          admininfo: results2,
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

// Edit Orders--POST
router.post('/edit_orders_in_process/:id', (req, res) => {
  var orderInfo = {
    id: req.params.id,
    email: req.cookies['uname'],
    last_update: new Date().toLocaleDateString(),
    status: req.body.status,
  };
  admin_model.updateOrder(orderInfo, function (status) {
    if (status) {
      res.redirect('/admin/in_process_orders');
    } else {
      res.send('Not Update');
    }
  });
});

// All Categories-->GET
router.get('/all_categories', (req, res) => {
  if (req.cookies['uname'] != null) {
    var admininfo = {
      email: req.cookies['uname'],
    };
    admin_model.getAllCategory(admininfo, function (results) {
      admin_model.getByEmail(admininfo, function (results2) {
        res.render('admin/all-categories', {
          category: results,
          admininfo: results2,
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

// All Sub-Categories-->GET
router.get('/all_sub_categories', (req, res) => {
  if (req.cookies['uname'] != null) {
    var admininfo = {
      email: req.cookies['uname'],
    };
    admin_model.getAllSubCategory(admininfo, function (results) {
      admin_model.getByEmail(admininfo, function (results2) {
        res.render('admin/all-sub-categories', {
          subcategory: results,
          admininfo: results2,
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

// Create Category-->GET
router.get('/add_category', (req, res) => {
  if (req.cookies['uname'] != null) {
    var admininfo = {
      email: req.cookies['uname'],
    };
    admin_model.getByEmail(admininfo, function (results) {
      res.render('admin/add-category', { admininfo: results });
    });
  } else {
    res.redirect('/');
  }
});

// Create Category-->POST
router.post('/add_category', (req, res) => {
  var category = {
    category_name: req.body.category_name,
    drescription: req.body.category_name,
    creation_date: new Date().toLocaleDateString(),
    store: req.cookies['uname'],
  };
  admin_model.insertCategory(category, function (status) {
    if (status) {
      res.redirect('/admin/all_categories');
    } else {
      res.send(user);
    }
  });
});

// Create SubCategory-->GET
router.get('/add_sub_category', (req, res) => {
  if (req.cookies['uname'] != null) {
    var admininfo = {
      email: req.cookies['uname'],
    };
    admin_model.getByEmail(admininfo, function (results) {
      admin_model.getAllCategory(admininfo, function (results2) {
        res.render('admin/add-sub-category', {
          admininfo: results,
          category: results2,
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

// Create SubCategory-->POST
router.post('/add_sub_category', (req, res) => {
  var category = {
    category: req.body.category,
    sub_category: req.body.sub_category,
    creation_date: new Date().toLocaleDateString(),
    store: req.cookies['uname'],
  };
  admin_model.insertSubCategory(category, function (status) {
    if (status) {
      res.redirect('/admin/all_sub_categories');
    } else {
      res.send(user);
    }
  });
});

// Edit Category--GET
router.get('/edit_category/:id', (req, res) => {
  if (req.cookies['uname'] != null) {
    var admininfo = {
      email: req.cookies['uname'],
      id: req.params.id,
    };
    admin_model.getSubCategoryById(admininfo, function (results) {
      admin_model.getByEmail(admininfo, function (results2) {
        res.render('admin/edit-category', {
          category: results,
          admininfo: results2,
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

// Edit Category--POST
router.post('/edit_category/:id', (req, res) => {
  var category = {
    category_name: req.body.category_name,
    category_drescription: req.body.category_drescription,
    id: req.params.id,
    email: req.cookies['uname'],
    last_update: new Date().toLocaleDateString(),
  };
  admin_model.updateCategory(category, function (status) {
    if (status) {
      res.redirect('/admin/all_categories');
    } else {
      res.send('Not Update');
    }
  });
});
// Delete Category--GET
router.get('/delete_category/:id', (req, res) => {
  if (req.cookies['uname'] != null) {
    var admininfo = {
      email: req.cookies['uname'],
      id: req.params.id,
    };
    admin_model.getCategoryById(admininfo, function (results) {
      admin_model.getByEmail(admininfo, function (results2) {
        res.render('admin/delete-category', {
          category: results,
          admininfo: results2,
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

// Delete Category--POST
router.post('/delete_category/:id', (req, res) => {
  var category = {
    id: req.params.id,
  };
  admin_model.deleteCategory(category, function (status) {
    if (status) {
      res.redirect('/admin/all_categories');
    } else {
      res.send('Delete failed');
    }
  });
});

// Edit Sub-Category--GET
router.get('/edit_sub_category/:id', (req, res) => {
  if (req.cookies['uname'] != null) {
    var admininfo = {
      email: req.cookies['uname'],
      id: req.params.id,
    };
    admin_model.getSubCategoryById(admininfo, function (results) {
      admin_model.getByEmail(admininfo, function (results2) {
        admin_model.getAllCategory(admininfo, function (results3) {
          res.render('admin/edit-sub-category', {
            category: results,
            admininfo: results2,
            allcategory: results3,
          });
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

// Edit Sub-Category--POST
router.post('/edit_sub_category/:id', (req, res) => {
  var category = {
    category: req.body.category,
    sub_category_name: req.body.sub_category_name,
    id: req.params.id,
    email: req.cookies['uname'],
    last_update: new Date().toLocaleDateString(),
  };
  admin_model.updateSubCategory(category, function (status) {
    if (status) {
      res.redirect('/admin/all_sub_categories');
    } else {
      res.send('Not Update');
    }
  });
});

// Delete Sub-Category--GET
router.get('/delete_sub_category/:id', (req, res) => {
  if (req.cookies['uname'] != null) {
    var admininfo = {
      email: req.cookies['uname'],
      id: req.params.id,
    };
    admin_model.getSubCategoryById(admininfo, function (results) {
      admin_model.getByEmail(admininfo, function (results2) {
        res.render('admin/delete-sub-category', {
          category: results,
          admininfo: results2,
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

// Delete Sub-Category--POST
router.post('/delete_sub_category/:id', (req, res) => {
  var category = {
    id: req.params.id,
  };
  admin_model.deleteSubCategory(category, function (status) {
    if (status) {
      res.redirect('/admin/all_sub_categories');
    } else {
      res.send('Delete failed');
    }
  });
});

module.exports = router;
