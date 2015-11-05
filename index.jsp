
<%--
     Licensed to the Apache Software Foundation (ASF) under one
     or more contributor license agreements.  See the NOTICE file
     distributed with this work for additional information
     regarding copyright ownership.  The ASF licenses this file
     to you under the Apache License, Version 2.0 (the
     "License"); you may not use this file except in compliance
     with the License.  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

     Unless required by applicable law or agreed to in writing,
     software distributed under the License is distributed on an
     "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
     KIND, either express or implied.  See the License for the
     specific language governing permissions and limitations
     under the License.
     --%><%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<c:if test="${!empty cookie.lang}">
    <fmt:setLocale value="${cookie.lang.value}" />
</c:if>
<fmt:setBundle basename="resources/messages"/>
<% long now = System.currentTimeMillis(); %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
          "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" ng-app="cloudstack">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="initial-scale=1">
        <title></title>
        <link rel="stylesheet" href="newcss/lib/font-awesome.css">
        <link rel="stylesheet" href="newcss/lib/angular-material.css">
        <link rel="stylesheet" href="newcss/lib/md-data-table.css">
        <link rel="stylesheet" href="newcss/cloudstack.css">
    </head>
    <body ng-controller="BaseCtrl" layout="row">
          <md-sidenav class="md-sidenav-left md-whiteframe-z2" md-component-id="left" md-is-locked-open="$mdMedia('gt-md')" ng-include="'views/sidenav.html'"></md-sidenav>

          <div tabindex="-1" role="main" layout="column" id="main-container" flex>
            
            <md-toolbar ng-include="'views/header.html'"></md-toolbar>
            
            <md-content md-scroll-y="" class="md-default-theme" flex layout-padding>
              <div ui-view layout-padding></div>
            </md-content>
          </div>

          <script src="newjs/lib/angular.js"></script>
          <script src="newjs/lib/angular-animate.js"></script>
          <script src="newjs/lib/angular-aria.js"></script>
          <script src="newjs/lib/angular-ui-router.js"></script>
          <script src="newjs/lib/angular-material.js"></script>
          <script src="newjs/lib/md-data-table.js"></script>

          <script src="newjs/cloudstack.js"></script>

          <script src="newjs/config/config.js"></script>

          <script src="newjs/directives/listView.js"></script>
          <script src="newjs/directives/detailView.js"></script>

          <script src="newjs/services/apiService.js"></script>
          <script src="newjs/services/asyncService.js"></script>
          <script src="newjs/services/authenticationService.js"></script>
          <script src="newjs/services/httpService.js"></script>
          <script src="newjs/services/loadingService.js"></script>
          <script src="newjs/services/notificationService.js"></script>
          <script src="newjs/services/utilityService.js"></script>

          <script src="newjs/controllers/baseCtrl.js"></script>
          <script src="newjs/controllers/headerCtrl.js"></script>
          <script src="newjs/controllers/loginCtrl.js"></script>

          <script src="newjs/controllers/configuration/configurationCtrl.js"></script>

          <script src="newjs/controllers/virtualMachine/virtualMachineCtrl.js"></script>
          <script src="newjs/controllers/virtualMachine/virtualMachineDetailCtrl.js"></script>

    </body>
</html>
