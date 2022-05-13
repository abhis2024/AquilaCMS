
const DesignControllers = angular.module('aq.design.controllers', []);

DesignControllers.controller('DesignHomeCtrl', ['$scope', '$http', 'toastService', 'designFactory', '$translate',
    function ($scope, $http, toastService, designFactory, $translate) {
        $scope.local = {
            customCSS   : '',
            allCssNames : [],
            currentCss  : ''
        };

       

        $http.get('/v2/themes/css').then((response) => {
            $scope.local.allCssNames = response.data;
            $scope.local.currentCss = response.data[0];
            $scope.loadNewCss();
        });


        $scope.loadNewCss = function ()  {
            designFactory.loadNewCss(
                { currentCss: $scope.local.currentCss },
                (response) => {
                    $scope.local.customCSS = (response.data).substring(0,20000);
                    setData(response.data)
                    document.getElementById('MyText').addEventListener("scroll", loadText)
                },
                (err) => {
                    toastService.toast('danger', err.data.message);
                }
            );
        };
        

        $scope.saveCss = function () {
            designFactory.saveCss(
                { currentCss: $scope.local.currentCss }, { datas: $scope.local.customCSS },
                (response) => {
                    toastService.toast('success', $translate.instant("design.designSaved"));
                },
                (err) => {
                    toastService.toast('danger', err.data.message);
                }
            );
        };
    }]);


let data;
let limit = 2
let timeout = null

function setData(_data){
    data=_data
}


function loadText(){
    if(timeout !== null) clearTimeout(timeout)
    timeout = setTimeout(function() {
        let elements = document.getElementsByClassName('MyText')[0];
        let scroll_percent = ((elements.scrollTop + elements.offsetHeight) / elements.scrollHeight * 100)
        if(scroll_percent > 70){
            if(data.length > (limit+1)*10000){
                elements.value = (elements.value) + data.substring(limit*10000,(limit+1)*10000)
                limit+=1
            } 
            else{
                elements.value = elements.val + data.substring(limit*10000,data.length)
            }
           
        }
    }, 300)
}