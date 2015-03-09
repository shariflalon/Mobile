angular.module('jobmanager').run(function ($httpBackend) {

    $httpBackend.whenPOST('/devicelogin').respond(function (method, url, data) {
        var params = angular.fromJson(data);
        if (params.userName == 'sue@ann.com' && params.password == 'password') {
            var successData = {
                authenticated: true,
                msg: '',
                engineer_info: {
                    engineerId: 25,
                    companyId: 2,
                    engineerRef: 'EREF',
                    displayName: 'Sue Ann',
                    jobTitle: 'Sr Engineer',
                    engineerPhone: '+880121212121',
                    engineerEmail: 'sue@ann.com',
                    password: 'password'
                }
            };
            return [200, successData, {}];
        } else {
            var failureData = {
                authenticated: false,
                msg: 'Invalid credential',
            };
            return [200, failureData, {}];
        }
    });
    
    $httpBackend.whenPOST('/syncin').respond(function (method, url, data) {
        var params = angular.fromJson(data);
        if (params.userName == 'sue@ann.com' && params.password == 'password') {
            var successData = {
                authenticated: true,
                companies: [
                    {
                        companyId: 2,
                        companyRef: 'CREF',
                        companyName: 'EnViro Group LLC'
                    },
                    {
                        companyId: 3,
                        companyRef: 'CREF2',
                        companyName: 'Microsoft Inc'
                    }
                ],
                companyOrders: [
                    {
                        orderID: 35,
                        companyID: 2,
                        orderRef: 1,
                        orderName: 'Renovate Kitchen',
                        jobType: 'JType 1',
                        engineerID: 25,
                        customerId: 1,
                        customerName: 'Yummy Yummy',
                        onSiteContact: 'Jane Doe',
                        address1: 'Address 1',
                        address2: 'Address 2',
                        address3: 'Address 3',
                        address4: 'Address 4',
                        postCode: '1234',
                        orderedOn: '12 Jan 2015, 12:32',
                        orderedBy: 'Jane Doe',
                        jobDueDate: '18 Jan 2015, 12:32',
                        jobDetails: 'Job details information for the order.'
                    },
                    {
                        orderID: 36,
                        companyID: 3,
                        orderRef: 2,
                        orderName: 'Interior Design Contract',
                        jobType: 'JType 2',
                        engineerID: 25,
                        customerId: 2,
                        customerName: 'Steak House',
                        onSiteContact: 'Jane Doe',
                        address1: 'Address 1',
                        address2: 'Address 2',
                        address3: 'Address 3',
                        address4: 'Address 4',
                        postCode: '1234',
                        orderedOn: '12 Jan 2015, 12:32',
                        orderedBy: 'Jane Doe',
                        jobDueDate: '18 Jan 2015, 12:32',
                        jobDetails: 'Job details information for the order.'
                    },
                    {
                        orderID: 37,
                        companyID: 2,
                        orderRef: 1,
                        orderName: 'Finish Market Study',
                        jobType: 'JType 1',
                        engineerID: 25,
                        customerId: 3,
                        customerName: 'Western Grill',
                        onSiteContact: 'Jane Doe',
                        address1: 'Address 1',
                        address2: 'Address 2',
                        address3: 'Address 3',
                        address4: 'Address 4',
                        postCode: '1234',
                        orderedOn: '12 Jan 2015, 12:32',
                        orderedBy: 'Jane Doe',
                        jobDueDate: '18 Jan 2015, 12:32',
                        jobDetails: 'Job details information for the order.'
                    },
                    {
                        orderID: 38,
                        companyID: 2,
                        orderRef: 1,
                        orderName: 'Train Employee',
                        jobType: 'JType 1',
                        engineerID: 25,
                        customerId: 4,
                        customerName: 'Xinxian Chinese',
                        onSiteContact: 'Jane Doe',
                        address1: 'Address 1',
                        address2: 'Address 2',
                        address3: 'Address 3',
                        address4: 'Address 4',
                        postCode: '1234',
                        orderedOn: '12 Jan 2015, 12:32',
                        orderedBy: 'Jane Doe',
                        jobDueDate: '18 Jan 2015, 12:32',
                        jobDetails: 'Job details information for the order.'
                    }
                ]
            };
            return [200, successData, {}];
        } else {
            var failureData = {
                authenticated: false,
                msg: 'Invalid credential',
            };
            return [200, failureData, {}];
        }
    });

//    $httpBackend.whenGET(/\/games\/\d+/).respond(function (method, url, data) {
//        // parse the matching URL to pull out the id (/games/:id)
//        var gameid = url.split('/')[2];

//        var game = ServerDataModel.findOne(gameid);

//        return [200, game, {}];
//    });

//    // this is the creation of a new resource
//    $httpBackend.whenPOST('/games').respond(function (method, url, data) {
//        var params = angular.fromJson(data);

//        var game = ServerDataModel.addOne(params);

//        // get the id of the new resource to populate the Location field
//        var gameid = game.gameid;

//        return [201, game, { Location: '/games/' + gameid}];
//    });

//    // this is the update of an existing resource (ngResource does not send PUT for update)
//    $httpBackend.whenPOST(/\/games\/\d+/).respond(function (method, url, data) {
//        var params = angular.fromJson(data);

//        // parse the matching URL to pull out the id (/games/:id)
//        var gameid = url.split('/')[2];

//        var game = ServerDataModel.updateOne(gameid, params);

//        return [201, game, { Location: '/games/' + gameid}];
//    });

//    // this is the update of an existing resource (ngResource does not send PUT for update)
//    $httpBackend.whenDELETE(/\/games\/\d+/).respond(function (method, url, data) {
//        // parse the matching URL to pull out the id (/games/:id)
//        var gameid = url.split('/')[2];

//        ServerDataModel.deleteOne(gameid);

//        return [204, {}, {}];
//    });

    $httpBackend.whenGET(/templates\//).passThrough();

});