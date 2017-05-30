let settingsProformaController = function($rootScope, Upload, $timeout, toastr, settingsService, $http,invoiceService) {
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
      { sizeX: 24, sizeY: 3, row: 5, col: 0, name: "widget_8", data:"", type: 'String' , edit:false}   
    ];
  };

  // gridstack vars
  this.widgets = new this.widgetsModel();
  this.widgetOverflow = false;
  $this.onWidgetChange = function(event, $element, widget) {
    let totalSizeY = 0;
    let widgets = _.groupBy(this.widgets, 'row');
    angular.forEach(widgets, function(value, key) {
       let max = _.max(value, val=> val.sizeY);
       return totalSizeY += max.sizeY;     
    });
    return $this.checkWidgetOverFlow(totalSizeY);
  };

  $this.checkWidgetOverFlow = function(sizeY) {
    if (sizeY > $this.maxRows) {
      toastr.warning('Max Page Size Exceeded.');
      return this.widgetOverflow = true;
    } else {
      return this.widgetOverflow = false;
    }
  };

  $this.maxRows = 20;
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
    resizable: {
      enabled: true,
      handles: ['e','s', 'se', 'sw', 'nw'],
      stop(event, $element, widget) {
        return $this.onWidgetChange(event, $element, widget);
      }
    },
    draggable: {
       enabled: true, 
       handle: '.move-widget',
       stop(event, $element, widget) {
        return $this.onWidgetChange(event, $element, widget);
      }
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
    this.success = res => $this.templateList = _.sortBy(res.body, 'name');
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

  $this.parseData = (source, dest) =>
    _.each(source.sections, (sec, sIdx) =>
      _.each(dest.sections, function(dec,dIdx) {
        if (sIDx === dIdx) {
          dec.styles.left = sec.leftOfBlock + '%';
          return dec.styles.top = sec.topOfBlockt + '%';
        }
      })
    )
  ;

  this.getTemplate = function(item, operation) {
    this.success = function(res) {
      this.htmlData = JSON.parse(res.body.htmlData);
      // $this.parseData(res.body, @htmlData)
      $this.widgets = [];
      $this.selectedTemplate = res.body;
      $this.updateTemplate = true;
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
        return num = num + 1;
      });
      return $this.showTemplate = !$this.showTemplate;
    };
    this.failure = function(res) {
      if (res.data.code !== "NOT_FOUND") {
        return toastr.error(res.data.message);
      }
    };
    let reqparam = {
      companyUniqueName : $rootScope.selectedCompany.uniqueName,
      templateUniqueName : item.uniqueName,
      operation
    };
    return settingsService.getTemplate(reqparam).then(this.success, this.failure);
  };


  this.deleteTemplate = function(item) {
    this.success = function(res) {
      toastr.success(res.body);
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
      companyUniqueName : $rootScope.selectedCompany.uniqueName,
      type: 'proforma'
    };
    let url = `company/${$rootScope.selectedCompany.uniqueName}/placeholders?type=${reqparam.type}`;
    return $http.get(url, {reqParam: reqparam}).then(this.success, this.failure);
  };


  this.updateProformaTemplates = function() {
    this.success = res => toastr.success(res.body);
    this.failure = res => toastr.error(res.data.message);
    let template = {};
    template.name = $this.selectedTemplate.name;
    template.uniqueName = $this.selectedTemplate.uniqueName;
    template.type = "proforma";
    template.sections = [];
    template.htmlData = {};
    template.htmlData.sections = [];
    template.variables = [];
    _.each(this.widgets, function(wid) {
      let widget = {};
      widget.height = wid.sizeY;
      widget.width = wid.sizeX;
      widget.entity = wid.type;
      widget.column = wid.col;
      widget.row = wid.row;
      widget.data = wid.data;
      template.sections.push(widget);
      let section = {};
      section.styles = {};
      section.styles.height = ((widget.height/24) *100) + '%';
      section.styles.width = ((widget.width/24) *100) + '%';
      section.type = wid.type;
      section.elements = himalaya.parse(wid.data);
      $this.formatEditables(section.elements);
      return template.htmlData.sections.push(section);
    });  
    template.htmlData = JSON.stringify(template.htmlData);
    $this.matchVariables(template);
    let reqparam = {};
    reqparam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
    reqparam.templateUniqueName = template.uniqueName;
    reqparam.operation = 'update';
    return settingsService.update(reqparam, template).then(this.success, this.failure);
  };

  $timeout(( function() {
    $this.getPlaceholders();
    return $this.getAllTemplates();
  }),2000);

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
    this.widgetOverflow = false;
    return this.widgets = new this.widgetsModel();
  };

  this.showAddTemplate = function() {
    $this.resetTemplate();
    $this.showTemplate = !$this.showTemplate;
    return $this.updateTemplate = false;
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

    $this.widgets.push(newWidget);
    return $this.onWidgetChange();
  };

  this.removeWidget = function(w) {
    let index = $this.widgets.indexOf(w);
    $this.widgets.splice(index, 1);
    return $this.onWidgetChange();
  };

  $this.parseChildren = data =>
    _.each(data, function(el) {
      if (el.type === 'Element') {
        if (el.children.length > 0) {
          $this.parseChildren(el.children);
        }
      }
      if (el.type === 'Text') {
        if (el.content === "\n") {
          el.content = "<br>";
        }
        if (el.content === "&nbsp;") {
          return el.content = " ";
        }
      }
    })
  ;

  $this.matchVariables = template =>
    _.each($rootScope.placeholders, function(ph) {
      if (template.htmlData.indexOf(ph.name) !== -1) {
        template.variables.push(ph.name);
      }
      if ((template.htmlData.indexOf('$accountName') !== -1)  && (template.htmlData.indexOf("$accountUniqueName") === -1)) {
        return template.variables.push("$accountUniqueName");
      }
    })
  ;

  $this.formatEditables = elements =>
    _.each(elements, function(elem) {
      if (elem.type === 'Text') {
        let newElem = null;
        _.each($rootScope.placeholders,function(pl) {
          if ((elem.type === 'Text') && (elem.content.indexOf(pl.name) !== -1) && (elem.content !== pl.name)) {
            elem.content = elem.content.replace(pl.name, `<p>${pl.name}</p>`);
            newElem = himalaya.parse(elem.content);
            elem.type = 'Element';
            elem.attributes = {};
            elem.tagName = 'p';
            delete elem.content;
            return elem.children = newElem;
          } else if (elem.content === pl.name) {
            elem.hasVar = true;
            return elem.model = pl.name;
          }
        });
      }
      if ((elem.children !== undefined) && (elem.children.length > 0)) {
        return $this.formatEditables(elem.children);
      }
    })
  ;

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
      $this.convertSectionToHtmlData(template);
      $this.matchVariables(template);
      let reqparam = {};
      reqparam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
      return settingsService.save(reqparam, template).then(this.success, this.failure);
    }
  };


  this.convertSectionToHtmlData = function(template) {
    template.name = $this.templateName;
    template.type = "proforma";
    template.sections = [];
    template.htmlData = {};
    template.htmlData.sections = [];
    template.variables = [];
    _.each(this.widgets, function(wid) {
      let widget = {};
      widget.height = wid.sizeY;
      widget.width = wid.sizeX;
      widget.entity = wid.type;
      widget.column = wid.col;
      widget.row = wid.row;
      widget.data = wid.data;
      template.sections.push(widget);
      let section = {};
      section.styles = {};
      section.styles.height = ((widget.height/24) *100) + '%';
      section.styles.width = ((widget.width/24) *100) + '%';
      section.type = wid.type;
      section.elements = himalaya.parse(wid.data);
      $this.formatEditables(section.elements);
      return template.htmlData.sections.push(section);
    });

    template.htmlData = JSON.stringify(template.htmlData);
    return template;
  };

  this.resetUpload =()=> console.log("resetUpload");


  // upload Images
