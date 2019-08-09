"use strict";

(function()
{
  if (window.script_tools === undefined) {
    window.script_tools = {};
  } else {
    if (window.script_tools.parseTablableData !== undefined) {
      console.warn("parseTablableData has already been declared");
      return -1;
    }
  }

  var add$ = script_tools.advancedCreateE;
  
  function fn (tablableData)
  {
    var tblD = tablableData;

    var thead, tbody, tfoot;

    if(tblD.data === undefined)
    {
      console.warn("Call to parseTablableData has no data");
      return add$({name: "table"});
    }

    if(tblD.meta !== undefined)
    {
      var tbHeadrs = [];
      for (var i = 0; i < tblD.meta.length; i++)
      {
        tbHeadrs.push( add$(  {name: "th", text: tblD.meta[i].title}  ) );
      }

      thead = add$(
      {
        name: "thead",
        childs: [
          add$( {name: "tr", childs: tbHeadrs } )
        ]
      } );
      
      var tbRows = [];

      var _loopI= function(_i)
      {
        tds = [];

        var _loopJ= function(_j)
        {
          var nCV = {name: "td"};
          nCV.childs = [];

          var nT = "";


          if (tblD.meta[_j].name !== undefined)
          {
            nT = tblD.data[_i][ tblD.meta[_j].name ];
          }

          if (tblD.meta[_j].calc !== undefined)
          {
            nT = tblD.meta[_j].calc( tblD.data[_i] );
          }

          if( tblD.meta[_j].link !== undefined )  
          {
            nCV.childs.push(
              add$(
              {
                name: "a",
                text: nT,
                attrs: { href: tblD.meta[_j].link( tblD.data[_i] ) },
                childs: [ add$({name:"span"}) ]
              } )
            );
          }
          else
          {
            nCV.text = nT;
          }

          if ( tblD.meta[_j].events !== undefined)
          {
            nCV.events = [];

            var _loopK= function(_k)
            {
              nCV.events.push( {
                name: tblD.meta[_j].events[_k].name,
                action: function (e)
                {
                  var fn = tblD.meta[_j].events[_k].action.bind(this, e, tblD.data[_i]);
                  fn();
                }
              } );
            }

            for (var k = 0; k < tblD.meta[_j].events.length; k++)
            {
              _loopK(k);
            }
          }

          tds.push( add$( nCV ) );
        }

        for (var j = 0; j < tblD.meta.length; j++) {
          _loopJ(j);
        }

        tbRows.push( add$(  {name: "tr", childs: tds}  ) );
      }

      for (var i = 0; i < tblD.data.length; i++)
      {
        _loopI(i);
      }

      tbody = add$({
        name: "tbody",
        childs: tbRows
      })

      tfoot = null;
    }
    else
    {
      var tbHeadrs = [];
      var tbDK = Object.keys(tblD.data[0]);

      for (var i = 0; i < tbDK.length; i++)
      {
        tbHeadrs.push(
          add$({ name: "th", text: tbDK[i] })
        );
      }

      thead = add$(
      {
        name: "thead",
        childs: [
          add$( {name: "tr", childs: tbHeadrs } )
        ]
      } );

      var tbRows = [];
      for (var i = 0; i < tblD.data.length; i++)
      {
        var tds = [];

        for (var _j = 0; _j < tbDK.length; _j++)
        {
          tds.push( add$(  {name: "td", text: tblD.data[i][ tbDK[_j] ] }  ) );
        }

        tbRows.push( add$(  {name: "tr", childs : tds}  ) );
      }

      tbody = add$(
      {
        name: "tbody",
        childs: tbRows
      } );

      tfoot = null;
    }
    
    return add$({
      name : "table", attrs : {class: "tabled-data"},
      childs : [
        thead,
        tbody,
        tfoot
      ]
    } );
  };

  window.script_tools.parseTablableData = fn;
}) ();