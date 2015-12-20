'use strict';
angular.module('nacaAirfoilApp')
  .controller('AppCtrl', function ($scope, $rootScope, $routeParams) {
  	$scope.a 	=	[0.2969, -0.1260, -0.3516, 0.2843, -0.1015];
  	$scope.closedTrailingEdge 	=	true;
 	$scope.naca 	=	'4412';
 	$scope.numberOfPoints 	=	250;
 	$scope.cosineSpacing 	=	true;

 	$scope.showInfo 	=	function(){
 		alert('Hi, feel free to use this script! Have a nice day!');
 	}

 	$scope.exportTable    =   function($type){
        var $htmlId     =   '#airfoil-dat-export';
        $($htmlId).show();
        switch($type) {
            case 'json':
                $($htmlId).tableExport({type:'json',escape:'false'});
                break;
            case 'xml':
                $($htmlId).tableExport({type:'xml',escape:'false'});
                break;
            case 'sql':
                $($htmlId).tableExport({type:'sql',escape:'false'});
                break;
            case 'csv':
                $($htmlId).tableExport({type:'csv',escape:'false'});
                break;
            case 'txt':
                $($htmlId).tableExport({type:'txt',escape:'false'});
                break;
            case 'excel':
                $($htmlId).tableExport({type:'excel',escape:'false'});
                break;
            case 'pdf':
                $($htmlId).tableExport({type:'pdf',pdfFontSize:'10',escape:'false'});
                break;
            default:
                break;
        }
        $($htmlId).hide();
        return;
    };

 	$scope.plotAirfoil 	=	function(){
 		$scope.calculating 	=	true;
 		$scope.numberOfPoints  = ($scope.numberOfPoints > 500 || $scope.numberOfPoints < 50) ? 120 : $scope.numberOfPoints;
 		$scope.datapoints 	=	[];
 		$scope.points 	=	[];
 		if ($scope.closedTrailingEdge) {
	  		$scope.a[4]	=	-0.1036;
	  	}

	 	$scope.p 	=	parseInt($scope.naca.charAt(0))/100; //
	 	$scope.m 	=	parseInt($scope.naca.charAt(1))/10;
	 	$scope.t 	=	parseInt($scope.naca.substring(2,4))/100;
	 	$scope.x 	=	[];
	 	if ($scope.cosineSpacing) {
	    	$scope.beta 	=	numeric.linspace(0, Math.PI, $scope.numberOfPoints);
	    	for (var i = 0; i < $scope.numberOfPoints; i++) {
	    		$scope.x[i] =	0.5 * (1 - Math.cos($scope.beta[i]));
	    	};
	 	} else{
	 		$scope.x 	=	numeric.linspace(0,1,$scope.numberOfPoints);
	 	}
	 	
	 	$scope.y 	=	[];
	 	$scope.z 	=	[];

	 	for (var i = 0; i < $scope.numberOfPoints; i++) {
	 		var x 	=	$scope.x[i];
	 		$scope.y[i]	=	($scope.t/0.2) * ($scope.a[0]*Math.sqrt(x) + $scope.a[1]*x + $scope.a[2] * Math.pow(x, 2) + $scope.a[3] * Math.pow(x, 3) + $scope.a[4] * Math.pow(x, 4));
	 	};
	 	
	 	if ($scope.m === 0) {
	 		for (var i = 0; i < $scope.numberOfPoints; i++) {
		 		$scope.z[i]	=	- $scope.y[i];
		 	};
		 	for (var i = 0; i < $scope.numberOfPoints; i++) {
		  		$scope.datapoints.push({
		  			"x":$scope.x[i],
		  			"upper":$scope.y[i],
		  		}, {
		  			"x":$scope.x[i],
		  			"lower":$scope.z[i],
		  		},{
		  			"x":$scope.x[i],
		  			"zero": 0,
		  		});
		  		$scope.points.push({x: $scope.x[i], y: $scope.y[i]});
		  		$scope.points.push({x: $scope.x[i], y: $scope.z[i]});
		  	};
	 	} else{
	 		var xc1 = [],
	 			xc2 = [],
	 			xc  = [],
	 			yc1	= [],
	 			yc2 = [],
	 			zc  = [],
	 			dyc1_dx = [],
	 			dyc2_dx = [],
	 			dyc_dx = [],
	 			theta = [], 
	 			xu = [],
	 			yu = [],
	 			xl = [],
	 			yl = [];

	 		for (var i = 0; i < $scope.numberOfPoints; i++) {
	 			if ($scope.x[i] > $scope.m) {
	 				xc2.push($scope.x[i]);
	 			} else {
	 				xc1.push($scope.x[i]);
	 			};
	 		}
	 		xc 	=	xc1.concat(xc2);
	 		for (var i = 0; i < xc1.length; i++) {
	 			yc1[i] = ($scope.p / Math.pow($scope.m, 2)) * (2*$scope.m*xc1[i] - Math.pow(xc1[i], 2));
	 			dyc1_dx[i] = ($scope.p / Math.pow($scope.m, 2))*(2*$scope.m - 2*xc1[i]);
	 		};
	 		for (var i = 0; i < xc2.length; i++) {
	 			yc2[i]	=	($scope.p / Math.pow(1 - $scope.m, 2)) * ((1-2*$scope.m) + 2*$scope.m*xc2[i] - Math.pow(xc2[i], 2));
	 			dyc2_dx[i] =  ($scope.p / Math.pow(1 - $scope.m, 2))*(2*$scope.m-2*xc2[i]);
	 		};
	 		zc 	=	yc1.concat(yc2);
	 		dyc_dx = dyc1_dx.concat(dyc2_dx);
	 		for (var i = 0; i < dyc_dx.length; i++) {
	 			theta[i] = Math.atan(dyc_dx[i]);
	 			xu[i] = $scope.x[i] - $scope.y[i] * Math.sin(theta[i]);
	 			yu[i] = zc[i] + $scope.y[i] * Math.cos(theta[i]);

	 			xl[i] = $scope.x[i] + $scope.y[i] * Math.sin(theta[i]);
	 			yl[i] = zc[i] - $scope.y[i] * Math.cos(theta[i]);

	 			
	 		};
	 		for (var i = 0; i < $scope.numberOfPoints; i++) {
	 			$scope.datapoints.push({
		  			"x":xu[$scope.numberOfPoints - i],
		  			"upper":yu[$scope.numberOfPoints - i],
		  		}, {
		  			"x":xl[i],
		  			"lower":yl[i],
		  		}, {
		  			"x":xl[i],
		  			"zero": 0,
		  		});
		  		$scope.points.push({x: xu[$scope.numberOfPoints - i], y: yu[$scope.numberOfPoints - i]});
		  		$scope.points.push({x: xl[i], y: yl[i]});
	 		};
	 	}
	    $scope.datacolumns=[
	    	{"id":"upper","type":"line","name":"Upper","color":"green"},
	    	{"id":"lower","type":"line","name":"Lower","color":"blue"},
	    	{"id":"zero","type":"line","name":"zero","color":"grey"}
	    ];
	    $scope.datax={"id":"x"};
	    $scope.calculating 	=	false;
 	}
 	$scope.plotAirfoil();
  });
