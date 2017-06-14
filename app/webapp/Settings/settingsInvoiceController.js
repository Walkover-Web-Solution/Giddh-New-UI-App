let SettingsInvoiceController = function($scope, $rootScope, Upload, $timeout, toastr, settingsService, $http, localStorageService, $sce) {
  if (_.isUndefined($rootScope.selectedCompany)) {
    $rootScope.selectedCompany = localStorageService.get('_selectedCompany');
  }
  this.Upload = Upload;
  this.$rootScope = $rootScope;
  this.$timeout = $timeout;
  this.toastr = toastr;
  // assign universal this for ctrl
  let $this = this;

  this.showTemplate = false;
  this.tempTypes = [ "Image", "String", "Entry"];
  this.tempType = "String";
  this.showtoolbar = false;
  this.selectedTemplate = {};
  this.updateTemplate = false;
  this.templateList = {};
  this.defaultUniqueName = "defaultinvoicetemplate";
  this.templateType = "invoice";

  this.people = [
    { label: 'Joe'},
    { label: 'Mike'},
    { label: 'Diane'}
  ];


  this.widgetsModel = function() {
    return this.model =  [
      { sizeX: 8, sizeY: 4, row: 1, col: 0, name: "widget_0", data:"", type: 'Image' , edit:false},
      { sizeX: 8, sizeY: 4, row: 1, col: 8, name: "widget_1", data:"", type: 'String' , edit:false},
      { sizeX: 8, sizeY: 4, row: 1, col: 17, name: "widget_2", data:"", type: 'String', edit:false},
      { sizeX: 12, sizeY: 4, row: 2, col: 0, name: "widget_3", data:"", type: 'String', edit:false},
      { sizeX: 12, sizeY: 4, row: 2, col: 13, name: "widget_4", data:"", type: 'String', edit:false},
      { sizeX: 24, sizeY: 5, row: 3, col: 0, name: "widget_5", data:"Particular will be shown here", type: 'Entry' , edit:false},
      { sizeX: 12, sizeY: 4, row: 4, col: 0, name: "widget_6", data:"", type: 'String', edit:false},
      { sizeX: 12, sizeY: 4, row: 4, col: 13, name: "widget_7", data:"", type: 'String', edit:false},
      { sizeX: 24, sizeY: 2, row: 5, col: 0, name: "widget_8", data:"", type: 'String' , edit:false}
    ];
  };

  // gridstack vars
  this.widgets = new this.widgetsModel();

  this.gridsterOptions = {
    columns: 24,
    pushing: true,
    floating: true,
    swapping: true,
    width: 'auto',
    colWidth: 'auto',
    rowHeight: 50,
    margins: [5, 5], // the pixel distance between each widget
    outerMargin: true, // whether margins apply to outer edges of the grid
    sparse: false, // "true" can increase performance of dragging and resizing for big grid (e.g. 20x50)
    isMobile: false, // stacks the grid items if true
    mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
    mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
    minColumns: 1, // the minimum columns the grid must have
    minRows: 2, // the minimum height of the grid, in rows
    maxRows: 20,
    resizable: {
       enabled: true,
       handles: ['e','s', 'se', 'sw', 'nw']
    },
    draggable: {
       enabled: true,
       handle: '.move-widget'
    }
  };

  $rootScope.placeholders = [
    { name: 'Tyra Porcelli' },
    { name: 'Brigid Reddish' },
    { name: 'Ashely Buckler' },
    { name: 'Teddy Whelan' }
  ];


  this.showToolbar = function() {
    if (!this.showtoolbar) {
      $rootScope.tinymceOptions.toolbar = 'styleselect | bold italic';
    } else {
      $rootScope.tinymceOptions.toolbar = false;
    }
    return this.showtoolbar = !this.showtoolbar;
  };

  this.getAllTemplates = function() {
    this.success = res => $this.templateList = res.body;
    this.failure = function(res) {
      if (res.data.code !== "NOT_FOUND") {
        return toastr.error(res.data.message);
      }
    };
    let reqparam = {
      companyUniqueName : $rootScope.selectedCompany.uniqueName
    };
    return settingsService.getAllTemplates(reqparam).then(this.success, this.failure);
  };


  this.consoleFields = () => console.log($this.selectedTemplate);

  this.getTemplate = function(item) {
    this.success = function(res) {
      $this.widgets = [];
      $this.selectedTemplate = res.body;
      $this.selectedTemplate.htmlData = {};
      $this.selectedTemplate.htmlData.variables = [];
      $this.selectedTemplate.htmlData.sections = [];
      if (item.uniqueName !== $this.defaultUniqueName) {
        $this.updateTemplate = true;
      }
      let num = 0;
      _.each($this.selectedTemplate.sections, function(sect) {
        let pushThis = {};
        pushThis.col = sect.column;
        pushThis.row = sect.row;
        pushThis.data = sect.data;
        pushThis.type = sect.entity;
        pushThis.sizeX = sect.width;
        pushThis.sizeY = sect.height;
        pushThis.edit = false;
        pushThis.name = `widget_${num}`;
        $this.widgets.push(pushThis);
        $this.selectedTemplate.sections[num].fields = [];
        let count = 0;
        sect.dataObject = [];
        sect.dataObject = himalaya.parse(sect.data);
        $this.selectedTemplate.htmlData.sections.push(sect.dataObject);
        _.each($rootScope.placeholders, function(placeThis) {
          if (sect.data.contains(placeThis.name)) {
            let addField = {};
            addField.name = placeThis.name;
            addField.value = "";
            $this.selectedTemplate.sections[num].fields.push(addField);
            $this.selectedTemplate.htmlData.variables.push(addField);
//            str = $sce.trustAsHtml("<input ng-model='item.fields["+count+"].value' placeholder='{{item.fields["+count+"].name}}' ng-model-options='{ getterSetter: true }' class='form-control'>")
//            sect.data = sect.data.replace(placeThis.name, str)
            return count++;
          }
        });
//        sect.data = sect.data.replace(/$/,"<input>");
        return num = num + 1;
      });
      console.log($this.selectedTemplate);
      $this.showTemplate = true;
      return $timeout(( function() {
        return $timeout(this);
      }),2000);
    };
    this.failure = function(res) {
      if (res.data.code !== "NOT_FOUND") {
        return toastr.error(res.data.message);
      }
    };
    let reqparam = {
      companyUniqueName : $rootScope.selectedCompany.uniqueName,
      templateUniqueName : item.uniqueName
    };
    return settingsService.getTemplate(reqparam).then(this.success, this.failure);
  };


  this.convertHtmlToJSON = function(data) {};



  this.deleteTemplate = function(item) {
    this.success = function(res) {
      toastr.success(res.body);
      $this.showTemplate = false;
      return $this.getAllTemplates();
    };
    this.failure = res => toastr.error(res.data.message);
    let reqparam = {
      companyUniqueName : $rootScope.selectedCompany.uniqueName,
      templateUniqueName : item.uniqueName
    };
    return settingsService.deleteTemplate(reqparam).then(this.success, this.failure);
  };

  this.getPlaceholders = function(query, process, delimeter) {
    this.success = function(res) {
      $rootScope.placeholders = [];
      _.each(res.data.body, function(param) {
        let addThis = {name: param};
        return $rootScope.placeholders.push(addThis);
      });
      return $rootScope.tinymceOptions.mentions.source = $rootScope.placeholders;
    };
    this.failure = res => toastr.error(res.data.message);
    let reqparam = {
      companyUniqueName : $rootScope.selectedCompany.uniqueName
    };
    let url = `company/${$rootScope.selectedCompany.uniqueName}/placeholders`;
    return $http.get(url, {reqParam: reqparam}).then(this.success, this.failure);
  };


  this.updateTemplates = function() {
    this.success = function(res) {
      toastr.success(res.body);
      $this.showTemplate = false;
      return $this.getAllTemplates();
    };
    this.failure = res => toastr.error(res.data.message);
    let template = {};
    template.name = $this.selectedTemplate.name;
    template.type = $this.templateType;
    template.sections = [];
    _.each($this.widgets, function(wid) {
      let widget = {};
      widget.height = wid.sizeY;
      widget.width = wid.sizeX;
      widget.entity = wid.type;
      widget.column = wid.col;
      widget.row = wid.row;
      widget.data = wid.data;
      return template.sections.push(widget);
    });
    let reqparam = {};
    reqparam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
    reqparam.templateUniqueName = $this.selectedTemplate.uniqueName;
    return settingsService.update(reqparam, template).then(this.success, this.failure);
  };

  $timeout(( () => $this.getPlaceholders()),1000);
  $timeout(( () => $this.getAllTemplates()),2000);

  this.listDoubleClick = function(item) {
    if (item.type === 'Entry') {
      return;
    } else {
      return item.edit = true;
    }
  };

  $rootScope.tinymceOptions = {
    onChange(e) {
      // put logic here for keypress and cut/paste changes
    },
    inline: false,
    plugins: 'mention',
    skin: 'lightgray',
    theme: 'modern',
    menubar : false,
    statusbar: false,
    toolbar : 'styleselect | bold italic',
    delimiter : '$',
    mentions : {
      source: $rootScope.placeholders
    }
  };

  // @modifyInput = (text,e) ->
  //   if e.keyCode == 13
  //     text += "<br/>"
  //   console.log text

  this.resetTemplate = function() {
    return this.widgets = new this.widgetsModel();
  };

  this.showAddTemplate = function() {
    $this.resetTemplate();
    return $this.showTemplate = !$this.showTemplate;
  };

  this.getWidgetArrLength = () => $this.widgets.length;

  this.getLastRowPos = () =>
    _.max($this.widgets, obj=> obj.row)
  ;

  this.checkEntryWidget = () => _.findWhere($this.widgets, {type: 'Entry'});

  this.addWidget = function() {
    let getLastRow = $this.getLastRowPos();
    let getLastRowPos = getLastRow.row + getLastRow.sizeY;
    let getLastWidName = `widget_${$this.getWidgetArrLength()}`;

    // init obj with default param
    let newWidget = { sizeX: 12, sizeY: 2, row: getLastRowPos, col: 0, name: getLastWidName, data:"", type: $this.tempType };

    // "Image", "String", "Entry", "Tosec"
    switch ($this.tempType) {
      case 'Entry':
        // checking if already have entry widget than prevent user to add new one
        let isHaveEntryWidgetObj = $this.checkEntryWidget();
        if (!_.isUndefined(isHaveEntryWidgetObj)) {
          $this.toastr.warning("Can't add more than once Entry widget", "Warning");
          return false;
        } else {
          newWidget.sizeX = 24;
          newWidget.sizeY = 4;
          newWidget.maxSizeY= 4;
        }
        break;
      default:
        console.log("Else case");
    }

    return $this.widgets.push(newWidget);
  };

  this.removeWidget = function(w) {
    let index = $this.widgets.indexOf(w);
    return $this.widgets.splice(index, 1);
  };

  this.saveTemplate = function() {

    this.success = function(res) {
      toastr.success(res.body);
      $this.showTemplate = false;
      return $this.getAllTemplates();
    };

    this.failure = res => toastr.error(res.data.message);

    if (_.isUndefined($this.templateName) || _.isEmpty($this.templateName)) {
      return $this.toastr.warning("Template name can't be empty", "Warning");
    } else {
      let template = {};
      template.name = $this.templateName;
      template.type = $this.templateType;
      template.sections = [];
      _.each($this.widgets, function(wid) {
        let widget = {};
        widget.height = wid.sizeY;
        widget.width = wid.sizeX;
        widget.entity = wid.type;
        widget.column = wid.col;
        widget.row = wid.row;
        widget.data = wid.data;
        return template.sections.push(widget);
      });
      let reqparam = {};
      reqparam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
      return settingsService.save(reqparam, template).then(this.success, this.failure);
    }
  };

  this.resetUpload =()=> console.log("resetUpload");


//  $(document).on('click', (e) ->
//    _.each($this.widgets, (wid) ->
//      wid.edit = false
//    )
//  )

  // upload Images
  this.uploadImages =(files,type, item)=>
    angular.forEach(files, function(file) {
      file.fType = type;
//      console.log file
      file.upload = Upload.upload({
        url: `/upload/${$rootScope.selectedCompany.uniqueName}/logo`,
        // file: file
        // fType: type
        data : {
          file,
          fType: type
        }
      });
      return file.upload.then((function(res) {
        item.data = res.data.body.path;
        return toastr.success("Logo uploaded successfully");
      }), (res => toastr.failure("Logo Upload Failed")), evt => console.log("file upload progress" ,Math.min(100, parseInt((100.0 * evt.loaded) / evt.total))));
    })
  ;
  return;

  return this.setDefTemp = function(someValue) {};
};


SettingsInvoiceController.$inject = ['$scope', '$rootScope', 'Upload', '$timeout', 'toastr', 'settingsService', '$http', 'localStorageService', '$sce'];

giddh.webApp.controller('SettingsInvoiceController', SettingsInvoiceController);