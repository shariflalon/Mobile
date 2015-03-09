var serivices = angular.module('jobmanager.services');

serivices
//Login service
    .service('$loginService', function ($q, $http, $window, $companyEngineer) {
        var loginFromWebApp = function (name, pw) {
            var deferred = $q.defer();
            $http.post('/devicelogin', { userName: name, password: pw })
                .success(function (data) {
                    if (data.authenticated) {
                        deferred.resolve({ success: true, data: data.engineer_info });
                    } else {
                        deferred.resolve({ success: false, msg: data.msg });
                    }
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };

        return {
            login: function (name, pw) {
                var deferred = $q.defer();

                $companyEngineer.hasRecord().then(function (hasRecord) {
                    if (hasRecord) {
                        $companyEngineer.login(name, pw).then(function (result) {
                            if (result.length) {
                                $window.localStorage.setItem("loggedInUser", angular.toJson({ user: name, password: pw, displayName: result[0].display_name }));
                                deferred.resolve({ success: true });
                            } else {
                                deferred.resolve({ success: false, msg: "Invalid username or password" });
                            }
                        }, function (error) {
                            deferred.reject(error);
                        });
                    } else {
                        loginFromWebApp(name, pw).then(function (result) {
                            var engInfo;
                            if (result.success) {
                                engInfo = $companyEngineer.convert(result.data);

                                $companyEngineer.insert(engInfo).then(function () {
                                    $window.localStorage.setItem("loggedInUser", angular.toJson({ user: name, password: pw, displayName: engInfo.display_name }));
                                    deferred.resolve({ success: true });
                                }, function (msg) {
                                    deferred.reject(msg);
                                });
                            } else {
                                deferred.resolve({ success: false, msg: data.msg });
                            }
                        }, function (error) {
                            deferred.reject(error);
                        });
                    }
                });

                return deferred.promise;
            },
            isLoggedIn: function () {
                var loggedIn = !(window.localStorage.getItem("loggedInUser") === "undefined" || window.localStorage.getItem("loggedInUser") === null);
                return loggedIn;
            },
            getCurrentUser: function () {
                return angular.fromJson(window.localStorage.getItem("loggedInUser"));
            },
            logout: function () {
                return localStorage.removeItem("loggedInUser");
            }
        };
    })
    .service('$syncService', function ($q, $http, $company, $companyOrder) {

        return {
            syncIn: function (name, pw) {
                var deferred = $q.defer();
                $http.post('/syncin', { userName: name, password: pw })
                    .success(function (data) {
                        if (data.authenticated) {
                            angular.forEach(data.companies, function (company) {
                                $company.insert($company.convert(company));
                            });
                            angular.forEach(data.companyOrders, function (companyOrder) {
                                $companyOrder.insert($companyOrder.convert(companyOrder));
                            });
                            deferred.resolve({ success: true });
                        } else {
                            deferred.resolve({ success: false, msg: data.msg });
                        }
                    })
                    .error(function () {
                        deferred.reject("connection issue");
                    });
                return deferred.promise;
            }
        };
    })
    .factory('$companyEngineer', function ($q, $db) {
        var self = this;

        self.convert = function (engineerInfo) {
            return {
                id: engineerInfo.engineerId,
                company_id: engineerInfo.companyId,
                engineer_ref: engineerInfo.engineerRef,
                display_name: engineerInfo.displayName,
                job_title: engineerInfo.jobTitle,
                engineer_phone: engineerInfo.engineerPhone,
                engineer_email: engineerInfo.engineerEmail,
                password: engineerInfo.password
            };
        };

        self.all = function () {
            return $db.query('SELECT * FROM company_engineers')
                .then(function (result) {
                    return $db.fetchAll(result);
                });
        };

        self.hasRecord = function () {
            return $db.query('SELECT COUNT(*) count FROM company_engineers')
                .then(function (result) {
                    return $db.fetch(result).count > 0;
                });
        };

        self.login = function (name, pw) {
            return $db.query('SELECT * FROM company_engineers WHERE engineer_email = ? AND password = ?', [name, pw])
                .then(function (result) {
                    return $db.fetchAll(result);
                });
        };

        self.insert = function (obj) {
            return $db.insert('company_engineers', obj)
                .then(function (result) {
                    console.log("engineer inserted: " + result.insertId);
                });
        };

        return self;
    })
    .factory('$company', function ($q, $db) {
        var self = this;

        self.convert = function (companyInfo) {
            return {
                id: companyInfo.companyId,
                company_ref: companyInfo.companyRef,
                name: companyInfo.companyName
            };
        };

        self.all = function () {
            return $db.query('SELECT * FROM companyies')
                .then(function (result) {
                    return $db.fetchAll(result);
                });
        };

        self.getById = function (id) {
            return $db.query('SELECT * FROM companies WHERE id = ?', [id])
                .then(function (result) {
                    return $db.fetch(result);
                });
        };

        self.insert = function (obj) {
            return $db.insert('companies', obj)
                .then(function (result) {
                    console.log("company inserted: " + result.insertId);
                });
        };

        return self;
    })
    .factory('$companyOrder', function ($q, $db) {
        var self = this;

        self.convert = function (orderInfo) {
            return {
                id: orderInfo.orderID,
                company_id: orderInfo.companyID,
                order_ref: orderInfo.orderRef,
                order_name: orderInfo.orderName,
                job_type: orderInfo.jobType,
                engineer_id: orderInfo.engineerID,
                customer_id: orderInfo.customerId,
                customer_name: orderInfo.customerName,
                onsite_contact: orderInfo.onSiteContact,
                address1: orderInfo.address1,
                address2: orderInfo.address2,
                address3: orderInfo.address3,
                address4: orderInfo.address4,
                post_code: orderInfo.postCode,
                order_on: orderInfo.orderedOn,
                order_by: orderInfo.orderedBy,
                job_due_date: orderInfo.jobDueDate,
                job_details: orderInfo.jobDetails
            };
        };

        self.all = function () {
            return $db.query('SELECT * FROM company_orders')
                .then(function (result) {
                    return $db.fetchAll(result);
                });
        };

        self.getById = function (id) {
            return $db.query('SELECT * FROM company_orders WHERE id = ?', [id])
                .then(function (result) {
                    return $db.fetch(result);
                });
        };

        self.insert = function (obj) {
            return $db.insert('company_orders', obj)
                .then(function (result) {
                    console.log("order inserted: " + result.insertId);
                });
        };

        self.update = function (obj, id) {
            return $db.update('company_orders', obj, id)
                .then(function (result) {
                    console.log("order updated: " + id);
                    return result;
                });
        };

        return self;
    });