//   @uploadImages =(files,type, item, reset)->
//     angular.forEach files, (file) ->
//       file.fType = type
// #      console.log file
//       fileData = {
//         file: file
//         fType: type
//       }
//       if reset
//         fileData.file = ""
//       file.upload = Upload.upload(
//         url: '/upload/' + $rootScope.selectedCompany.uniqueName + '/logo'
//         # file: file
//         # fType: type
//         data : fileData
//       )
//       file.upload.then ((res) ->
//         item.data = res.data.body.path
//         toastr.success("Logo uploaded successfully")
//       ), ((res) ->
//         toastr.failure("Logo Upload Failed")
//       ), (evt) ->
//         console.log "file upload progress" ,Math.min(100, parseInt(100.0 * evt.loaded / evt.total))
  
  this.uploadImages =function(type, item, reset){
    if (reset) {
      item.data = "";
      return item.showImage = false;
    } else {
      let file = document.getElementById('proformaLogo').files[0];
      let formData = new FormData();
      formData.append('file', file);
      formData.append('company', $rootScope.selectedCompany.uniqueName);
      formData.append('type', type);
    
      this.success = function(res) {
        item.data = res.data.body.path;
        item.showImage = true;
        return toastr.success("Logo uploaded successfully");
      };

      this.failure = res => toastr.failure("Logo Upload Failed");

      let url = `/upload/${$rootScope.selectedCompany.uniqueName}/logo`;
      return $http.post(url, formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      }).then(this.success, this.failure);
    }
  };

  this.setDefTemp = function(value) {
    this.success = function(res) {
      toastr.success("Default template changed successfully");
      return $this.getAllTemplates();
    };
    this.failure = res => toastr.failure(res.data.message);
    if (value.isDefault) {
      let reqParam = {};
      reqParam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
      let reqBody = {};
      reqBody.templateUniqueName = value.uniqueName;
      return invoiceService.setDefaultProformaTemplate(reqParam, reqBody).then(this.success, this.failure);
    }
  };

};
settingsProformaController.$inject = ['$rootScope', 'Upload', '$timeout', 'toastr', 'settingsService', '$http','invoiceService'];

giddh.webApp.controller('settingsProformaController', settingsProformaController);



