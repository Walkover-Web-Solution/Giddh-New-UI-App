//Service : Audit Logs : HttpService
import { electronUrl, webUrl } from '../../app.constants';
window.app = giddh.webApp;
(function(app){

	app.AuditLogsHttpService = ng.core.Injectable().Class({
	    constructor: [ng.http.Http,  function(http){
		    this.http = http;
		    this.selectedCompany = {};
		    this.update = new ng.core.EventEmitter();
	    }],

	    getLogs: function(reqBody){
		  	// get and set selected Company
		  	var selectedCompany;
	        var usrInfo = JSON.parse(window.localStorage.getItem('giddh._selectedCompany'));

	        usrInfo != null ? selectedCompany = usrInfo : selectedCompany = app.logs.selectedCompany;

	        // Define request variables
		  	var body = JSON.stringify(reqBody.body)
		  	var headers = new ng.http.Headers({ 'Content-Type': 'application/json', 'Auth-Key': window.sessionStorage.getItem('_ak') });
		  	var options = new ng.http.RequestOptions({ headers: headers });
		  	var page = reqBody.page;
            var url = null;
            if (isElectron) {
                url = 'http://apitest.giddh.com/' + electronUrl.AuditLogsHttpService.getLogs.replace(':companyUniqueName', selectedCompany.uniqueName).replace(':page', page);
            } else {
                url = webUrl.AuditLogsHttpService.getLogs.replace(':companyUniqueName', selectedCompany.uniqueName).replace(':page', page)
            }

		    // return http request as observer
		    return this.http.post(url,body, options)
		      .map(function (res) {
		          return res;
		    });
	    }
	});

})(app = giddh.webApp || (giddh.webApp = {}));


