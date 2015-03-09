angular.module('jobmanager.controllers', []);
angular.module('jobmanager.services', ['jobmanager.config']);

angular.module('jobmanager', ['ionic', 'ngMockE2E', 'ngCordova', 'jobmanager.controllers', 'jobmanager.services'])
    .run(function($ionicPlatform, $cordovaSplashscreen) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            //setTimeout(function () {
            //    $cordovaSplashscreen.hide();
            //}, 5000);
        });
    })
    .run(function($db) {
        $db.init();
    })
    .run(function($rootScope, $state, $ionicHistory, $loginService) {
        //var redirect = function(state, event) {
        //    if (event) event.preventDefault();
        //    $ionicHistory.nextViewOptions({
        //        disableAnimate: true,
        //        disableBack: true
        //    });
        //    $state.go(state);
        //};
        $rootScope.$on("$stateChangeStart", function(event, next, current) {
            if (next.name === 'signout') {
                event.preventDefault();
                $loginService.logout();
            }
            if (next.module === 'private' && !$loginService.isLoggedIn()) {
                //redirect.call(this, 'signin', current.name ? event : null);
                if (current.name) event.preventDefault();
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                $state.go('signin');
            } else if (next.module === 'public' && $loginService.isLoggedIn()) {
                //redirect.call(this, 'tab.jobs', current.name ? event : null);
                if (current.name) event.preventDefault();
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                $state.go('tab.jobs');
            }
        });
    })
    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('signin', {
                url: '/sign-in',
                templateUrl: 'templates/sign-in.html',
                controller: 'SignInCtrl',
                module: 'public'
            })
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html",
                module: 'private'
            })
            .state('tab.jobs', {
                url: '/jobs',
                views: {
                    'tab-jobs': {
                        templateUrl: 'templates/tab-jobs.html',
                        controller: 'JobsCtrl',
                        resolve: {
                            jobs: function($companyOrder) {
                                return $companyOrder.all();
                            }
                        }
                    }
                },
                module: 'private'
            })
            .state('tab.jobs-detail', {
                url: '/jobs/:id',
                views: {
                    'tab-jobs': {
                        templateUrl: 'templates/job-detail.html',
                        controller: 'JobDetailCtrl',
                        resolve: {
                            job: function($stateParams, $companyOrder) {
                                return $companyOrder.getById($stateParams.id);
                            }
                        }
                    }
                }
            })
            .state('tab.jobs-signature', {
                url: '/jobs/:id/signature',
                views: {
                    'tab-jobs': {
                        templateUrl: 'templates/job-signature.html',
                        controller: 'JobSignatureCtrl',
                        resolve: {
                            job: function($stateParams, $companyOrder) {
                                return $companyOrder.getById($stateParams.id);
                            }
                        }
                    }
                }
            })
            .state('tab.jobs-checklist', {
                url: '/jobs/:id/checklist',
                views: {
                    'tab-jobs': {
                        templateUrl: 'templates/job-checklist.html',
                        controller: 'JobChecklistCtrl',
                        resolve: {
                            job: function($stateParams, $companyOrder) {
                                return $companyOrder.getById($stateParams.id);
                            }
                        }
                    }
                }
            })
            .state('tab.jobs-feedbackdetails', {
                url: '/jobs/:id/feedbackdetails',
                views: {
                    'tab-jobs': {
                        templateUrl: 'templates/job-feedbackdetail.html',
                        controller: 'JobFeedbackDetailsCtrl',
                        resolve: {
                            job: function($stateParams, $companyOrder) {
                                return $companyOrder.getById($stateParams.id);
                            }
                        }
                    }
                }
            })
            .state('tab.jobs-feedback', {
                url: '/jobs/:id/feedback/:type',
                views: {
                    'tab-jobs': {
                        templateUrl: 'templates/job-feedback.html',
                        controller: 'JobFeedbackCtrl',
                        resolve: {
                            job: function($stateParams, $companyOrder) {
                                return $companyOrder.getById($stateParams.id);
                            }
                        }
                    }
                }
            })
            .state('tab.syncin', {
                url: '/syncin',
                views: {
                    'tab-sync-in': {
                        templateUrl: 'templates/tab-sync-in.html',
                        controller: 'SyncInCtrl'
                    }
                },
                module: 'private'
            })
            .state('tab.syncout', {
                url: '/syncout',
                views: {
                    'tab-sync-out': {
                        templateUrl: 'templates/tab-sync-out.html',
                        controller: 'SyncOutCtrl'
                    }
                },
                module: 'private'
            })
            .state('signout', {
                url: '/sign-out',
                controller: function() {
                },
                module: 'private'
            });
        $urlRouterProvider.otherwise('/sign-in');
    });
