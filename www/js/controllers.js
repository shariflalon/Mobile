angular.module('jobmanager.controllers', [])
    .controller('SignInCtrl', function ($scope, $state, $ionicPopup, $ionicHistory, $loginService) {
        $scope.user = {};

        $scope.signIn = function (user) {
            var alertPopup;
            $loginService.login(user.username, user.password).then(function (data) {
                if (data.success) {
                    $ionicHistory.nextViewOptions({
                        disableAnimate: true,
                        disableBack: true
                    });
                    $state.go('tab.jobs');
                } else {
                    alertPopup = $ionicPopup.alert({
                        title: 'Login failed!',
                        template: data.msg
                    });
                }
            }, function (message) {
                alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: message
                });
            });
        };
    })
    .controller('SyncInCtrl', function ($scope, $state, $ionicPopup, $loginService, $syncService) {
        var alertPopup, currentUser,
            initialize = function () {
                console.log("initialization");
                $scope.company = "Comany data fectching...";
                $scope.order = "Order data fectching...";

                currentUser = $loginService.getCurrentUser();
                $syncService.syncIn(currentUser.user, currentUser.password).then(function (data) {
                    if (data.success) {
                        $scope.company = "Comany data synced";
                        $scope.order = "Order data synced";
                    } else {
                        alertPopup = $ionicPopup.alert({
                            title: 'Sync In failed!',
                            template: data.msg
                        });
                    }
                }, function (message) {
                    alertPopup = $ionicPopup.alert({
                        title: 'Sync In failed!',
                        template: message
                    });
                });
            };

        initialize();
    })
    .controller('JobsCtrl', function ($scope, jobs) {
        $scope.jobs = jobs;
    })
    .controller('JobDetailCtrl', function ($scope, $loginService, $ionicPopup, $companyOrder, job) {
        var dateNow = function () {
            var now = new Date(),
                dd = now.getDate(),
                mm = now.getMonth() + 1, //January is 0!
                yyyy = now.getFullYear();

            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            return mm + '/' + dd + '/' + yyyy;
        };

        $scope.job = job;
        $scope.activate = function (obj) {
            if (obj.job_started) {
                obj.job_completed = 1;
                obj.job_completed_on = dateNow();
                obj.job_completed_by = $loginService.getCurrentUser().display_name;
            } else {
                obj.job_started = 1;
                obj.job_started_on = dateNow();
                obj.job_started_by = $loginService.getCurrentUser().display_name;
            }

            $companyOrder.update(obj, job.id).then(function (result) {
                var alertPopup;
                if (result.rowsAffected) {
                    alertPopup = $ionicPopup.alert({
                        title: 'Success!',
                        template: "Status updated"
                    });
                }
            });
        };
    })
    .controller('JobSignatureCtrl', function ($scope, job, $ionicPopup, $companyOrder) {
        $scope.job = job;
       
        var canvas = document.getElementById('signatureCanvas');
        var signaturePad = new SignaturePad(canvas);
        signaturePad.fromDataURL(job.signature_data);

        ////        $scope.clearCanvas = function () {
        ////            signaturePad.clear();
        ////        }

        $scope.saveCanvas = function () {
            if (!signaturePad.isEmpty()) {
                var sigImg = signaturePad.toDataURL();
                var obj = { signature_data: sigImg };
                $companyOrder.update(obj, job.id).then(function (result) {
                    var alertPopup;
                    if (result.rowsAffected) {
                        alertPopup = $ionicPopup.alert({
                            title: 'Success!',
                            template: "Signature updated successfully"
                        });
                    }
                });
            }
            else {
                alertPopup = $ionicPopup.alert({
                    title: 'Warning!',
                    template: "Signature required"
                });
            }
            $scope.signature = sigImg;
        }
    })
    .controller('JobChecklistCtrl', function ($scope, $ionicPopup, $companyOrder, job) {
        $scope.ratings = ['0 stars', '1 stars', '2 stars', '3 stars', '4 stars'];

        $scope.job = {
            health_and_safety_check: !!job.health_and_safety_check,
            before_pics_check: !!job.before_pics_check,
            after_pics_check: !!job.after_pics_check,
            ppe_check: !!job.ppe_check,
            procedures_followed_check: !!job.procedures_followed_check,
            job_rating: job.job_rating
        };

        $scope.save = function (jobObj) {
            var obj = {
                health_and_safety_check: jobObj.health_and_safety_check ? 1 : 0,
                before_pics_check: jobObj.before_pics_check ? 1 : 0,
                after_pics_check: jobObj.after_pics_check ? 1 : 0,
                ppe_check: jobObj.ppe_check ? 1 : 0,
                procedures_followed_check: jobObj.procedures_followed_check ? 1 : 0,
                job_rating: jobObj.job_rating
            };
            $companyOrder.update(obj, job.id).then(function (result) {
                var alertPopup;
                if (result.rowsAffected) {
                    alertPopup = $ionicPopup.alert({
                        title: 'Success!',
                        template: "Checklist updated successfully"
                    });
                }
            });
        };
    })
    .controller('JobFeedbackDetailsCtrl', function ($scope, job) {
        $scope.job = job;
    })
    .controller('JobFeedbackCtrl', function ($scope, $stateParams, $ionicPopup, $companyOrder, job) {
        var typecomment = $stateParams.type == "customer" ? "Customer Note" : $stateParams.type == "internal" ? "Internal Notes" : "HVAC Notes";

        $scope.job = job;
        $scope.header = typecomment;

        $scope.save = function (comment) {
            var objc;
            if ($stateParams.type == "customer")
                objc = { customers_comments: comment };
            else if ($stateParams.type == "internal")
                objc = { engineers_notes: comment };
            else
                objc = { hvac_notes: comment };
            $companyOrder.update(objc, $stateParams.id).then(function (result) {
                var alertPopup;
                if (result.rowsAffected) {
                    alertPopup = $ionicPopup.alert({
                        title: 'Comment!',
                        template: "Comment Updated Successfully"
                    });
                }
            });
        };
    })
    .controller('SyncOutCtrl', function ($scope) {
    });