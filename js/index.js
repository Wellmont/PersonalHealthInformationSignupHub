(function() {

var app = angular.module('optc', [ 'ui.router', 'ui.bootstrap', 'ngSanitize' ]);

Utils.parseUnits(false);

/********************
 * GA Configuration *
 ********************/

app
    .run(function($rootScope, $location, $window, $state, $stateParams) {
        $rootScope.$on('$stateChangeSuccess',function(e) {
            $rootScope.currentState = $state.current.name;
            if (ga) ga('send', 'pageview', '/characters');
            var title = 'Team Pidgey Pokemon GO Database';
            if ($state.current.name == 'main.view')
                title = (window.units[parseInt($stateParams.id,10) - 1].name || '?') + ' | ' + title;
            window.document.title = title;
        });
    });


/*****************
 * Notifications *
 *****************/

var version = JSON.parse(localStorage.getItem('charVersion')) || 4;

if (version < 4) {
    localStorage.setItem('charVersion', JSON.stringify(4));
    setTimeout(function() {
        noty({
            text: 'Some stuff changed. Refreshing the page and/or clearing your browser\'s cache may be a smart idea.',
            timeout: 10000,
            type: 'error',
            layout: 'topRight',
            theme: 'relax'
        });
    },500);
}

/**************
 * Versioning *
 **************/

app
    .run(function($http) {
        $http.get('../common/data/version.js?ts=' + Date.now())
            .then(function(response) {
                var version = parseInt(response.data.match(/=\s*(\d+)/)[1],10);
                if (version <= window.dbVersion) return;
                noty({
                    text: 'New data detected. Please refresh the page.',
                    timeout: 5000,
                    type: 'success',
                    layout: 'topRight',
                    theme: 'relax'
                });
            });
    });

})();
