
// Used for libraries that do not work with require or node_modules
var AddGlobal = require('./util/AddGlobal.js');
AddGlobal(require('./lib/js/aui-min.js.txt'));
AddGlobal('./assets/font-awesome/css/font-awesome.4.7.0.min.css.txt', 'style');
// CSS
require('./lib/css/aui-css/css/bootstrap.min.css');
//require('./lib/css/font-awesome/css/font-awesome.4.7.0.min.css');
require('./style.css');
// JS
var Helpers = require('./util/Helpers.js');
//var Mith = require('./util/Mith.js'); // here for example only. included through webpack's ProvidePlugin

class MainWidget extends Mith {
  init(ctrl) {
    ctrl.who = m.prop('World')
    ctrl.formConfig = function( element, init, context ){
      // We don't want to add the class all the time, only the first time the element is created
      if( !init ){
        var formInstance;
        YUI({ filter:'raw' }).use(
          'aui-form-validator',
          function(Y) {
            formInstance = new Y.FormValidator(
              {
                boundingBox: element
              }
            );
          }
        );
        
        // We can also bind an event to trigger behaviour when the element is destroyed
        context.onunload = function(){
          // …But this will never happen because our code doesn't do that ;)
          formInstance.destroy();
        };
      }
    }
    var basicTimeline = anime.timeline();
    ctrl.listConfig = function( element, init, context ){
      if( !init ){
        // do an animation when it is added
        basicTimeline.add({
          targets: element,
          translateX: '30%',
          offset: '-=700'
        });
      }
    }

    var listTable = new PouchDB('mithrilPouchExample');
    /*listTable.createIndex({ // old code works with PouchDB-find
        index: {
            fields: ['name']
        }
    });*/
    // create an index (only create if there is a lot of data and you are filtering based on index)
    var ddoc = {
      _id: '_design/dateAddedIndex',
      views: {
        dateAddedIndex: {
          map: function mapFun(doc, emit) {
            if (doc.dateAdded) {
              emit(doc.dateAdded);
            }
          }.toString()
        }
      }
    }

    ctrl.list = ['bla', 'bla2'];
    // save the design doc
    listTable.put(ddoc).catch(function (err) {
      if (err.name !== 'conflict') {
        throw err;
      }
      // ignore if doc already exists
    }).then(function () {
      return listTable.query(function(doc, emit) {
        // TODO date compare fail
        //if (new Date(doc.dateAdded) > new Date(2016, 12, 4, 15)) {
        //if (moment(doc.dateAdded) < moment(new Date(2016, 12, 4, 15))) {
        if(doc.name > 100){
          emit(doc);
        }
        //}
      });
    }).then(function (result) {
      for(var a of result.rows){
        ctrl.list.push(a.key.name); // need to push to an array with a Mithril map
      }
      m.redraw(); // seem to need to do this inside of a promise
    }).catch(function (err) {
      console.log(err);
    });
    ctrl.onSubmit = function(){
      listTable.put({
        _id: Helpers.guid(), // don't care about uniqueness of any field
        name: ctrl.who(),
        dateAdded: moment().toDate()
      }).then(function (response) {
        ctrl.list.push(ctrl.who());
        m.redraw();
      }).catch(function (err) {
        alert("failed to save to database error: " + err.message);
      });
      return false; // tells the form not to post/add args and reload page
    }
  }

  view(ctrl) {
    return <div style="margin: 10px;">
      <h1>Hello {ctrl.who()}!</h1>
      <form config={ctrl.formConfig} onsubmit={ctrl.onSubmit}>
        <div class="form-group">
          <i class="fa fa-address-book-o fa-1x"></i>
          <label class="control-label" for="Name">&nbsp; Name:</label>
          <div class="controls">
            <input name="Name" class="form-control field-required field-digits" type="text"
              oninput={m.withAttr("value", ctrl.who)} value={ctrl.who()} />
          </div>
        </div>

        <input class="btn btn-info" type="submit" value="Submit"/>
      </form>

      <label style="margin-top: 20px">Submitted names above 100:</label>
      <div style="overflow: hidden;">
        {ctrl.list.map(function(val, index) {
            return <div config={ctrl.listConfig}>{val}</div>
        })}
      </div>
    </div>
  }
}

m.mount(document.body, new MainWidget());