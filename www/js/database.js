var serivices = angular.module('jobmanager.services');

serivices
    .factory('$db', function($q, dbConfig) {
        var self = this;
        self.db = null;

        self.init = function() {
            // Use self.db = window.sqlitePlugin.openDatabase({name: dbConfig.name}); in production
            self.db = window.openDatabase(dbConfig.name, '1.0', 'database', -1);

            angular.forEach(dbConfig.tables, function(table) {
                var columns = [];

                angular.forEach(table.columns, function(column) {
                    columns.push(column.name + ' ' + column.type);
                });

                var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
                self.query(query);
                console.log('Table ' + table.name + ' initialized');
            });
        };

        self.query = function(query, bindings) {
            bindings = typeof bindings !== 'undefined' ? bindings : [];
            var deferred = $q.defer();

            self.db.transaction(function(transaction) {
                transaction.executeSql(query, bindings, function(t1, result) {
                    deferred.resolve(result);
                }, function(t2, error) {
                    console.log(error);
                    deferred.reject(error);
                });
            });

            return deferred.promise;
        };

        self.fetchAll = function(result) {
            var output = [];
            for (var i = 0; i < result.rows.length; i++) {
                output.push(result.rows.item(i));
            }
            return output;
        };

        self.fetch = function(result) {
            return result.rows.item(0);
        };

        self.insert = function(table, obj) {
            var deferred = $q.defer();

            self.db.transaction(function(transaction) {
                var cols = [], ph = [], bindings = [], query = '';
                _.each(obj, function(v, k) {
                    cols.push(k);
                    bindings.push(v);
                    ph.push('?');
                });
                query = 'INSERT OR REPLACE INTO ' + table + ' (' + cols.join(',') + ') VALUES (' + ph.join(', ') + ')';

                transaction.executeSql(query, bindings, function(t1, result) {
                    deferred.resolve(result);
                }, function(t2, error) {
                    console.log(error);
                    deferred.reject(error);
                });
            });
            return deferred.promise;
        };


        self.update = function(table, obj, id) {
            var deferred = $q.defer();

            self.db.transaction(function(transaction) {
                var bindings = [], updates = _.map(obj, function(v, k) {
                    bindings.push(v);
                    return k + ' = ' + '?';
                }).join(),
                    query = "UPDATE " + table + " SET " + updates + " WHERE id = ?";

                bindings.push(id);
                transaction.executeSql(query, bindings, function(t1, result) {
                    deferred.resolve(result);
                }, function(t2, error) {
                    console.log(error);
                    deferred.reject(error);
                });
            });
            return deferred.promise;
        };

        return self;
    });